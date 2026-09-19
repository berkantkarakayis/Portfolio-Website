"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";

const REFRESH_MS = 60_000;

const flag = (code) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));

/**
 * Public, anonymous "live on this site" strip fed by the first-party
 * analytics. Renders nothing until real numbers arrive, and stays silent
 * when the endpoint is unavailable.
 */
export const LiveStats = ({ className = "" }) => {
  const t = useTranslations("live");
  const ref = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let timer = 0;
    let started = false;

    const load = async () => {
      try {
        const res = await fetch("/api/stats/public", { signal: controller.signal, headers: { accept: "application/json" } });
        if (!res.ok) return;
        const json = await res.json();
        if (json.ok) setData(json);
      } catch {
        /* offline or aborted */
      }
    };

    const start = () => {
      if (started) return;
      started = true;
      load();
      timer = setInterval(() => document.visibilityState === "visible" && load(), REFRESH_MS);
    };

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && start(), { rootMargin: "200px" });
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      controller.abort();
      clearInterval(timer);
    };
  }, []);

  const show = data && (data.sessions > 0 || data.liveNow > 0);

  return (
    <div ref={ref} className={className}>
      <AnimatePresence>
        {show && (
          <m.div
            key="live"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="glass flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full px-5 py-3 text-xs font-semibold text-title sm:text-sm"
            role="status"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              {t("now", { count: Math.max(1, data.liveNow) })}
            </span>
            <span className="hidden h-4 w-px bg-[color:var(--glass-border)] sm:block" aria-hidden="true" />
            <span className="text-text">{t("month", { visitors: data.visitors, countries: data.countries })}</span>
            {data.topCountries.length > 0 && (
              <span className="text-base leading-none" aria-label={t("top")} title={t("top")}>
                {data.topCountries.map((c) => (
                  <span key={c} className="mr-1">{flag(c)}</span>
                ))}
              </span>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
