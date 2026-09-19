"use client";

import { useCallback, useEffect, useRef } from "react";

/** Returns a click handler that fires `onFire` after `taps` taps within `windowMs`. */
export const useMultiTap = (onFire, { taps = 5, windowMs = 2000 } = {}) => {
  const times = useRef([]);
  const callback = useRef(onFire);
  useEffect(() => {
    callback.current = onFire;
  }, [onFire]);

  return useCallback(() => {
    const now = Date.now();
    times.current = times.current.filter((t) => now - t < windowMs);
    times.current.push(now);
    if (times.current.length >= taps) {
      times.current = [];
      callback.current?.();
    }
  }, [taps, windowMs]);
};
