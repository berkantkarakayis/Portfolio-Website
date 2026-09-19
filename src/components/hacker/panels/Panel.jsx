"use client";

import React from "react";

export const Panel = ({ title, sub, action, id, className = "", children }) => (
  <section id={id} className={`hm-panel flex min-w-0 flex-col p-3.5 sm:p-5 ${className}`}>
    <header className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{title}</h3>
        {sub && <p className="mt-0.5 text-[11px] text-[color:var(--muted-color)]">{sub}</p>}
      </div>
      {action}
    </header>
    <div className="min-h-0 flex-1">{children}</div>
  </section>
);

export const Empty = ({ children = "no data yet" }) => (
  <p className="py-6 text-center text-xs text-[color:var(--muted-color)]">&gt; {children}</p>
);
