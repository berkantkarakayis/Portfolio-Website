"use client";

import React from "react";

/** Responsive bar chart built from flex items; colours come from tokens. */
export const Bars = ({ data, height = 120, format = (v) => v, labelEvery = 1 }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height }}>
        {data.map((d, i) => (
          <div
            key={d.label ?? i}
            className="relative h-full flex-1"
            title={`${d.label}: ${format(d.value)}`}
          >
            <div
              className="hm-bar absolute bottom-0 w-full rounded-t-sm transition-[height] duration-500"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 2 : 0 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-[3px] text-[9px] text-[color:var(--muted-color)]">
        {data.map((d, i) => (
          <span key={d.label ?? i} className="flex-1 whitespace-nowrap text-center">
            {i % labelEvery === 0 ? d.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
