"use client";

import React from "react";
import { Panel, Empty } from "./Panel";

export const Errors = ({ errors }) => (
  <Panel title="JS errors" sub="deduplicated by message + first stack frame">
    {errors.length ? (
      <ul className="space-y-2 text-xs">
        {errors.map((e) => (
          <li key={e.h} className="flex items-start justify-between gap-3 rounded-lg border border-[#ff5f56]/30 bg-[#ff5f56]/5 px-3 py-2">
            <code className="break-all text-[#ffb3ae]">{e.m}</code>
            <span className="shrink-0 tabular-nums text-[color:var(--muted-color)]">
              ×{e.n} · {e.sessions} sess.
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <Empty>no errors recorded</Empty>
    )}
  </Panel>
);
