"use client";

import { useEffect } from "react";

/**
 * Mounts the first-party collector. Renders nothing, so it never affects
 * hydration; the collector itself is loaded lazily after mount.
 */
export const Analytics = () => {
  useEffect(() => {
    let stop;
    let cancelled = false;
    import("@/lib/analytics").then((mod) => {
      if (cancelled || !mod.shouldTrack()) return;
      stop = mod.startAnalytics();
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return null;
};
