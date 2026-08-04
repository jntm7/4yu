import { LANG_LABELS, SETTINGS_LABELS, type Lang } from "../lib/i18n";

interface LanguageToggleProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export default function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="seg-control" role="group" aria-label={SETTINGS_LABELS.language[lang]}>
      {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
        <button
          key={l}
          className={`seg-btn ${lang === l ? "seg-active" : ""}`}
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
