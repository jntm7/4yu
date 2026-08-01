import { X } from "lucide-react";
import type { Idiom } from "../lib/daily";
import { ACTION_LABELS, PANEL_LABELS, type Lang } from "../lib/i18n";

interface BookmarksPanelProps {
  lang: Lang;
  bookmarks: Idiom[];
  onSelect: (idiom: Idiom) => void;
  onRemove: (word: string) => void;
}

export default function BookmarksPanel({ lang, bookmarks, onSelect, onRemove }: BookmarksPanelProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="panel-list">
        <p className="panel-empty">{PANEL_LABELS.bookmarksEmpty[lang]}</p>
      </div>
    );
  }

  return (
    <div className="panel-list">
      {bookmarks.map((idiom) => {
        const word = lang === "zh-Hant" ? idiom.wordTraditional : idiom.word;
        return (
          <div key={idiom.word} className="panel-row panel-row-static">
            <button className="panel-row-main" onClick={() => onSelect(idiom)}>
              <span className="panel-row-idiom">
                <span className="panel-row-word">{word}</span>
                <span className="panel-row-pinyin">{idiom.pinyin}</span>
              </span>
            </button>
            <button
              className="panel-row-remove"
              onClick={() => onRemove(idiom.word)}
              aria-label={ACTION_LABELS.removeBookmark[lang]}
              title={ACTION_LABELS.removeBookmark[lang]}
            >
              <X size={14} strokeWidth={2.25} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
