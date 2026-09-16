"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export const CountUp = ({ to, duration = 1400, start = false, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduce || !inView || !start) return;

    let raf = 0;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(ease(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, start, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {reduce ? to : value}
    </span>
  );
};
