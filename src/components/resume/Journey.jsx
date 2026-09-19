"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { m } from "framer-motion";
import { LuBriefcase, LuChevronLeft, LuChevronRight, LuGraduationCap, LuRocket } from "react-icons/lu";
import { useContent } from "@/i18n/content";
import { Reveal } from "@/components/ui/Reveal";

const KIND = {
  work: { icon: LuBriefcase, tone: "text-primary", ring: "border-primary bg-primary" },
  education: { icon: LuGraduationCap, tone: "text-[#a78bfa]", ring: "border-[#a78bfa] bg-[#a78bfa]" },
  ship: { icon: LuRocket, tone: "text-[#f5b942]", ring: "border-[#f5b942] bg-[#f5b942]" },
};

/**
 * Horizontal, scroll-snapping timeline of milestones. The rail runs through
 * the dots; the card nearest the centre is highlighted. Arrow buttons and
 * keyboard arrows move one card at a time.
 */
export const Journey = () => {
  const t = useTranslations("resume.journey");
  const format = useFormatter();
  const { milestones } = useContent();
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  // Year-only dates ("2025") sort after dated entries of the same year.
  const sortKey = (d) => (String(d).length === 4 ? `${d}-13` : String(d));
  const items = [...milestones].sort((a, b) => sortKey(a.date).localeCompare(sortKey(b.date)));

  const label = (date) => {
    const [y, mth] = String(date).split("-").map(Number);
    if (!mth) return String(y);
    return format.dateTime(new Date(Date.UTC(y, mth - 1, 1)), { month: "short", year: "numeric" });
  };

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = [...track.querySelectorAll("[data-card]")];
    const centre = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
    setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    // Measure after layout, not synchronously inside the effect.
    let raf = requestAnimationFrame(() => {
      raf = 0;
      measure();
    });
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  const scrollTo = (index) => {
    const track = trackRef.current;
    const card = track?.querySelectorAll("[data-card]")[Math.max(0, Math.min(items.length - 1, index))];
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollTo(active - 1);
    }
  };

  return (
    <Reveal className="container mb-16" y={16}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-cs text-xs font-bold tracking-[0.2em] text-primary">{t("title")}</p>
          <p className="mt-1 text-sm text-text">{t("sub")}</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(KIND).map(([kind, k]) => (
            <span key={kind} className="hidden items-center gap-1.5 text-[11px] text-[color:var(--muted-color)] sm:inline-flex">
              <span className={`h-2 w-2 rounded-full ${k.ring}`} /> {t(`kinds.${kind}`)}
            </span>
          ))}
          <button type="button" onClick={() => scrollTo(active - 1)} disabled={edges.start} aria-label={t("prev")} data-track="journey-nav" data-track-value="prev" className="ml-2 grid h-9 w-9 place-items-center rounded-full border border-[color:var(--glass-border)] text-title transition-colors hover:border-primary hover:text-primary disabled:opacity-30">
            <LuChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollTo(active + 1)} disabled={edges.end} aria-label={t("next")} data-track="journey-nav" data-track-value="next" className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--glass-border)] text-title transition-colors hover:border-primary hover:text-primary disabled:opacity-30">
            <LuChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* rail */}
        <span className="pointer-events-none absolute left-0 right-0 top-[3.25rem] h-px bg-[color:var(--glass-border)]" aria-hidden="true" />
        <span className="pointer-events-none absolute right-0 top-[3.25rem] h-px w-24 bg-gradient-to-r from-transparent to-primary/60" aria-hidden="true" />
        <ol
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onKey}
          aria-label={t("title")}
          className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:px-[calc(50%-8.5rem)] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((ms, i) => {
            const k = KIND[ms.kind] ?? KIND.ship;
            const Icon = k.icon;
            const isActive = i === active;
            return (
              <li key={ms.id} data-card className="w-[17rem] flex-none snap-center">
                <button
                  type="button"
                  onClick={() => scrollTo(i)}
                  className="group block w-full text-left"
                  aria-current={isActive ? "step" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-cs font-mono text-xs font-bold tabular-nums ${isActive ? "text-primary" : "text-[color:var(--muted-color)]"}`}>{label(ms.date)}</span>
                    <span className={`text-cs rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] ${isActive ? "border-primary/50 text-primary" : "border-[color:var(--glass-border)] text-[color:var(--muted-color)]"}`}>{t(`kinds.${ms.kind}`)}</span>
                  </div>
                  <div className="relative mt-3 flex h-5 items-center">
                    <m.span
                      className={`relative z-10 block h-3.5 w-3.5 rounded-full border-2 ${k.ring} ${isActive ? "shadow-[0_0_0_6px_var(--primary-soft)]" : "opacity-70"}`}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </div>
                  <m.div
                    animate={{ y: isActive ? 0 : 6, opacity: isActive ? 1 : 0.72 }}
                    transition={{ duration: 0.3 }}
                    className={`glass mt-3 rounded-[18px] p-4 transition-colors ${isActive ? "!border-primary/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`grid h-9 w-9 flex-none place-items-center rounded-xl border border-[color:var(--glass-border)] bg-black/10 text-lg ${k.tone}`}>
                        <Icon aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold leading-snug text-title">{ms.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-text">{ms.detail}</p>
                      </div>
                    </div>
                  </m.div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </Reveal>
  );
};
