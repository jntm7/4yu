import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDailyIdiom } from "./lib/daily";
import "./App.css";
import FlipDate from "./components/FlipDate";

type Lang = "en" | "zh-Hans" | "zh-Hant";

const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  "zh-Hans": "简体",
  "zh-Hant": "繁體",
};

const NAV_LABELS: Record<"yesterday" | "today", Record<Lang, string>> = {
  yesterday: {
    en: "View Yesterday",
    "zh-Hans": "查看昨天的成语",
    "zh-Hant": "查看昨天的成語",
  },
  today: {
    en: "View Today",
    "zh-Hans": "查看今天的成语",
    "zh-Hant": "查看今天的成語",
  },
};

const SECTION_LABELS: Record<string, Record<Lang, string>> = {
  today: { en: "Today's Chengyu", "zh-Hans": "今天的成语", "zh-Hant": "今天的成語" },
  yesterday: { en: "Yesterday's Chengyu", "zh-Hans": "昨天的成语", "zh-Hant": "昨天的成語" },
  definition: { en: "Definition", "zh-Hans": "释义", "zh-Hant": "釋義" },
  origin: { en: "Origin", "zh-Hans": "出处", "zh-Hant": "出處" },
  example: { en: "Example", "zh-Hans": "例句", "zh-Hant": "例句" },
};

function App() {
  const [lang, setLang] = useState<Lang>("zh-Hans");
  const [showYesterday, setShowYesterday] = useState(false);
  const displayDate = new Date();
  if (showYesterday) {
    displayDate.setDate(displayDate.getDate() - 1);
  }
  const idiom = getDailyIdiom(displayDate);
  const dayKey = showYesterday ? "yesterday" : "today";

  const getExplanation = () => {
    if (lang === "en") return idiom.explanationEn;
    if (lang === "zh-Hant") return idiom.explanationTraditional;
    return idiom.explanation;
  };

  const getDerivation = () => {
    if (lang === "en") return idiom.derivationEn;
    if (lang === "zh-Hant") {
      const val = idiom.derivationTraditional;
      return val === "無" ? null : val;
    }
    const val = idiom.derivation;
    return val === "无" ? null : val;
  };

  const getExample = () => {
    if (lang === "en") return idiom.exampleEn;
    if (lang === "zh-Hant") {
      const val = idiom.exampleTraditional;
      return val === "無" ? null : val;
    }
    const val = idiom.example;
    return val === "无" ? null : val;
  };

  const displayWord = lang === "zh-Hant" ? idiom.wordTraditional : idiom.word;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 text-center">
      <div className="flex-shrink-0 mt-12">
        <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: "var(--color-accent)" }}>4Yu</h1>
        <p className="text-lg mt-1" style={{ color: "var(--color-muted)" }}>一日一语</p>

        <div className="mt-6">
          <FlipDate date={displayDate} lang={lang} />
        </div>

        <div className="my-8">
          <div className="lang-toggle">
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <button
                key={l}
                className={`lang-toggle-btn ${lang === l ? "lang-toggle-active" : ""}`}
                onClick={() => setLang(l)}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full py-6">
        <div className="w-full max-w-xl">
          <div className={`mb-3 flex ${showYesterday ? "justify-end" : "justify-start"}`}>
            {!showYesterday ? (
              <button
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", backgroundColor: "var(--color-card)" }}
                onClick={() => setShowYesterday(true)}
              >
                <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
                {NAV_LABELS.yesterday[lang]}
              </button>
            ) : (
              <button
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)", backgroundColor: "var(--color-card)" }}
                onClick={() => setShowYesterday(false)}
              >
                {NAV_LABELS.today[lang]}
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="rounded-2xl p-10 text-left min-h-[420px] flex flex-col shadow-2xl border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-accent)" }}>
            <p className="section-label text-center">{SECTION_LABELS[dayKey][lang]}</p>
          <div className="mx-auto mt-2 mb-8 w-42 h-0.5 rounded" style={{ backgroundColor: "var(--color-accent)" }} />
          <div className="idiom-chars flex justify-center gap-2 mb-8">
            {displayWord.split("").map((char, i) => {
              const syllable = idiom.pinyin.split(/\s+/)[i] ?? "";
              return (
                <span key={i} className="idiom-char flex flex-col items-center gap-1">
                  <span className="idiom-char-hanzi text-6xl leading-none transition-colors duration-200 cursor-default" style={{ color: "var(--color-text)" }}>{char}</span>
                  <span className="idiom-char-pinyin text-base" style={{ color: "var(--color-muted)" }}>{syllable}</span>
                </span>
              );
            })}
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <p className="section-label">{SECTION_LABELS.definition[lang]}</p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--color-text)" }}>{getExplanation()}</p>
            </div>
            {getDerivation() && (
              <div>
                <p className="section-label">{SECTION_LABELS.origin[lang]}</p>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>{getDerivation()}</p>
              </div>
            )}
            {getExample() && (
              <div>
                <p className="section-label">{SECTION_LABELS.example[lang]}</p>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>{getExample()}</p>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex-shrink-0 pb-8">
        <p className="text-xs" style={{ color: "var(--color-dim)" }}>Created with ♡ by jntm7</p>
      </div>
    </main>
  );
}

export default App;
