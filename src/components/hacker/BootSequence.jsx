"use client";

import React, { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { MatrixRain } from "./MatrixRain";
import { api } from "./api";

const CHAR_MS = 22;
const LINE_PAUSE_MS = 180;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** CRT power-on, digital rain and a typed boot log with real numbers. */
export const BootSequence = ({ label, onDone }) => {
  const [lines, setLines] = useState([]);
  const [rainDone, setRainDone] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const reduced = useRef(false);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    setShowRain(!reduced.current);
    let cancelled = false;
    const statsPromise = api.stats("30d").catch(() => null);

    const sleep = (ms) => new Promise((r) => setTimeout(r, reduced.current ? 0 : ms));

    const type = async (text) => {
      if (cancelled) return;
      if (reduced.current) {
        setLines((prev) => [...prev, text]);
        return;
      }
      setLines((prev) => [...prev, ""]);
      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return;
        const partial = text.slice(0, i);
        setLines((prev) => [...prev.slice(0, -1), partial]);
        await sleep(CHAR_MS);
      }
      await sleep(LINE_PAUSE_MS);
    };

    setLines([]);
    (async () => {
      await sleep(350);
      await type(`> auth ok — welcome, ${label ?? "operator"}`);
      await type("> connecting storage… ok");
      const stats = await statsPromise;
      if (cancelled) return;
      await type(`> loading sessions… ${stats?.kpi?.sessions ?? 0} (30d)`);
      await type(`> resolving geo… ${stats?.countries?.length ?? 0} countries, ${stats?.liveNow ?? 0} live`);
      await type("> rendering dashboard");
      await sleep(320);
      if (!cancelled) doneRef.current?.();
    })();

    return () => {
      cancelled = true;
    };
  }, [label]);

  return (
    <m.div
      key="hm-boot"
      className="hm-root hm-flicker fixed inset-0 z-[400] bg-[#020a04] text-[#7dff7d]"
      initial={{ clipPath: "inset(50% 0 50% 0)", opacity: 1 }}
      animate={{ clipPath: "inset(0 0 0 0)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {showRain && !rainDone && <MatrixRain onDone={() => setRainDone(true)} />}
      <div className="relative z-[402] mx-auto max-w-2xl px-6 pt-[18vh] font-mono text-sm sm:text-base">
        {lines.map((line, i) => (
          <p key={i} className="min-h-[1.6em] whitespace-pre-wrap">
            {line}
            {i === lines.length - 1 && <span className="hm-cursor" aria-hidden="true" />}
          </p>
        ))}
      </div>
    </m.div>
  );
};
