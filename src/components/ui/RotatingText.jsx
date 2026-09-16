"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

export const RotatingText = ({ items, interval = 2600, className = "" }) => {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || items.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval, reduce]);

  return (
    <span
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
      aria-live="polite"
    >
      {/* Invisible longest item keeps the width stable */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
        {items.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={items[index]}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.3, 0, 0.3, 1] }}
        >
          {items[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
};
