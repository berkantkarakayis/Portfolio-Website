"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";
import { LuCommand, LuX } from "react-icons/lu";
import { PALETTE_OPEN_EVENT } from "./events";
import { useShortcutLabel } from "./useShortcutLabel";

const SEEN_KEY = "palette_hint_seen";
const SHOW_AFTER_MS = 7000;
const HIDE_AFTER_MS = 9000;

/**
 * One-time nudge so visitors learn the palette exists: appears a few seconds
 * after load, disappears on its own, never returns once seen or once the
 * palette has been opened.
 */
export const PaletteHint = () => {
  const t = useTranslations("palette");
  const shortcut = useShortcutLabel();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1" || Boolean(localStorage.getItem("palette_recent"));
    } catch {
      seen = false;
    }
    if (seen) return undefined;
    const markSeen = () => {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable */
      }
    };
    const show = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    const hide = setTimeout(() => {
      setVisible(false);
      markSeen();
    }, SHOW_AFTER_MS + HIDE_AFTER_MS);
    const onOpen = () => {
      setVisible(false);
      markSeen();
    };
    window.addEventListener(PALETTE_OPEN_EVENT, onOpen);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      window.removeEventListener(PALETTE_OPEN_EVENT, onOpen);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="palette-hint"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
          className="palette-surface fixed bottom-6 left-5 z-[100] flex items-center gap-3 rounded-full py-2 pl-2 pr-3 text-xs font-semibold text-title shadow-card sm:bottom-8 sm:left-8"
          role="status"
        >
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(PALETTE_OPEN_EVENT))}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-white transition-transform hover:scale-105"
            data-track="palette-open"
            data-track-value="hint"
          >
            <LuCommand aria-hidden="true" />
            <kbd className="font-mono text-[11px]">{shortcut}</kbd>
          </button>
          <span className="hidden sm:inline">{t("nudge")}</span>
          <span className="sm:hidden">{t("nudgeShort")}</span>
          <button type="button" onClick={dismiss} aria-label={t("dismiss")} className="grid h-6 w-6 place-items-center rounded-full text-[color:var(--muted-color)] hover:text-primary">
            <LuX aria-hidden="true" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
};
