"use client";

import React, { useEffect, useState } from "react";

const GlareHover = ({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
  className = "",
}) => {
  const [active, setActive] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!playOnce || !active) return;
    const timer = setTimeout(() => setActive(false), transitionDuration);
    return () => clearTimeout(timer);
  }, [active, playOnce, transitionDuration]);

  const handleEnter = () => {
    if (playOnce && played) return;
    setActive(true);
    if (playOnce) setPlayed(true);
  };

  const handleLeave = () => {
    if (!playOnce) setActive(false);
  };

  return (
    <div
      className={`relative overflow-hidden before:content-[''] before:absolute before:top-1/2 before:left-[-40%] before:w-[var(--glare-size)] before:h-[calc(var(--glare-size)*1.6)] before:bg-[linear-gradient(var(--glare-angle),rgba(255,255,255,0)_0%,var(--glare-color)_45%,rgba(255,255,255,0)_70%)] before:opacity-0 before:-translate-x-1/2 before:-translate-y-1/2 before:transition-[opacity,transform] before:duration-[var(--glare-duration)] before:ease-in-out before:pointer-events-none ${
        active ? "before:[opacity:var(--glare-opacity)] before:translate-x-[220%]" : ""
      } ${className}`.trim()}
      style={{
        "--glare-color": glareColor,
        "--glare-opacity": glareOpacity,
        "--glare-angle": `${glareAngle}deg`,
        "--glare-size": `${glareSize}px`,
        "--glare-duration": `${transitionDuration}ms`,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlareHover;
