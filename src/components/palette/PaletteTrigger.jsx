"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PALETTE_OPEN_EVENT } from "./events";

// The palette (registry, fuzzy search, dialog) is not part of the first load:
// it is fetched the first time someone asks for it, then stays mounted.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

const isTyping = (el) => el instanceof Element && el.closest("input, textarea, select, [contenteditable]");

export const PaletteTrigger = () => {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    if (wanted) return undefined;
    const arm = () => setWanted(true);
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        arm();
      } else if (e.key === "/" && !isTyping(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        arm();
      }
    };
    const onOpen = () => arm();
    // Warm the chunk when the browser is idle so the first open feels instant.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => import("./CommandPalette"), { timeout: 4000 })
      : setTimeout(() => import("./CommandPalette"), 3000);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_OPEN_EVENT, onOpen);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [wanted]);

  return wanted ? <CommandPalette defaultOpen /> : null;
};
