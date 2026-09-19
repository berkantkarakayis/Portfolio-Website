"use client";

import React from "react";

const W = 100;
const H = 40;

/** Area + line chart; the SVG stretches, labels stay crisp in HTML. */
export const AreaLine = ({ data, height = 140, format = (v) => v }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = data.length > 1 ? W / (data.length - 1) : W;
  const points = data.map((d, i) => [i * step, H - (d.value / max) * (H - 4) - 2]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const labels = [data[0], data[Math.floor((data.length - 1) / 2)], data[data.length - 1]].filter(Boolean);

  return (
    <div>
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="hm-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#hm-area)" />
          <path d={line} fill="none" stroke="var(--primary-color)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex">
          {data.map((d, i) => (
            <div key={d.label ?? i} className="group relative flex-1" title={`${d.label}: ${format(d.value)}`} />
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-[color:var(--muted-color)]">
        {labels.map((d, i) => (
          <span key={`${d.label}-${i}`}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};
