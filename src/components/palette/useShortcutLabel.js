"use client";

import { useEffect, useState } from "react";

/** "⌘K" on Apple platforms, "Ctrl K" elsewhere; resolved after hydration. */
export const useShortcutLabel = () => {
  const [label, setLabel] = useState("⌘K");
  useEffect(() => {
    const apple = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- platform is browser-only
    setLabel(apple ? "⌘K" : "Ctrl K");
  }, []);
  return label;
};
