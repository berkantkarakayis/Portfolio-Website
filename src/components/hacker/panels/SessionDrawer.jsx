"use client";

import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { api } from "../api";
import { flag, fmtDateTime, fmtDuration, fmtVital } from "../format";
import { trackLabel } from "@/lib/analytics/track-ids";

const Row = ({ k, v }) => (
  <div className="flex justify-between gap-4 border-b border-white/5 py-1.5 text-xs">
    <span className="text-[color:var(--muted-color)]">{k}</span>
    <span className="text-right text-[#b6ffb6]">{v ?? "—"}</span>
  </div>
);

const describe = (type, data) => {
  switch (type) {
    case "sec":
      return `entered #${data?.id}`;
    case "click":
      return `${trackLabel(data?.id)}${data?.v ? ` → ${data.v}` : ""}`;
    case "out":
      return `outbound → ${data?.h}`;
    case "contact":
      return `contact form ${data?.ok ? "sent" : "failed"}${data?.honeypot ? " (honeypot)" : ""}`;
    case "rage":
      return "rage click";
    case "err":
      return `js error ${data?.h ?? ""}`;
    default:
      return `${type} ${data ? JSON.stringify(data) : ""}`;
  }
};

export const SessionDrawer = ({ sid, onClose }) => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .session(sid, controller.signal)
      .then((d) => setSession(d.session))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [sid]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  const s = session;
  return (
    <m.aside
      key={sid}
      role="dialog"
      aria-label="Session details"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="hm-root fixed inset-y-0 right-0 z-[405] w-full max-w-md overflow-y-auto border-l border-primary/30 bg-[#020a04] p-5 pb-20 text-[#7dff7d] shadow-2xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Session</h3>
        <button type="button" onClick={onClose} className="text-xs hover:text-primary">
          [Esc] close
        </button>
      </div>
      {error && <p className="text-xs text-[#ff9f9f]">&gt; {error}</p>}
      {!s && !error && <p className="text-xs opacity-60">&gt; loading…</p>}
      {s && (
        <>
          <p className="mb-3 break-all font-mono text-[10px] text-[color:var(--muted-color)]">{s.sid}</p>
          <Row k="started" v={fmtDateTime(s.t0)} />
          <Row k="last seen" v={fmtDateTime(s.rx ?? s.t1)} />
          <Row k="visitor" v={`${s.ret ? "returning" : "new"} · visit #${s.n ?? 1} · ${s.pv ?? 1} page view(s)`} />
          <Row k="where" v={s.geo ? `${flag(s.geo.co)} ${[s.geo.city, s.geo.reg, s.geo.co].filter(Boolean).join(", ")}` : "unknown (no geo header)"} />
          <Row k="timezone" v={s.ctx?.tz} />
          <Row k="device" v={`${s.ctx?.dev} · ${s.ctx?.os} · ${s.ctx?.br} ${s.ctx?.brv ?? ""}`} />
          <Row k="screen" v={`${s.ctx?.scr?.join("×")} @${s.ctx?.dpr}x · viewport ${s.ctx?.vp?.join("×")}`} />
          <Row k="language" v={`${s.ctx?.loc} · ${s.ctx?.lang}`} />
          <Row k="theme" v={`${s.ctx?.theme} (system ${s.ctx?.cs})${s.ctx?.rm ? " · reduced motion" : ""}`} />
          <Row k="connection" v={s.ctx?.conn} />
          <Row k="landing" v={`${s.ctx?.path}${s.ctx?.hash ?? ""}`} />
          <Row k="referrer" v={s.ctx?.ref ?? "direct"} />
          {s.ctx?.utm && <Row k="utm" v={JSON.stringify(s.ctx.utm)} />}
          <Row k="active / idle" v={`${fmtDuration(s.eng?.act)} / ${fmtDuration(s.eng?.idle)}`} />
          <Row k="scroll depth" v={`${Math.round(s.eng?.sd ?? 0)}%`} />
          <Row k="tab hidden" v={`${s.eng?.hid ?? 0}×`} />
          <Row k="rage clicks" v={s.eng?.rage ?? 0} />
          <Row k="user agent" v={<span className="break-all text-[10px]">{s.ua}</span>} />

          <h4 className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Time per section</h4>
          {Object.entries(s.eng?.sec ?? {}).sort((a, b) => b[1] - a[1]).map(([id, ms]) => (
            <Row key={id} k={`#${id}`} v={fmtDuration(ms)} />
          ))}

          <h4 className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Web vitals</h4>
          {Object.entries(s.eng?.vit ?? {}).map(([name, value]) => (
            <Row key={name} k={name} v={fmtVital(name, value)} />
          ))}

          <h4 className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Timeline</h4>
          <ol className="space-y-1 text-xs">
            {(s.ev ?? []).map(([dt, type, data], i) => (
              <li key={i} className="flex gap-3">
                <span className="w-16 shrink-0 tabular-nums text-[color:var(--muted-color)]">+{fmtDuration(dt)}</span>
                <span className="text-[#b6ffb6]">{describe(type, data)}</span>
              </li>
            ))}
            {!s.ev?.length && <li className="text-[color:var(--muted-color)]">no events</li>}
          </ol>
        </>
      )}
    </m.aside>
  );
};
