"use client";

import React, { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const Fallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <span className="loader" aria-hidden="true" />
  </div>
);

export const SplineScene = () => {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Suspense fallback={<Fallback />}>
        <Spline scene={SCENE} className="h-full w-full" />
      </Suspense>
    </div>
  );
};
