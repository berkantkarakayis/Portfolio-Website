"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently "active" while scrolling.
 * A section becomes active once its top passes 40% of the viewport.
 */
export const useActiveSection = (ids, fallback = ids[0]) => {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = fallback;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      // At the very bottom, force the last section (short footers etc.)
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = ids[ids.length - 1];

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids, fallback]);

  return active;
};

export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
};
