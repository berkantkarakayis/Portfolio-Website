"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";
import { LuArrowRight, LuCornerDownLeft, LuSearch } from "react-icons/lu";
import { useContent } from "@/i18n/content";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, routing } from "@/i18n/routing";
import { scrollToSection } from "@/hooks/useActiveSection";
import { emitTrack } from "@/lib/analytics/emit";
import { buildCommands, pushRecent, readRecent, score } from "./commands";

export const PALETTE_OPEN_EVENT = "palette:open";
export const THEME_TOGGLE_EVENT = "theme:toggle";
const GROUP_ORDER = ["recent", "navigate", "actions", "skills", "socials"];
const MAX_SKILLS_WHEN_EMPTY = 0;

const isTyping = (el) => el instanceof Element && el.closest("input, textarea, select, [contenteditable]");

/**
 * ⌘K / Ctrl+K command palette: navigation, actions, skills search, socials.
 * Opens from the keyboard, the header button (via a window event) or the
 * Hacker Mode command bar. Fully keyboard driven.
 */
export const CommandPalette = () => {
  const t = useTranslations("palette");
  const tNav = useTranslations("nav");
  const tc = useTranslations("common");
  const content = useContent();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [recent, setRecent] = useState([]);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
    setMounted(true);
  }, []);

  const otherLocale = useMemo(() => {
    const code = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
    return { code, name: localeNames[code] };
  }, [locale]);

  const commands = useMemo(() => buildCommands({ t, tNav, content, otherLocale }), [t, tNav, content, otherLocale]);

  const ctx = useMemo(
    () => ({
      scrollTo: (id) => scrollToSection(id),
      download: () => {
        const a = document.createElement("a");
        a.href = content.site.resume;
        a.download = tc("cvFilename");
        a.click();
      },
      mailto: () => {
        window.location.href = `mailto:${content.site.email}`;
      },
      copyEmail: async () => {
        try {
          await navigator.clipboard.writeText(content.site.email);
          setToast(t("copied"));
        } catch {
          window.location.href = `mailto:${content.site.email}`;
        }
      },
      toggleTheme: () => window.dispatchEvent(new Event(THEME_TOGGLE_EVENT)),
      switchLocale: (code) => router.replace(`${pathname}${window.location.hash}`, { locale: code, scroll: false }),
      open: (url) => window.open(url, "_blank", "noopener,noreferrer"),
    }),
    [content, tc, t, router, pathname],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const openPalette = useCallback(() => {
    setRecent(readRecent());
    setOpen(true);
    setIndex(0);
  }, []);

  // Global shortcuts + header/other triggers.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openPalette();
      } else if (e.key === "/" && !open && !isTyping(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openPalette();
      }
    };
    const onOpen = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_OPEN_EVENT, onOpen);
    };
  }, [open, close, openPalette]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add("no-scroll");
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  // Filter + group.
  const results = useMemo(() => {
    const q = query.trim();
    let list;
    if (!q) {
      const recents = recent.map((id) => commands.find((c) => c.id === id)).filter(Boolean).map((c) => ({ ...c, group: "recent" }));
      list = [...recents, ...commands.filter((c) => c.group !== "skills" || MAX_SKILLS_WHEN_EMPTY)];
    } else {
      list = commands
        .map((c) => ({ ...c, s: Math.max(score(q, c.label), score(q, c.keywords ?? ""), c.hint ? score(q, c.hint) - 5 : -1) }))
        .filter((c) => c.s >= 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 24);
    }
    const groups = new Map();
    for (const c of list) {
      if (!groups.has(c.group)) groups.set(c.group, []);
      groups.get(c.group).push(c);
    }
    const ordered = GROUP_ORDER.filter((g) => groups.has(g)).map((g) => ({ group: g, items: groups.get(g) }));
    const flat = ordered.flatMap((g) => g.items);
    return { ordered, flat };
  }, [query, recent, commands]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${index}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const run = (command) => {
    pushRecent(command.id);
    emitTrack("palette", { id: command.id });
    close();
    // Let the dialog unmount before scrolling so `no-scroll` is gone.
    requestAnimationFrame(() => command.run(ctx));
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(results.flat.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results.flat[index];
      if (cmd) run(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <m.div
            key="palette"
            className="fixed inset-0 z-[300] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label={t("title")}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.3, 0, 0.3, 1] }}
              className="palette-surface w-full max-w-xl overflow-hidden rounded-[22px] shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-[color:var(--glass-border)] px-4 py-3">
                <LuSearch className="text-lg text-primary" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  onKeyDown={onInputKey}
                  placeholder={t("placeholder")}
                  aria-label={t("placeholder")}
                  aria-activedescendant={results.flat[index] ? `palette-item-${index}` : undefined}
                  aria-controls="palette-list"
                  role="combobox"
                  aria-expanded="true"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent text-base text-title outline-none placeholder:text-[color:var(--muted-color)]"
                />
                <kbd className="text-cs hidden rounded-md border border-[color:var(--glass-border)] px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--muted-color)] sm:block">esc</kbd>
              </div>

              <div ref={listRef} id="palette-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
                {results.flat.length === 0 && (
                  <p className="px-3 py-8 text-center text-sm text-[color:var(--muted-color)]">{t("empty", { query })}</p>
                )}
                {results.ordered.map(({ group, items }) => (
                  <div key={group} className="mb-1">
                    <p className="text-cs px-3 pb-1 pt-2 text-[10px] font-bold tracking-[0.18em] text-primary">{t(`groups.${group}`)}</p>
                    {items.map((cmd) => {
                      const i = results.flat.indexOf(cmd);
                      const active = i === index;
                      return (
                        <button
                          key={`${group}-${cmd.id}`}
                          id={`palette-item-${i}`}
                          type="button"
                          role="option"
                          aria-selected={active}
                          data-index={i}
                          onMouseEnter={() => setIndex(i)}
                          onClick={() => run(cmd)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            active ? "bg-[color:var(--primary-soft)] text-title" : "text-text hover:bg-white/5"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate font-semibold">{cmd.label}</span>
                            {cmd.hint && <span className="truncate text-xs text-[color:var(--muted-color)]">· {cmd.hint}</span>}
                          </span>
                          {active ? <LuCornerDownLeft className="shrink-0 text-primary" aria-hidden="true" /> : <LuArrowRight className="shrink-0 opacity-0" aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="text-cs flex items-center justify-between gap-3 border-t border-[color:var(--glass-border)] px-4 py-2 text-[10px] font-bold tracking-[0.12em] text-[color:var(--muted-color)]">
                <span>{t("hint")}</span>
                <span>{results.flat.length} {t("results")}</span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <m.div
            key="toast"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="palette-surface fixed bottom-24 left-1/2 z-[310] -translate-x-1/2 rounded-full px-4 py-2 text-sm font-semibold text-title"
          >
            {toast}
          </m.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};
