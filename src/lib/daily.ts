import idioms from "../data/idioms.json";

export type Idiom = {
  word: string;
  wordTraditional: string;
  pinyin: string;
  abbreviation: string;
  explanation: string;
  explanationTraditional: string;
  explanationEn: string;
  derivation: string;
  derivationTraditional: string;
  derivationEn: string | null;
  example: string;
  exampleTraditional: string;
  exampleEn: string | null;
  frequency: number;
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
      i.abbreviation.toLowerCase().includes(q) ||
      i.explanation.includes(query),
  );
}

export function getTotalIdioms(): number {
  return idioms.length;
}