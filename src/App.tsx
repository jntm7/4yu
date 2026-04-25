import { useState } from "react";
import { getDailyIdiom } from "./lib/daily";
import "./App.css";
import FlipDate from "./components/FlipDate";

type Lang = "en" | "zh-Hans" | "zh-Hant";

const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  "zh-Hans": "简体",
  "zh-Hant": "繁體",
};

const SECTION_LABELS: Record<string, Record<Lang, string>> = {
  today: { en: "Today's Chengyu", "zh-Hans": "今日成语", "zh-Hant": "今日成語" },
  definition: { en: "Definition", "zh-Hans": "释义", "zh-Hant": "釋義" },
  origin: { en: "Origin", "zh-Hans": "出处", "zh-Hant": "出處" },
  example: { en: "Example", "zh-Hans": "例句", "zh-Hant": "例句" },
};

function App() {
  const [lang, setLang] = useState<Lang>("zh-Hans");
  const idiom = getDailyIdiom();
  const today = new Date();
  const isSupported = lang === "zh-Hans";

  return (
    <main className="flex min-h-screen flex-col items-center p-8 text-center">
      <div className="flex-shrink-0 mt-12">
        <h1 className="text-5xl font-extrabold tracking-tight" style={{ color: "var(--color-accent)" }}>4Yu</h1>
        <p className="text-lg mt-1" style={{ color: "var(--color-muted)" }}>一日一语</p>

        <div className="mt-6">
          <FlipDate date={today} lang={lang} />
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
        <div className="w-full max-w-xl rounded-2xl p-10 text-left min-h-[420px] flex flex-col shadow-2xl border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-accent)" }}>
          <p className="section-label text-center">{SECTION_LABELS.today[lang]}</p>
          <div className="mx-auto mt-2 mb-8 w-42 h-0.5 rounded" style={{ backgroundColor: "var(--color-accent)" }} />
          <div className="idiom-chars flex justify-center gap-2 mb-8">
            {idiom.word.split("").map((char, i) => {
              const syllable = idiom.pinyin.split(/\s+/)[i] ?? "";
              return (
                <span key={i} className="idiom-char flex flex-col items-center gap-1">
                  <span className="idiom-char-hanzi text-6xl leading-none transition-colors duration-200 cursor-default" style={{ color: "var(--color-text)" }}>{char}</span>
                  <span className="idiom-char-pinyin text-base" style={{ color: "var(--color-muted)" }}>{syllable}</span>
                </span>
              );
            })}
          </div>

          {isSupported ? (
            <div className="flex-grow space-y-4">
              <div>
                <p className="section-label">{SECTION_LABELS.definition[lang]}</p>
                <p className="text-lg leading-relaxed" style={{ color: "var(--color-text)" }}>{idiom.explanation}</p>
              </div>
              {idiom.derivation && (
                <div>
                  <p className="section-label">{SECTION_LABELS.origin[lang]}</p>
                  <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>{idiom.derivation}</p>
                </div>
              )}
              {idiom.example && (
                <div>
                  <p className="section-label">{SECTION_LABELS.example[lang]}</p>
                  <p className="text-base leading-relaxed" style={{ color: "var(--color-muted)" }}>{idiom.example}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-grow space-y-4">
              <div>
                <p className="section-label">{SECTION_LABELS.definition[lang]}</p>
                <p className="text-base" style={{ color: "var(--color-dim)" }}>Coming soon</p>
              </div>
              <div>
                <p className="section-label">{SECTION_LABELS.origin[lang]}</p>
                <p className="text-base" style={{ color: "var(--color-dim)" }}>Coming soon</p>
              </div>
              <div>
                <p className="section-label">{SECTION_LABELS.example[lang]}</p>
                <p className="text-base" style={{ color: "var(--color-dim)" }}>Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex-shrink-0 pb-8">
        <p className="text-xs" style={{ color: "var(--color-dim)" }}>Created with ❤️ by jntm7</p>
      </div>
    </main>
  );
}

export default App;