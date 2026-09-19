"use client";

import React from "react";
import { Panel, Empty } from "./Panel";
import { fmtDuration } from "../format";

const label = (id) => id.charAt(0).toUpperCase() + id.slice(1);

/** Time spent per section: total, per-session average and reach. */
export const Sections = ({ sections, sessions }) => {
  const max = Math.max(1, ...sections.map((s) => s.total));
  return (
    <Panel title="Where time goes" sub="active time per section, visible tab only">
      {sections.length ? (
        <ul className="space-y-3">
          {sections.map((s) => (
            <li key={s.id} className="text-xs">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span className="font-bold text-[#b6ffb6]">{label(s.id)}</span>
                <span className="text-right text-[11px] tabular-nums text-[color:var(--muted-color)]">
                  {fmtDuration(s.total)} total · avg {fmtDuration(s.avg)} · {s.sessions}/{sessions} reached
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-white/5">
                <div
                  className="hm-bar h-full rounded-full"
                  style={{ width: `${(s.total / max) * 100}%`, opacity: 0.45 + (s.total / max) * 0.55 }}
                />
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
