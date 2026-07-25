import { useState, useEffect } from "react";
import { COUNTDOWN_LABELS, DAYS_I18N, MONTHS_I18N, type Lang } from "../lib/i18n";

interface FlipDateProps {
  date: Date;
  lang: Lang;
}

function getTimeUntilReset(): string {
  const now = new Date();
  const nowMountain = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);

  const getPart = (type: string) => nowMountain.find((p) => p.type === type)?.value ?? "0";

  const currentHour = parseInt(getPart("hour"));
  const ampm = getPart("dayPeriod");
  const hour24 = ampm === "PM" && currentHour !== 12 ? currentHour + 12 : ampm === "AM" && currentHour === 12 ? 0 : currentHour;

  const mountainNow = new Date(
    parseInt(getPart("year")),
    parseInt(getPart("month")) - 1,
    parseInt(getPart("day")),
    hour24,
    parseInt(getPart("minute")),
    parseInt(getPart("second"))
  );

  const target = new Date(mountainNow);
  target.setDate(target.getDate() + 1);
  target.setHours(0, 0, 0, 0);

  const diff = target.getTime() - mountainNow.getTime();
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

  const dayOfWeek = DAYS_I18N[lang][date.getDay()];
  const dayNum = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_I18N[lang][date.getMonth()];
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
