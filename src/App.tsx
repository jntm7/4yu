import { useEffect, useState } from "react";
import { ArrowRight, Bookmark, Calendar, Copy, Shuffle, Volume2 } from "lucide-react";
import { getDailyIdiom, getRandomIdiom, type Idiom } from "./lib/daily";
import { formatFullDate, isToday, isYesterday } from "./lib/dates";
import { ACTION_LABELS, NAV_LABELS, SECTION_LABELS, TAGLINE, type Lang } from "./lib/i18n";
import { pickBestChineseVoice } from "./lib/speech";
import { useBookmarks } from "./hooks/useBookmarks";
import { useTheme } from "./hooks/useTheme";
import FlipDate from "./components/FlipDate";
import SealLogo from "./components/SealLogo";
import CalendarPanel from "./components/CalendarPanel";
import BookmarksPanel from "./components/BookmarksPanel";
import Drawer from "./components/Drawer";
import LanguageToggle from "./components/LanguageToggle";
import SettingsMenu from "./components/SettingsMenu";
import "./App.css";

type View =
  | { kind: "today" }
  | { kind: "date"; date: Date }
  | { kind: "idiom"; idiom: Idiom; source: "shuffle" | "bookmark" };

type Panel = "none" | "calendar" | "bookmarks";

function App() {
  const [lang, setLang] = useState<Lang>("zh-Hans");
  const [view, setView] = useState<View>({ kind: "today" });
  const [panel, setPanel] = useState<Panel>("none");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { bookmarks, isBookmarked, toggle: toggleBookmark, remove: removeBookmark } =
    useBookmarks();
  const { theme, setTheme } = useTheme();

  const isTodayView = view.kind !== "idiom" && (view.kind === "today" || isToday(view.date));
  const displayDate = view.kind === "date" ? view.date : new Date();
  const idiom = view.kind === "idiom" ? view.idiom : getDailyIdiom(displayDate);
  const bookmarked = isBookmarked(idiom.word);

  const sectionTitle = (() => {
    if (view.kind === "idiom") {
      return view.source === "shuffle"
        ? SECTION_LABELS.random[lang]
        : SECTION_LABELS.bookmark[lang];
    }
    if (view.kind === "today" || isToday(view.date)) return SECTION_LABELS.today[lang];
    if (isYesterday(view.date)) return SECTION_LABELS.yesterday[lang];
    return formatFullDate(view.date, lang);
  })();

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

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    const updateVoices = () => setVoices(synth.getVoices());

    updateVoices();
    synth.addEventListener("voiceschanged", updateVoices);

    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  // Reset transient action state when the displayed idiom changes (render-time
  // adjustment, see https://react.dev/learn/you-might-not-need-an-effect).
  const [lastWord, setLastWord] = useState(displayWord);
  if (lastWord !== displayWord) {
    setLastWord(displayWord);
    setIsSpeaking(false);
    setIsCopied(false);
  }

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timeout = window.setTimeout(() => setIsCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [isCopied]);

  const handlePlayPronunciation = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(displayWord);
    const preferredVoice = pickBestChineseVoice(voices);
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    } else {
      utterance.lang = "zh-CN";
    }
    utterance.rate = 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyIdiom = async () => {
    if (!("clipboard" in navigator)) {
      return;
    }
    try {
      await navigator.clipboard.writeText(displayWord);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  const handleShuffle = () => {
    setView((v) => ({
      kind: "idiom",
      idiom: getRandomIdiom(v.kind === "idiom" ? v.idiom.word : undefined),
      source: "shuffle",
    }));
  };

  const togglePanel = (target: Panel) => {
    setPanel((prev) => (prev === target ? "none" : target));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 text-center">
      <SettingsMenu
        lang={lang}
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex-shrink-0 mt-12">
        <div className="flex items-center justify-center gap-4">
          <SealLogo />
          <h1 className="whitespace-nowrap text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "var(--color-accent)" }}>{TAGLINE[lang]}</h1>
        </div>

        <div className="mt-10">
          <FlipDate date={displayDate} lang={lang} />
        </div>
      </div>

      <div className="flex items-center justify-center w-full py-6">
        <div className="w-full max-w-xl">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                className={`nav-btn ${panel === "calendar" ? "nav-btn-active" : ""}`}
                onClick={() => togglePanel("calendar")}
              >
                <Calendar size={16} strokeWidth={2.25} aria-hidden="true" />
                {NAV_LABELS.browse[lang]}
              </button>
              <button className="nav-btn" onClick={handleShuffle}>
                <Shuffle size={16} strokeWidth={2.25} aria-hidden="true" />
                {NAV_LABELS.random[lang]}
              </button>
              <button
                className={`nav-btn ${panel === "bookmarks" ? "nav-btn-active" : ""}`}
                onClick={() => togglePanel("bookmarks")}
              >
                <Bookmark size={16} strokeWidth={2.25} aria-hidden="true" />
                {NAV_LABELS.bookmarks[lang]}
              </button>
            </div>
            {!isTodayView && (
              <button
                className="nav-btn"
                onClick={() => setView({ kind: "today" })}
              >
                {NAV_LABELS.backToToday[lang]}
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="rounded-2xl sm:p-10 p-6 text-left min-h-[420px] flex flex-col shadow-2xl border" style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-accent)" }}>
            <p className="section-label text-center">{sectionTitle}</p>
            <div className="mx-auto mt-2 mb-8 w-42 h-0.5 rounded" style={{ backgroundColor: "var(--color-accent)" }} />
            <div className="idiom-row mb-8">
              <div className="idiom-audio-stack">
                <span className="idiom-audio-label">{ACTION_LABELS.audio[lang]}</span>
                <button
                  className={`idiom-audio-btn ${isSpeaking ? "idiom-audio-btn-speaking" : ""}`}
                  onClick={handlePlayPronunciation}
                  aria-label={ACTION_LABELS.playPronunciation[lang]}
                  title={ACTION_LABELS.playPronunciation[lang]}
                >
                  <Volume2 size={16} strokeWidth={2.25} aria-hidden="true" />
                </button>
              </div>
              <div className="idiom-chars flex justify-center gap-2">
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
              <div className="idiom-copy-stack">
                <span className="idiom-audio-label">{isCopied ? ACTION_LABELS.copied[lang] : ACTION_LABELS.copy[lang]}</span>
                <button
                  className={`idiom-audio-btn ${isCopied ? "idiom-audio-btn-speaking" : ""}`}
                  onClick={handleCopyIdiom}
                  aria-label={ACTION_LABELS.copyIdiom[lang]}
                  title={ACTION_LABELS.copyIdiom[lang]}
                >
                  <Copy size={16} strokeWidth={2.25} aria-hidden="true" />
                </button>
                <span className="idiom-audio-label">{bookmarked ? ACTION_LABELS.saved[lang] : ACTION_LABELS.save[lang]}</span>
                <button
                  className={`idiom-audio-btn ${bookmarked ? "idiom-audio-btn-speaking" : ""}`}
                  onClick={() => toggleBookmark(idiom.word)}
                  aria-label={ACTION_LABELS.saveIdiom[lang]}
                  title={ACTION_LABELS.saveIdiom[lang]}
                  aria-pressed={bookmarked}
                >
                  <Bookmark size={16} strokeWidth={2.25} fill={bookmarked ? "currentColor" : "none"} aria-hidden="true" />
                </button>
              </div>
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

          <div className="mt-4 flex justify-start">
            <LanguageToggle lang={lang} onChange={setLang} />
          </div>
        </div>
      </div>

      <Drawer
        open={panel === "calendar"}
        title={NAV_LABELS.browse[lang]}
        lang={lang}
        onClose={() => setPanel("none")}
      >
        <CalendarPanel
          lang={lang}
          selectedDate={view.kind === "date" ? view.date : new Date()}
          onSelect={(date) => {
            setView({ kind: "date", date });
            setPanel("none");
          }}
        />
      </Drawer>

      <Drawer
        open={panel === "bookmarks"}
        title={NAV_LABELS.bookmarks[lang]}
        lang={lang}
        onClose={() => setPanel("none")}
      >
        <BookmarksPanel
          lang={lang}
          bookmarks={bookmarks}
          onSelect={(selected) => {
            setView({ kind: "idiom", idiom: selected, source: "bookmark" });
            setPanel("none");
          }}
          onRemove={removeBookmark}
        />
      </Drawer>

      <div className="flex-grow flex-shrink-0 pb-8">
        <p className="text-xs" style={{ color: "var(--color-dim)" }}>Created with ♡ by jntm7</p>
      </div>
    </main>
  );
}

export default App;
