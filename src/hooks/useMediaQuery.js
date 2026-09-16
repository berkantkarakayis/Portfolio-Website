"use client";

import { useEffect, useState } from "react";

/**
 * Returns whether `query` currently matches. Starts as `initial` on the
 * server and on first client render so SSR and hydration agree.
 */
export const useMediaQuery = (query, initial = false) => {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
};
