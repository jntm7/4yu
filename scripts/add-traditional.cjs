const { readFileSync, writeFileSync } = require("fs");
const { dirname, join } = require("path");
const opencc = require("opencc-js");

const ROOT = join(__dirname, "..");

const inputPath = join(ROOT, "src/data/idioms.json");
const outputPath = join(ROOT, "src/data/idioms.json");

const converter = opencc.Converter({ from: "cn", to: "tw" });

const idioms = JSON.parse(readFileSync(inputPath, "utf-8"));

const enriched = idioms.map((item) => ({
  ...item,
  wordTraditional: converter(item.word),
  explanationTraditional: converter(item.explanation),
  derivationTraditional: item.derivation ? converter(item.derivation) : "",
  exampleTraditional: item.example ? converter(item.example) : "",
}));

console.log(`Converted ${enriched.length} idioms to traditional Chinese`);
console.log(`Sample: ${enriched[0].word} → ${enriched[0].wordTraditional}`);

writeFileSync(outputPath, JSON.stringify(enriched, null, 2), "utf-8");
console.log(`Written to ${outputPath}`);