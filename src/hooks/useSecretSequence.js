"use client";

import { useEffect, useRef } from "react";

const RESET_AFTER_MS = 1500;

const isTypingTarget = (target) =>
  target instanceof Element &&
  Boolean(target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']"));

/** Fires `onMatch` when `sequence` is typed anywhere outside form fields. */
export const useSecretSequence = (sequence, onMatch, enabled = true) => {
  const buffer = useRef("");
  const lastKey = useRef(0);
  const callback = useRef(onMatch);
  useEffect(() => {
    callback.current = onMatch;
  }, [onMatch]);

  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1 || isTypingTarget(event.target)) return;
      const now = Date.now();
      if (now - lastKey.current > RESET_AFTER_MS) buffer.current = "";
      lastKey.current = now;
      buffer.current = (buffer.current + event.key.toLowerCase()).slice(-sequence.length);
      if (buffer.current === sequence) {
        buffer.current = "";
        callback.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sequence, enabled]);
};
