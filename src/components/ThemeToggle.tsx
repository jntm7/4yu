import { SETTINGS_LABELS, type Lang } from "../lib/i18n";
import type { Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  lang: Lang;
  theme: Theme;
  onChange: (theme: Theme) => void;
}

const THEME_OPTIONS: Theme[] = ["light", "dark", "system"];

export default function ThemeToggle({ lang, theme, onChange }: ThemeToggleProps) {
  return (
    <div className="seg-control" role="group" aria-label={SETTINGS_LABELS.theme[lang]}>
      {THEME_OPTIONS.map((t) => (
        <button
          key={t}
          className={`seg-btn ${theme === t ? "seg-active" : ""}`}
          onClick={() => onChange(t)}
          aria-pressed={theme === t}
        >
          {SETTINGS_LABELS[t][lang]}
        </button>
      ))}
    </div>
  );
}
