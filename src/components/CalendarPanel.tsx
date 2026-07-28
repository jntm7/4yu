import { useMemo } from "react";
import { getDailyIdiom } from "../lib/daily";
import {
  formatDayRow,
  formatMonthHeader,
  getYearDaysUpToToday,
  isSameDay,
  isToday,
} from "../lib/dates";
import type { Lang } from "../lib/i18n";

interface CalendarPanelProps {
  lang: Lang;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

interface MonthGroup {
  year: number;
  month: number;
  days: Date[];
}

export default function CalendarPanel({ lang, selectedDate, onSelect }: CalendarPanelProps) {
  const groups = useMemo<MonthGroup[]>(() => {
    const result: MonthGroup[] = [];
    for (const day of getYearDaysUpToToday()) {
      const year = day.getFullYear();
      const month = day.getMonth();
      const last = result[result.length - 1];
      if (last && last.year === year && last.month === month) {
        last.days.push(day);
      } else {
        result.push({ year, month, days: [day] });
      }
    }
    return result;
  }, []);

  return (
    <div className="panel-list">
      {groups.map((group) => (
        <div key={`${group.year}-${group.month}`}>
          <p className="panel-month-header">{formatMonthHeader(group.year, group.month, lang)}</p>
          {group.days.map((day) => {
            const idiom = getDailyIdiom(day);
            const word = lang === "zh-Hant" ? idiom.wordTraditional : idiom.word;
            const classes = ["panel-row"];
            if (isSameDay(day, selectedDate)) classes.push("panel-row-active");
            if (isToday(day)) classes.push("panel-row-today");
            return (
              <button
                key={day.toDateString()}
                className={classes.join(" ")}
                onClick={() => onSelect(day)}
              >
                <span className="panel-row-date">{formatDayRow(day, lang)}</span>
                <span className="panel-row-idiom panel-row-idiom-right">
                  <span className="panel-row-word">{word}</span>
                  <span className="panel-row-pinyin">{idiom.pinyin}</span>
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
