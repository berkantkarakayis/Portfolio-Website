"use client";

import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Lazily-mounted Spline scene.
 *
 * `onReady` fires once the scene has loaded, so the caller can fade out its own
 * poster image. `paused` stops the render loop while the scene is hidden behind
 * the flipped hero card — a WebGL canvas keeps burning GPU otherwise, which is
 * what you feel as heat and battery drain on a phone.
 */
export const SplineScene = ({ onReady, paused = false }) => {
  const appRef = useRef(null);
  const [ready, setReady] = useState(false);

  const handleLoad = useCallback(
    (app) => {
      appRef.current = app;
      setReady(true);
      onReady?.();
    },
    [onReady],
  );

  useEffect(() => {
    if (!ready) return;
    const app = appRef.current;
    if (!app) return;
    if (paused) app.stop?.();
    else app.play?.();
  }, [paused, ready]);

  // Release the WebGL context when the hero unmounts.
  useEffect(
    () => () => {
      appRef.current?.dispose?.();
      appRef.current = null;
    },
    [],
  );

  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden="true">
      <Suspense fallback={null}>
        <Spline scene={SCENE} className="h-full w-full" onLoad={handleLoad} />
      </Suspense>
    </div>
  );
};
