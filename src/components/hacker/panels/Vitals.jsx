"use client";

import React from "react";
import { Panel } from "./Panel";
import { RATING_COLOR, VITALS, fmtVital, vitalRating } from "../format";

export const Vitals = ({ vitals }) => (
  <Panel title="Web vitals" sub="p75 across sessions in range">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Object.entries(VITALS).map(([name, meta]) => {
        const entry = vitals[name] ?? { p75: null, n: 0 };
        const rating = vitalRating(name, entry.p75);
        return (
          <div key={name} className="rounded-xl border border-white/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#b6ffb6]">{name}</span>
              <span className="h-2 w-2 rounded-full" style={{ background: RATING_COLOR[rating] }} />
            </div>
            <p className="mt-2 text-lg font-bold tabular-nums" style={{ color: RATING_COLOR[rating] }}>
              {fmtVital(name, entry.p75)}
            </p>
            <p className="mt-1 truncate text-[10px] text-[color:var(--muted-color)]" title={meta.label}>
              {meta.label} · n={entry.n}
            </p>
          </div>
        );
      })}
    </div>
  </Panel>
);
