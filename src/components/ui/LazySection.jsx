"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Renders `children` only once the placeholder scrolls near the viewport.
 * Keeps the section element (id, height) in the DOM from the start so the
 * nav's active-section logic and anchors keep working.
 */
export const LazySection = ({ id, className = "", minHeight = "60vh", children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    // Deep links straight to the section must load it immediately.
    if (window.location.hash === `#${id}`) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off hash check
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, visible]);

  if (visible) return children;
  return <section ref={ref} id={id} className={className} style={{ minHeight }} aria-busy="true" />;
};
