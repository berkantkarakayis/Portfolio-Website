"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Glass card with a pointer-following spotlight and an optional subtle 3D tilt.
 * Pure CSS variables + transforms, no per-frame React state.
 *
 * Pointer tracking is attached only for real mouse input: on touch devices the
 * effect is invisible (there is no hover) but the move handler would still run
 * a layout read on every frame of a scroll gesture.
 */
export const SpotlightCard = ({
  children,
  className = "",
  tilt = false,
  tiltStrength = 6,
  as = "div",
  ...rest
}) => {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const pendingRef = useRef(null);
  const Comp = as;

  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Coalesce pointer moves into one write per frame.
  const flush = useCallback(() => {
    rafRef.current = 0;
    const el = ref.current;
    const point = pendingRef.current;
    if (!el || !point) return;

    const { x, y, width, height } = point;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);

    if (tilt) {
      const px = x / width - 0.5;
      const py = y / height - 0.5;
      el.style.setProperty("--tilt-x", `${(-py * tiltStrength).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(px * tiltStrength).toFixed(2)}deg`);
    }
  }, [tilt, tiltStrength]);

  const handleMove = useCallback(
    (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      pendingRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        width: rect.width,
        height: rect.height,
      };

      if (!rafRef.current) rafRef.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const handleLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    pendingRef.current = null;

    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <Comp
      ref={ref}
      onPointerMove={canHover ? handleMove : undefined}
      onPointerLeave={canHover ? handleLeave : undefined}
      className={`spotlight-card glass ${tilt ? "spotlight-card--tilt" : ""} ${className}`}
      {...rest}
    >
      <span className="spotlight-card__glow" aria-hidden="true" />
      {children}
    </Comp>
  );
};
