"use client";

import React from "react";
import { Panel, Empty } from "./Panel";
import { fmtNumber } from "../format";

/** Ranked list with proportional bars. `render` customises the label cell. */
export const RankList = ({ title, sub, items, total, render = (k) => k, max = 10, id, className }) => {
  const rows = items.slice(0, max);
  const denominator = total ?? Math.max(1, ...rows.map((r) => r.n));
  return (
    <Panel title={title} sub={sub} id={id} className={className}>
      {rows.length ? (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.k} className="text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[#b6ffb6]">{render(row.k, row)}</span>
                <span className="shrink-0 tabular-nums text-[color:var(--muted-color)]">
                  {fmtNumber(row.n)}
                  {total ? ` · ${Math.round((row.n / total) * 100)}%` : ""}
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-white/5">
                <div className="hm-bar h-full rounded-full" style={{ width: `${Math.min(100, (row.n / denominator) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty />
      )}
    </Panel>
  );
};
