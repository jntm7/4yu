import { useCallback, useEffect, useState } from "react";
import { getIdiomByWord, type Idiom } from "../lib/daily";

const STORAGE_KEY = "4yu:bookmarks";

function loadWords(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Keep only strings that still resolve to an idiom (self-healing storage).
    return parsed.filter(
      (w): w is string => typeof w === "string" && getIdiomByWord(w) !== undefined,
    );
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [words, setWords] = useState<string[]>(loadWords);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch {
      // Storage unavailable or full — bookmarks simply won't persist.
    }
  }, [words]);

  const bookmarks = words
    .map((w) => getIdiomByWord(w))
    .filter((i): i is Idiom => i !== undefined);

  const isBookmarked = useCallback((word: string) => words.includes(word), [words]);

  const toggle = useCallback((word: string) => {
    setWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [word, ...prev],
    );
  }, []);

  const remove = useCallback((word: string) => {
    setWords((prev) => prev.filter((w) => w !== word));
  }, []);

  return { bookmarks, isBookmarked, toggle, remove };
}
