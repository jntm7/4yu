import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const inputPath = join(ROOT, "src/data/idioms.json");
const outputPath = join(ROOT, "src/data/idioms.json");

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const BATCH_SIZE = 5;
const SMALL_BATCH_SIZE = 1;
const CONCURRENCY = 3;
const RETRY_DELAY = 5000;

const idioms = JSON.parse(readFileSync(inputPath, "utf-8"));

const needsTranslation = idioms.filter((i: any) => !i.explanationEn);
console.log(`Total idioms: ${idioms.length}`);
console.log(`Needs translation: ${needsTranslation.length}`);

if (needsTranslation.length === 0) {
  console.log("All idioms already translated. Exiting.");
  process.exit(0);
}

if (!API_KEY) {
  console.error("Set DEEPSEEK_API_KEY environment variable.");
  process.exit(1);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function repairJSON(raw: string): any[] | null {
  // Remove markdown code fences if present
  let content = raw.replace(/^```json?\n?/i, "").replace(/\n?```$/i, "").trim();

  // Try direct parse first
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.translations || parsed.data || parsed.results || Object.values(parsed)[0];
  } catch {}

  // Try to find a JSON array in the response
  const arrMatch = content.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch {}
  }

  // Try to find a JSON object and extract array from its values
  const objMatch = content.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      const parsed = JSON.parse(objMatch[0]);
      const arr = parsed.translations || parsed.data || parsed.results || Object.values(parsed)[0];
      if (Array.isArray(arr)) return arr;
    } catch {}
  }

  // Try truncating to last valid } before a } that closes the array
  const lastBrace = content.lastIndexOf("}");
  if (lastBrace > 0) {
    const truncated = content.substring(0, lastBrace + 1);
    // Try to wrap in an object if it looks like an array with trailing issues
    const wrapper = `{"translations": ${truncated.endsWith("]") ? truncated : truncated + "]"}}`;
    try {
      const parsed = JSON.parse(wrapper);
      if (Array.isArray(parsed.translations)) return parsed.translations;
    } catch {}
  }

  return null;
}

async function translateBatch(batch: any[], batchSize: number): Promise<any[]> {
  const prompt = `Translate the following Chinese idioms into English. For each idiom, provide:
- explanationEn: A clear English definition of the idiom's meaning
- derivationEn: A brief English translation of the origin/source (or null if source is "无")
- exampleEn: An English translation of the example usage (or null if example is "无")

Respond with a JSON object containing a "translations" array. Each item must have: word, explanationEn, derivationEn, exampleEn.
Match the "word" field exactly so I can merge results. Ensure all string values are properly escaped for valid JSON.

Idioms:
${JSON.stringify(batch.map((i) => ({ word: i.word, explanation: i.explanation, derivation: i.derivation, example: i.example })))}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: "You are a Chinese-English translator. Respond with valid JSON only, no markdown. All string values must be properly escaped. Do not include raw newlines in string values." },
            { role: "user", content: prompt },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      });

      if (response.status === 429) {
        const waitMs = RETRY_DELAY * (attempt + 2);
        console.log(`  Rate limited, waiting ${waitMs}ms...`);
        await sleep(waitMs);
        continue;
      }

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`API error ${response.status}: ${body.substring(0, 200)}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content as string;

      // Try direct parse
      let results: any[] | null = null;
      try {
        const parsed = JSON.parse(content);
        results = Array.isArray(parsed) ? parsed : parsed.translations || parsed.data || parsed.results || Object.values(parsed)[0];
      } catch {
        // Try repair
        results = repairJSON(content);
      }

      if (!results || !Array.isArray(results)) {
        throw new Error(`Could not parse response as JSON array`);
      }

      return results;
    } catch (err: any) {
      console.error(`  Attempt ${attempt + 1} failed (${batchSize} items, starting with "${batch[0]?.word}"): ${err.message}`);
      // On failure, try smaller batch
      if (attempt === 2 && batchSize > SMALL_BATCH_SIZE && batch.length > 1) {
        console.log(`  Retrying with smaller batches...`);
        const allResults: any[] = [];
        for (const item of batch) {
          const subResults = await translateBatch([item], SMALL_BATCH_SIZE);
          allResults.push(...subResults);
          await sleep(500);
        }
        return allResults;
      }
      if (attempt < 2) await sleep(RETRY_DELAY);
    }
  }

  console.error(`  All retries failed for batch starting with "${batch[0]?.word}"`);
  return [];
}

async function main() {
  const idiomMap = new Map(idioms.map((i: any) => [i.word, i]));
  let completed = idioms.length - needsTranslation.length;

  for (let i = 0; i < needsTranslation.length; i += BATCH_SIZE * CONCURRENCY) {
    const batches: any[][] = [];
    for (let j = 0; j < CONCURRENCY; j++) {
      const start = i + j * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, needsTranslation.length);
      if (start < end) {
        batches.push(needsTranslation.slice(start, end));
      }
    }

    const results = await Promise.all(batches.map((batch) => translateBatch(batch, BATCH_SIZE)));

    for (const batchResults of results) {
      for (const item of batchResults) {
        if (!item.word) continue;
        const existing = idiomMap.get(item.word);
        if (existing) {
          existing.explanationEn = item.explanationEn || "";
          existing.derivationEn = item.derivationEn || null;
          existing.exampleEn = item.exampleEn || null;
        }
      }
    }

    completed += batches.reduce((sum, b) => sum + b.length, 0);
    const pct = ((completed / idioms.length) * 100).toFixed(1);
    console.log(`Progress: ${completed}/${idioms.length} (${pct}%)`);

    writeFileSync(outputPath, JSON.stringify(idioms, null, 2), "utf-8");
    await sleep(1000);
  }

  // Final check for any still-missing idioms
  const stillMissing = idioms.filter((i: any) => !i.explanationEn);
  if (stillMissing.length > 0) {
    console.log(`\nRetrying ${stillMissing.length} still-missing idioms one at a time...`);
    for (const idiom of stillMissing) {
      const results = await translateBatch([idiom], SMALL_BATCH_SIZE);
      for (const item of results) {
        if (!item.word) continue;
        const existing = idiomMap.get(item.word);
        if (existing) {
          existing.explanationEn = item.explanationEn || "";
          existing.derivationEn = item.derivationEn || null;
          existing.exampleEn = item.exampleEn || null;
        }
      }
      writeFileSync(outputPath, JSON.stringify(idioms, null, 2), "utf-8");
      await sleep(500);
    }
  }

  const finalMissing = idioms.filter((i: any) => !i.explanationEn).length;
  writeFileSync(outputPath, JSON.stringify(idioms, null, 2), "utf-8");
  console.log(`\nDone! Translated ${idioms.length - finalMissing}/${idioms.length} idioms.`);
  if (finalMissing > 0) console.log(`Still missing: ${finalMissing}`);
  console.log(`Written to ${outputPath}`);
}

main();