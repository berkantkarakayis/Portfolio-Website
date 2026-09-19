"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";
import { LuPlugZap, LuUnplug, LuRefreshCw } from "react-icons/lu";
import { TEAMS, createSimulator } from "@/lib/lab/match/simulator";
import { createConnection } from "@/lib/lab/match/connection";
import { emitTrack } from "@/lib/analytics/emit";

const FEED_LIMIT = 9;
const ICONS = {
  kickoff: "▶",
  goal: "⚽",
  shot: "🎯",
  corner: "◢",
  foul: "✕",
  yellow: "🟨",
  var: "📺",
  sub: "🔁",
  halftime: "⏸",
  fulltime: "⏹",
  possession: "·",
};

const STATUS_STYLE = {
  connected: "border-primary/50 bg-[color:var(--primary-soft)] text-primary",
  reconnecting: "border-amber-400/50 bg-amber-400/10 text-amber-300",
  disconnected: "border-red-400/50 bg-red-400/10 text-red-300",
};

const Pitch = ({ ball, connected }) => (
  <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[14px] border border-[color:var(--glass-border)] bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.28),rgba(20,83,45,0.35))]">
    <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <g fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5">
        <rect x="2" y="2" width="96" height="56" rx="1" />
        <line x1="50" y1="2" x2="50" y2="58" />
        <circle cx="50" cy="30" r="8" />
        <rect x="2" y="16" width="14" height="28" />
        <rect x="84" y="16" width="14" height="28" />
        <rect x="2" y="24" width="5" height="12" />
        <rect x="93" y="24" width="5" height="12" />
      </g>
    </svg>
    <m.span
      className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.15)] ${connected ? "bg-white" : "bg-white/40"}`}
      animate={{ left: `${ball.x}%`, top: `${ball.y}%` }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      aria-hidden="true"
    />
    {!connected && (
      <div className="absolute inset-0 grid place-items-center bg-black/35 backdrop-blur-[1px]">
        <span className="text-cs rounded-full border border-red-400/50 bg-black/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-red-300">
          offline
        </span>
      </div>
    )}
  </div>
);

const Diagram = ({ status, replaying }) => {
  const live = status === "connected";
  const linkClass = live ? "stroke-primary" : status === "reconnecting" ? "stroke-amber-400" : "stroke-red-400";
  return (
    <svg viewBox="0 0 320 70" className="w-full" role="img" aria-label="Client, gateway, pub/sub and game servers">
      <defs>
        <marker id="lab-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      {[
        ["Client", 8, 22],
        ["Gateway", 92, 22],
        ["Pub/Sub", 176, 22],
        ["Server A", 260, 4],
        ["Server B", 260, 40],
      ].map(([label, x, y]) => (
        <g key={label}>
          <rect x={x} y={y} width="52" height="26" rx="7" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" />
          <text x={x + 26} y={y + 17} textAnchor="middle" fontSize="9" fill="currentColor" fontWeight="700">{label}</text>
        </g>
      ))}
      <g fill="none" strokeWidth="1.5" className="text-primary">
        <line x1="60" y1="35" x2="90" y2="35" className={linkClass} strokeDasharray={live ? "4 3" : "2 4"} markerEnd="url(#lab-arrow)" style={{ color: "currentColor" }}>
          {live && <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite" />}
        </line>
        <line x1="144" y1="35" x2="174" y2="35" className="stroke-primary" strokeDasharray="4 3" markerEnd="url(#lab-arrow)">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite" />
        </line>
        <path d="M228 35 C 244 35, 244 17, 258 17" className="stroke-primary" strokeDasharray="4 3">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M228 35 C 244 35, 244 53, 258 53" className="stroke-primary" strokeDasharray="4 3">
          <animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.6s" repeatCount="indefinite" />
        </path>
      </g>
      {replaying && (
        <text x="75" y="60" textAnchor="middle" fontSize="8" className="fill-amber-300" fontWeight="700">
          resume from seq
        </text>
      )}
    </svg>
  );
};

export const MatchTracker = () => {
  const t = useTranslations("lab.tracker");
  const wrapRef = useRef(null);
  const connectionRef = useRef(null);

  const [feed, setFeed] = useState([]);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [minute, setMinute] = useState(0);
  const [ball, setBall] = useState({ x: 50, y: 50 });
  const [status, setStatus] = useState({ status: "connected", attempt: 0 });
  const [lastSeq, setLastSeq] = useState(0);
  const [replaying, setReplaying] = useState(0);
  const [replayedTotal, setReplayedTotal] = useState(0);
  const [auto, setAuto] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let connection;
    const simulator = createSimulator({ onEvent: (event) => connection?.push(event) });
    connection = createConnection({
      simulator,
      onMessage: (event, meta) => {
        setLastSeq(event.seq);
        setMinute(event.minute);
        if (event.score) setScore(event.score);
        if (event.ball) setBall(event.ball);
        if (meta.replay) {
          setReplaying(meta.remaining);
          if (meta.remaining === 0) setReplayedTotal((n) => n + 1);
          else setReplayedTotal((n) => n + 1);
        }
        setFeed((prev) => [{ ...event, replay: meta.replay }, ...prev].slice(0, FEED_LIMIT));
      },
      onStatus: (next) => {
        setStatus(next);
        if (next.status === "connected" && next.replayed) setReplaying(next.replayed);
      },
    });
    connectionRef.current = connection;

    const wrap = wrapRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? simulator.start() : simulator.stop()),
      { threshold: 0.05 },
    );
    observer.observe(wrap);
    const onVisibility = () => (document.visibilityState === "visible" ? simulator.start() : simulator.stop());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      simulator.stop();
      connection.destroy();
    };
  }, []);

  useEffect(() => {
    if (status.status !== "reconnecting" || !status.until) return undefined;
    const tick = () => setCountdown(Math.max(0, Math.ceil((status.until - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [status]);

  const connected = status.status === "connected";

  const cut = () => {
    connectionRef.current?.disconnect();
    emitTrack("lab-disconnect");
  };
  const reconnect = () => connectionRef.current?.reconnectNow();
  const toggleAuto = () => {
    setAuto((v) => {
      connectionRef.current?.setAutoReconnect(!v);
      return !v;
    });
  };

  const statusText =
    status.status === "reconnecting"
      ? t("status.reconnecting", { seconds: countdown, attempt: status.attempt })
      : t(`status.${status.status}`);

  return (
    <div ref={wrapRef} className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-title sm:text-2xl">{t("title")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-text">{t("desc")}</p>
        </div>
        <span className={`text-cs inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.2em] ${STATUS_STYLE[status.status]}`} role="status">
          <span className={`inline-block h-2 w-2 rounded-full bg-current ${connected ? "animate-pulse" : ""}`} />
          {connected ? t("live") : status.status === "reconnecting" ? `${countdown}s` : "offline"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-[14px] border border-[color:var(--glass-border)] bg-black/20 px-4 py-3">
            <span className="text-lg font-bold text-title">{TEAMS.home}</span>
            <span className="font-accent text-3xl text-primary tabular-nums">
              {score.home} – {score.away}
            </span>
            <span className="text-lg font-bold text-title">{TEAMS.away}</span>
          </div>
          <Pitch ball={ball} connected={connected} />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text">
            <span className="tabular-nums">{t("minute", { minute })} · {t("lastSeq")} #{lastSeq}</span>
            <span className={replaying ? "text-amber-300" : "text-[color:var(--muted-color)]"}>
              {replaying ? t("catchingUp", { count: replaying }) : t("replayed", { count: replayedTotal })}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] border border-[color:var(--glass-border)] bg-black/20 p-3 text-title">
            <p className="text-cs mb-2 text-[10px] font-bold tracking-[0.15em] text-[color:var(--muted-color)]">{t("diagram")}</p>
            <Diagram status={status.status} replaying={replaying > 0} />
          </div>
          <p className="text-xs text-text">{statusText}</p>
          <div className="flex flex-wrap gap-2">
            {connected ? (
              <button type="button" onClick={cut} data-track="lab-disconnect" className="btn text-cs inline-flex !h-11 items-center gap-2 !px-5">
                <LuUnplug aria-hidden="true" /> {t("disconnect")}
              </button>
            ) : (
              <button type="button" onClick={reconnect} data-track="lab-reconnect" className="btn btn--primary text-cs inline-flex !h-11 items-center gap-2 !px-5">
                <LuPlugZap aria-hidden="true" /> {t("reconnect")}
              </button>
            )}
            <button
              type="button"
              onClick={toggleAuto}
              aria-pressed={auto}
              className={`chip !h-11 !rounded-full !px-4 ${auto ? "!border-primary !bg-[color:var(--primary-soft)]" : ""}`}
            >
              <LuRefreshCw aria-hidden="true" /> {t("auto")}
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-cs mb-2 text-[10px] font-bold tracking-[0.15em] text-[color:var(--muted-color)]">{t("feed")}</p>
        <ul className="space-y-1.5 text-xs" aria-live="polite">
          <AnimatePresence initial={false}>
            {feed.map((event) => (
              <m.li
                key={event.seq}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 rounded-lg border px-3 py-1.5 ${
                  event.replay
                    ? "border-amber-400/30 bg-amber-400/5"
                    : event.type === "goal"
                      ? "border-primary/50 bg-[color:var(--primary-soft)]"
                      : "border-[color:var(--glass-border)] bg-black/10"
                } ${event.type === "possession" ? "opacity-60" : ""}`}
              >
                <span className="w-10 shrink-0 font-mono text-[10px] text-[color:var(--muted-color)]">#{event.seq}</span>
                <span className="w-8 shrink-0 tabular-nums text-[color:var(--muted-color)]">{event.minute}&apos;</span>
                <span aria-hidden="true">{ICONS[event.type]}</span>
                <span className={`truncate ${event.type === "goal" ? "font-bold text-title" : "text-text"}`}>
                  {t(`events.${event.type}`)}
                  {event.team ? ` · ${TEAMS[event.team]}` : ""}
                </span>
                {event.replay && (
                  <span className="text-cs ml-auto shrink-0 text-[9px] font-bold tracking-[0.15em] text-amber-300">{t("replayTag")}</span>
                )}
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};
