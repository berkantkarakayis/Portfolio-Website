"use client";

import React, { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { MatrixRain } from "./MatrixRain";
import { api } from "./api";
import { sfx } from "./sound";

const CHAR_MS = 24;
const LINE_PAUSE_MS = 220;
const POWER_MS = 420;
const GLITCH_MS = 520;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Power-on → digital rain + typed boot log with live numbers → glitch → hand
 * over to the dashboard. Fully opaque throughout so the page never flashes.
 */
export const BootSequence = ({ label, onDone }) => {
  const [lines, setLines] = useState([]);
  const [phase, setPhase] = useState("power"); // power | log | glitch
  const [reduced, setReduced] = useState(false);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const noMotion = prefersReducedMotion();
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only media query, read once
    setReduced(noMotion);
    sfx.powerOn();
    const statsPromise = api.stats("30d").catch(() => null);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, noMotion ? 0 : ms));

    const type = async (text) => {
      if (cancelled) return;
      if (noMotion) {
        setLines((prev) => [...prev, text]);
        return;
      }
      setLines((prev) => [...prev, ""]);
      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return;
        setLines((prev) => [...prev.slice(0, -1), text.slice(0, i)]);
        if (i % 2 === 0) sfx.tick();
        await sleep(CHAR_MS);
      }
      await sleep(LINE_PAUSE_MS);
    };

    (async () => {
      await sleep(POWER_MS);
      if (cancelled) return;
      setPhase("log");
      await type(`> auth ok — welcome, ${label ?? "operator"}`);
      await type("> connecting storage… ok");
      const stats = await statsPromise;
      if (cancelled) return;
      await type(`> loading sessions… ${stats?.kpi?.sessions ?? 0} in the last 30 days`);
      await type(`> resolving geo… ${stats?.countries?.filter((c) => c.k !== "??").length ?? 0} countries · ${stats?.liveNow ?? 0} live now`);
      await type("> rendering dashboard");
      if (cancelled) return;
      sfx.chime();
      setPhase("glitch");
      await sleep(GLITCH_MS);
      if (!cancelled) doneRef.current?.();
    })();

    return () => {
      cancelled = true;
    };
  }, [label]);

  return (
    <>
    {!reduced && <span className="hm-poweron-line fixed z-[401]" aria-hidden="true" />}
    <m.div
      key="hm-boot"
      className="hm-root fixed inset-0 z-[400] overflow-hidden bg-[#020a04] text-[#7dff7d]"
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(50% 0 50% 0)" }}
      animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : POWER_MS / 1000, ease: [0.2, 0.9, 0.2, 1] }}
    >
      {!reduced && <MatrixRain running={phase !== "glitch"} />}
      {/* scrim keeps the log readable over the rain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(2,10,4,0.92),rgba(2,10,4,0.55)_60%,rgba(2,10,4,0.25))]" />
      <div
        className={`relative z-10 mx-auto max-w-2xl px-6 pt-[16vh] font-mono text-sm sm:text-base ${
          phase === "glitch" ? "hm-glitch-strong" : ""
        }`}
        aria-live="polite"
      >
        {lines.map((line, i) => (
          <p key={i} className="min-h-[1.7em] whitespace-pre-wrap break-words">
            {line}
            {i === lines.length - 1 && phase === "log" && <span className="hm-cursor" aria-hidden="true" />}
          </p>
        ))}
      </div>
    </m.div>
    </>
  );
};
