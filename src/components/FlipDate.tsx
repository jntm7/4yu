import { useState, useEffect } from "react";

interface FlipDateProps {
  date: Date;
  lang: "en" | "zh-Hans" | "zh-Hant";
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const COUNTDOWN_LABELS: Record<string, string> = {
  en: "Next chengyu in",
  "zh-Hans": "下个成语",
  "zh-Hant": "下個成語",
};

function getTimeUntilReset(): string {
  const now = new Date();
  const target = new Date();
  target.setUTCHours(18, 0, 0, 0);
  if (now.getTime() >= target.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function FlipDate({ date, lang }: FlipDateProps) {
  const [countdown, setCountdown] = useState(getTimeUntilReset());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilReset());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dayOfWeek = DAYS[date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, "0");
  const month = MONTHS[date.getMonth()];
  const year = String(date.getFullYear());

  return (
    <div className="flip-date-container">
      <div className="flip-date">
        <div className="flip-group">
          <FlipCard value={dayOfWeek} wide />
        </div>
        <div className="flip-group">
          <FlipCard value={dayNum[0]} />
          <FlipCard value={dayNum[1]} />
        </div>
        <div className="flip-group">
          <FlipCard value={month} wide />
        </div>
        <div className="flip-group">
          <FlipCard value={year[0]} />
          <FlipCard value={year[1]} />
          <FlipCard value={year[2]} />
          <FlipCard value={year[3]} />
        </div>
      </div>
      <p className="flip-countdown">{COUNTDOWN_LABELS[lang]} {countdown}</p>
    </div>
  );
}

function FlipCard({ value, wide }: { value: string; wide?: boolean }) {
  return (
    <div className={`flip-card ${wide ? "flip-card-wide" : ""}`}>
      {value}
    </div>
  );
}