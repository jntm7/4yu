import type { Lang } from "./i18n";

const LOCALES: Record<Lang, string> = {
  en: "en-US",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
};

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function yesterday(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

export function isYesterday(date: Date): boolean {
  return isSameDay(date, yesterday());
}

export function formatFullDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDayRow(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatMonthHeader(year: number, monthIndex: number, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALES[lang], {
    year: "numeric",
    month: "long",
  }).format(new Date(year, monthIndex, 1));
}

/** Days of the current year from Jan 1 through today, newest first. */
export function getYearDaysUpToToday(): Date[] {
  const now = new Date();
  const days: Date[] = [];
  const cursor = new Date(now.getFullYear(), 0, 1);
  while (cursor <= now) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days.reverse();
}
