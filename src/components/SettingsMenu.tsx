import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { SETTINGS_LABELS, type Lang } from "../lib/i18n";
import type { Theme } from "../hooks/useTheme";

interface SettingsMenuProps {
  lang: Lang;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const THEME_OPTIONS: Theme[] = ["light", "dark", "system"];

export default function SettingsMenu({
  lang,
  theme,
  onThemeChange,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="settings-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={SETTINGS_LABELS.settings[lang]}
        title={SETTINGS_LABELS.settings[lang]}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Settings size={18} strokeWidth={2.25} aria-hidden="true" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="settings-menu"
          role="dialog"
          aria-label={SETTINGS_LABELS.settings[lang]}
        >
          <div>
            <p className="settings-section-title">{SETTINGS_LABELS.theme[lang]}</p>
            <div className="settings-seg">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t}
                  className={`settings-seg-btn ${theme === t ? "settings-seg-active" : ""}`}
                  onClick={() => onThemeChange(t)}
                >
                  {SETTINGS_LABELS[t][lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
