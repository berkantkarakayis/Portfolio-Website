"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Panel, Empty } from "./Panel";
import { api } from "../api";
import { flag, fmtDateTime, fmtDuration } from "../format";

export const Sessions = ({ range, refreshKey, onSelect }) => {
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(false);
  const controller = useRef(null);

  const load = useCallback(
    async (cursor) => {
      controller.current?.abort();
      const ac = new AbortController();
      controller.current = ac;
      setLoading(true);
      try {
        const data = await api.sessions(range, cursor, ac.signal);
        setItems((prev) => (cursor ? [...prev, ...data.items] : data.items));
        setNext(data.next);
      } catch {
        /* keep what we have */
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    },
    [range],
  );

  useEffect(() => {
    load(null);
    return () => controller.current?.abort();
  }, [load, refreshKey]);

  return (
    <Panel id="hm-sessions" title="Recent sessions" sub="newest first · click a row for the full timeline">
      {items.length ? (
        <>
          {/* Mobile: cards */}
          <ul className="space-y-2 md:hidden">
            {items.map((s) => (
              <li key={s.sid}>
                <button
                  type="button"
                  onClick={() => onSelect(s.sid)}
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-left text-xs transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#b6ffb6]">{flag(s.co)} {s.city ?? s.co ?? "unknown"}</span>
                    <span className="tabular-nums text-[color:var(--muted-color)]">{fmtDateTime(s.t0)}</span>
                  </div>
                  <div className="mt-1 truncate text-[color:var(--muted-color)]">
                    {s.dev} · {s.os} · {s.br} · {s.loc?.toUpperCase()} · {s.ref ?? "direct"}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums">
                    <span>{fmtDuration(s.act)} active</span>
                    <span>{Math.round(s.sd)}% scroll</span>
                    <span>{s.clicks} clicks</span>
                    {s.ret && <span className="rounded border border-primary/40 px-1 text-[10px] text-primary">ret</span>}
                    {s.bounce && <span className="rounded border border-white/10 px-1 text-[10px] text-[color:var(--muted-color)]">bounce</span>}
                    {s.errs > 0 && <span className="rounded border border-[#ff5f56]/40 px-1 text-[10px] text-[#ffb3ae]">err</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="-mx-4 hidden overflow-x-auto px-4 md:block sm:-mx-5 sm:px-5">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="text-[10px] uppercase tracking-[0.15em] text-[color:var(--muted-color)]">
                <tr>
                  {["When", "Where", "Device", "Lang", "Referrer", "Active", "Scroll", "Clicks", ""].map((h) => (
                    <th key={h} className="pb-2 pr-3 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((s) => (
                  <tr
                    key={s.sid}
                    onClick={() => onSelect(s.sid)}
                    className="cursor-pointer text-[#b6ffb6] transition-colors hover:bg-white/5"
                  >
                    <td className="py-2 pr-3 tabular-nums">{fmtDateTime(s.t0)}</td>
                    <td className="py-2 pr-3">{flag(s.co)} {s.city ?? s.co ?? "—"}</td>
                    <td className="py-2 pr-3 text-[color:var(--muted-color)]">{s.dev} · {s.os} · {s.br}</td>
                    <td className="py-2 pr-3 uppercase">{s.loc}</td>
                    <td className="max-w-[160px] truncate py-2 pr-3 text-[color:var(--muted-color)]">{s.ref ?? "direct"}</td>
                    <td className="py-2 pr-3 tabular-nums">{fmtDuration(s.act)}</td>
                    <td className="py-2 pr-3 tabular-nums">{Math.round(s.sd)}%</td>
                    <td className="py-2 pr-3 tabular-nums">{s.clicks}</td>
                    <td className="py-2 text-[10px]">
                      {s.ret && <span className="mr-1 rounded border border-primary/40 px-1 text-primary">ret</span>}
                      {s.bounce && <span className="mr-1 rounded border border-white/10 px-1 text-[color:var(--muted-color)]">bounce</span>}
                      {s.errs > 0 && <span className="rounded border border-[#ff5f56]/40 px-1 text-[#ffb3ae]">err</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        !loading && <Empty />
      )}
      {(next || loading) && (
        <div className="mt-4 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => load(next)}
            className="rounded-full border border-primary/40 px-4 py-1.5 text-xs text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            {loading ? "loading…" : "load more"}
          </button>
        </div>
      )}
    </Panel>
  );
};
