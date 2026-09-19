"use client";

import React from "react";
import { fmtDuration, fmtNumber, fmtPct } from "../format";

const Tile = ({ label, value, sub, accent = false }) => (
  <div className="hm-panel p-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--muted-color)]">{label}</p>
    <p className={`mt-2 text-2xl font-bold tabular-nums sm:text-3xl ${accent ? "text-primary" : "text-[#b6ffb6]"}`}>
      {value}
    </p>
    {sub && <p className="mt-1 text-[11px] text-[color:var(--muted-color)]">{sub}</p>}
  </div>
);

export const Kpis = ({ stats }) => {
  const { kpi } = stats;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <Tile label="Live now" value={fmtNumber(stats.liveNow)} sub="seen in last 60s" accent />
      <Tile label="Visitors" value={fmtNumber(kpi.visitors)} sub={`${fmtNumber(kpi.sessions)} sessions`} />
      <Tile label="Page views" value={fmtNumber(kpi.pageviews)} sub={`${fmtPct(kpi.returningRate)} returning`} />
      <Tile label="Avg active" value={fmtDuration(kpi.avgActive)} sub={`median ${fmtDuration(kpi.medianActive)}`} />
      <Tile label="Median scroll" value={`${Math.round(kpi.medianScroll)}%`} sub="of page height" />
      <Tile label="Bounce" value={fmtPct(kpi.bounceRate)} sub="< 10s, < 25%, no clicks" />
      <Tile label="Bots blocked" value={fmtNumber(stats.botsToday)} sub="today" />
      <Tile label="Countries" value={fmtNumber(stats.countries.filter((c) => c.k !== "??").length)} />
      <Tile label="Referrers" value={fmtNumber(stats.referrers.filter((r) => r.k !== "(direct)").length)} />
      <Tile label="JS errors" value={fmtNumber(stats.errors.reduce((a, e) => a + e.n, 0))} sub={`${stats.errors.length} distinct`} />
    </div>
  );
};
