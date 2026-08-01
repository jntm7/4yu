import idioms from "../data/idioms.json";

export type Idiom = {
  word: string;
  wordTraditional: string;
  pinyin: string;
  explanation: string;
  explanationTraditional: string;
  explanationEn: string;
  derivation: string;
  derivationTraditional: string;
  derivationEn: string | null;
  example: string;
  exampleTraditional: string;
  exampleEn: string | null;
};

export function getDailyIdiom(date?: Date): Idiom {
  const d = date ?? new Date();
  const seed =
    d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const index = seed % idioms.length;
  return idioms[index] as Idiom;
}

export function getIdiomByIndex(index: number): Idiom {
  return idioms[index % idioms.length] as Idiom;
}

export function searchIdioms(query: string): Idiom[] {
  const q = query.toLowerCase();
  return (idioms as Idiom[]).filter(
    (i) =>
      i.word.includes(query) ||
      i.pinyin.toLowerCase().includes(q) ||
      i.explanation.includes(query),
  );
}

export function getRandomIdiom(excludeWord?: string): Idiom {
  const pool = idioms as Idiom[];
  let candidate = pool[Math.floor(Math.random() * pool.length)];
  while (excludeWord && candidate.word === excludeWord) {
    candidate = pool[Math.floor(Math.random() * pool.length)];
  }
  return candidate;
}

export function getIdiomByWord(word: string): Idiom | undefined {
  return (idioms as Idiom[]).find((i) => i.word === word);
}

export function getTotalIdioms(): number {
  return idioms.length;
}