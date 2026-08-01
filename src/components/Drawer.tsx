import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { SETTINGS_LABELS, type Lang } from "../lib/i18n";

interface DrawerProps {
  open: boolean;
  title: string;
  lang: Lang;
  onClose: () => void;
  children: ReactNode;
}

export default function Drawer({ open, title, lang, onClose, children }: DrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    prevFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevFocusRef.current?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`drawer-backdrop ${open ? "drawer-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`drawer ${open ? "drawer-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="drawer-header">
          <h2 className="drawer-title">{title}</h2>
          <button
            ref={closeRef}
            className="drawer-close"
            onClick={onClose}
            aria-label={SETTINGS_LABELS.close[lang]}
            title={SETTINGS_LABELS.close[lang]}
          >
            <X size={16} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </>
  );
}
