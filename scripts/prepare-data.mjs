import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const rawPath = join(ROOT, "src/data/idioms-raw.json");
const thuoclPath = join(ROOT, "src/data/thuocl-chengyu.txt");
const outputPath = join(ROOT, "src/data/idioms.json");

const raw = JSON.parse(readFileSync(rawPath, "utf-8"));
const thuoclContent = readFileSync(thuoclPath, "utf-8");

const thuoclEntries = thuoclContent
  .split("\n")
  .filter((line) => line.trim())
  .map((line) => {
    const [word, freq] = line.trim().split(/\s+/);
    return { word, freq: parseInt(freq, 10) };
  })
  .filter((e) => e.word && e.word.length === 4 && !isNaN(e.freq));

const thuoclMap = new Map(thuoclEntries.map((e) => [e.word, e.freq]));

const filtered = raw
  .filter((item) => {
    if (!item.word || item.word.length !== 4) return false;
    if (!thuoclMap.has(item.word)) return false;
    return true;
  })
  .map((item) => ({
    word: item.word,
    pinyin: item.pinyin,
    abbreviation: item.abbreviation,
    explanation: item.explanation,
    derivation: item.derivation || "",
    example: item.example || "",
    frequency: thuoclMap.get(item.word),
  }))
  .sort((a, b) => b.frequency - a.frequency);

console.log(`Raw idioms: ${raw.length}`);
console.log(`THUOCL high-frequency: ${thuoclEntries.length}`);
console.log(`Filtered (in both): ${filtered.length}`);

writeFileSync(outputPath, JSON.stringify(filtered, null, 2), "utf-8");
console.log(`Written to ${outputPath}`);