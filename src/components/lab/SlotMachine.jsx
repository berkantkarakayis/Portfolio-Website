"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LuCheck, LuPlay, LuRotateCcw, LuShieldCheck, LuX } from "react-icons/lu";
import { createLoop } from "@/lib/engine/loop";
import { fitCanvas } from "@/lib/engine/canvas";
import { REELS, SYMBOLS, createMachine, evaluate } from "@/lib/lab/slot/machine";
import {
  createCommitment,
  hmacSha256,
  outcomeFromDigest,
  randomHex,
  seedMessage,
  verifySpin,
} from "@/lib/lab/slot/fair";
import { emitTrack } from "@/lib/analytics/emit";

const START_CREDITS = 1000;
const BET = 10;

const Mono = ({ children, className = "" }) => (
  <code className={`block truncate rounded-md bg-black/20 px-2 py-1 font-mono text-[11px] text-title ${className}`} title={typeof children === "string" ? children : undefined}>
    {children}
  </code>
);

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-cs mb-1 text-[10px] font-bold tracking-[0.15em] text-[color:var(--muted-color)]">{label}</p>
    {children}
  </div>
);

export const SlotMachine = () => {
  const t = useTranslations("lab.slot");
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const machineRef = useRef(null);
  const finishRef = useRef(null);
  const pendingRef = useRef(null);

  const [credits, setCredits] = useState(START_CREDITS);
  const [lastWin, setLastWin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [clientSeed, setClientSeed] = useState(() => randomHex(8));
  const [nonce, setNonce] = useState(0);
  const [round, setRound] = useState(null);
  const [lastSpin, setLastSpin] = useState(null);
  const [verification, setVerification] = useState(null);
  const [stats, setStats] = useState({ fps: 0, frameMs: 0 });

  useEffect(() => {
    let cancelled = false;
    createCommitment().then((r) => !cancelled && setRound(r));
    return () => {
      cancelled = true;
    };
  }, []);

  // Engine lifecycle: sized to its container, running only while on screen.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    let ctx;
    let size = { w: 1, h: 1 };
    const machine = createMachine({
      onStop: () => {
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending) finishRef.current?.(pending);
      },
    });
    machineRef.current = machine;

    const loop = createLoop({
      update: (dt) => machine.update(dt),
      render: () => ctx && machine.render(ctx, size.w, size.h),
    });

    const resize = () => {
      const w = Math.max(240, wrap.clientWidth);
      const h = Math.round(w * 0.52);
      size = { w, h };
      ctx = fitCanvas(canvas, w, h);
      machine.render(ctx, w, h);
    };
    resize();

    let inView = false;
    const sync = () => {
      if (inView && document.visibilityState === "visible") loop.start();
      else loop.stop();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(wrap);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);
    document.addEventListener("visibilitychange", sync);
    const statsTimer = setInterval(() => setStats(loop.stats()), 500);

    return () => {
      loop.stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      clearInterval(statsTimer);
    };
  }, []);

  // Kept in a ref so the engine's onStop callback never sees a stale closure.
  useEffect(() => {
    finishRef.current = (spin) => {
      const { win, kind } = evaluate(spin.symbols, BET);
      if (win) machineRef.current?.celebrate(kind);
      setCredits((c) => c + win);
      setLastWin(win);
      setLastSpin(spin);
      setSpinning(false);
      createCommitment().then(setRound);
      emitTrack("lab-spin", { win });
    };
  }, []);

  const spin = useCallback(async () => {
    if (spinning || !round || credits < BET) return;
    setSpinning(true);
    setVerification(null);
    setLastWin(0);
    setCredits((c) => c - BET);
    const nextNonce = nonce + 1;
    setNonce(nextNonce);
    const digest = await hmacSha256(round.serverSeed, seedMessage(clientSeed, nextNonce));
    const outcome = outcomeFromDigest(digest, REELS, SYMBOLS.length);
    pendingRef.current = {
      ...round,
      clientSeed,
      nonce: nextNonce,
      digest,
      outcome,
      symbols: outcome.map((o) => o.symbol),
    };
    machineRef.current?.spin(pendingRef.current.symbols);
  }, [spinning, round, credits, nonce, clientSeed]);

  const verify = async () => {
    if (!lastSpin) return;
    const result = await verifySpin({ ...lastSpin, reels: REELS, symbolCount: SYMBOLS.length });
    setVerification(result);
    emitTrack("lab-verify", { ok: result.digestOk && result.commitmentOk });
  };

  const reset = () => {
    setCredits(START_CREDITS);
    setLastWin(0);
  };

  const broke = credits < BET;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-title sm:text-2xl">{t("title")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text">{t("desc")}</p>
        </div>
        <span className="chip shrink-0 tabular-nums" title={`${stats.frameMs} ms/frame`}>
          {stats.fps} {t("fps")}
        </span>
      </div>

      <div ref={wrapRef} className="relative w-full overflow-hidden rounded-[18px]">
        <canvas ref={canvasRef} className="block w-full" aria-label={t("canvasLabel")} role="img" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 flex-wrap gap-2">
          <span className="chip tabular-nums">{t("credits")} · {credits}</span>
          <span className="chip tabular-nums">{t("bet")} · {BET}</span>
          <span className={`chip tabular-nums ${lastWin ? "!border-primary !bg-[color:var(--primary-soft)]" : ""}`}>
            {t("lastWin")} · {lastWin}
          </span>
        </div>
        {broke ? (
          <button type="button" onClick={reset} data-track="lab-slot-reset" className="btn text-cs inline-flex items-center gap-2">
            <LuRotateCcw aria-hidden="true" /> {t("reset")}
          </button>
        ) : (
          <button
            type="button"
            onClick={spin}
            disabled={spinning || !round}
            data-track="lab-slot-spin"
            className="btn btn--primary text-cs inline-flex min-w-[150px] items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LuPlay aria-hidden="true" /> {spinning ? t("spinning") : t("spin")}
          </button>
        )}
      </div>

      {/* Provably fair panel */}
      <div className="glass rounded-[18px] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <LuShieldCheck className="text-primary" aria-hidden="true" />
          <h4 className="text-sm font-bold text-title">{t("fairTitle")}</h4>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("commitment")}>
            <Mono>{round?.commitment ?? "…"}</Mono>
          </Field>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Field label={t("clientSeed")}>
              <input
                value={clientSeed}
                disabled={spinning}
                onChange={(e) => setClientSeed(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32) || "0")}
                aria-label={t("clientSeed")}
                className="w-full rounded-md border border-[color:var(--glass-border)] bg-black/20 px-2 py-1 font-mono text-[11px] text-title outline-none focus:border-primary"
              />
            </Field>
            <Field label={t("nonce")}>
              <Mono>{String(nonce)}</Mono>
            </Field>
          </div>
        </div>

        {lastSpin && (
          <div className="mt-4 grid gap-3 border-t border-[color:var(--glass-border)] pt-4 sm:grid-cols-2">
            <Field label={t("serverSeed")}>
              <Mono>{lastSpin.serverSeed}</Mono>
            </Field>
            <Field label={t("resultHash")}>
              <Mono>{lastSpin.digest}</Mono>
            </Field>
            <div className="sm:col-span-2">
              <p className="text-cs mb-1 text-[10px] font-bold tracking-[0.15em] text-[color:var(--muted-color)]">{t("mapping")}</p>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                {lastSpin.outcome.map((o, i) => (
                  <span key={i} className="chip !font-mono">
                    {o.slice} → {o.value} mod {SYMBOLS.length} = {o.symbol} → <b style={{ color: SYMBOLS[o.symbol].color }}>{SYMBOLS[o.symbol].glyph}</b>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button type="button" onClick={verify} disabled={spinning} data-track="lab-slot-verify" className="btn text-cs inline-flex items-center gap-2 !h-11 !px-6">
                <LuShieldCheck aria-hidden="true" /> {t("verify")}
              </button>
              {verification && (
                <span className={`inline-flex items-center gap-2 text-sm font-semibold ${verification.digestOk && verification.commitmentOk ? "text-primary" : "text-red-400"}`} role="status">
                  {verification.digestOk && verification.commitmentOk ? <LuCheck aria-hidden="true" /> : <LuX aria-hidden="true" />}
                  {verification.digestOk && verification.commitmentOk ? t("verified") : t("mismatch")}
                </span>
              )}
            </div>
          </div>
        )}

        <ol className="mt-4 space-y-1 border-t border-[color:var(--glass-border)] pt-3 text-xs text-text">
          <li>1. {t("how1")}</li>
          <li>2. {t("how2")}</li>
          <li>3. {t("how3")}</li>
        </ol>
      </div>
    </div>
  );
};
