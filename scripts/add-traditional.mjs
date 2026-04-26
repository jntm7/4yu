import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import opencc from "opencc-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const inputPath = join(ROOT, "src/data/idioms.json");
const outputPath = join(ROOT, "src/data/idioms.json");

const converter = opencc.Converter({ from: "cn", to: "tw" });

const idioms = JSON.parse(readFileSync(inputPath, "utf-8"));

const enriched = idioms.map((item) => ({
  ...item,
  wordTraditional: converter(item.word),
}));

console.log(`Converted ${enriched.length} idioms to traditional Chinese`);
console.log(`Sample: ${enriched[0].word} → ${enriched[0].wordTraditional}`);

writeFileSync(outputPath, JSON.stringify(enriched, null, 2), "utf-8");
console.log(`Written to ${outputPath}`);