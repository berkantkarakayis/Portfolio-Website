"use client";

import React, { useEffect, useState } from "react";
import { Panel, Empty } from "./Panel";
import { api } from "../api";
import { flag, fmtDuration, timeAgo } from "../format";

const REFRESH_MS = 30_000;

export const Live = ({ auto, onSelect }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = () => api.live(controller.signal).then(setData).catch(() => {});
    load();
    if (!auto) return () => controller.abort();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [auto]);

  const items = data?.items ?? [];
  return (
    <Panel
      id="hm-live"
      title="On site now"
      sub="heartbeat within the last 60 seconds"
      action={
        <span className="inline-flex items-center gap-2 text-xs text-primary">
          <span className="hm-pulse inline-block h-2 w-2 rounded-full bg-primary" /> {items.length}
        </span>
      }
    >
      {items.length ? (
        <ul className="divide-y divide-white/5 text-xs">
          {items.map((s) => (
            <li key={s.sid}>
              <button
                type="button"
                onClick={() => onSelect(s.sid)}
                className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 py-2 text-left hover:text-primary"
              >
                <span>{flag(s.co)}</span>
                <span className="text-[#b6ffb6]">{s.city ?? s.co ?? "unknown"}</span>
                <span className="text-[color:var(--muted-color)]">{s.dev} · {s.os} · {s.br}</span>
                <span className="text-primary">#{s.section ?? "—"}</span>
                <span className="ml-auto tabular-nums text-[color:var(--muted-color)]">
                  {fmtDuration(s.act)} active · {timeAgo(s.seenAgo)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>nobody else is here right now</Empty>
      )}
    </Panel>
  );
};
