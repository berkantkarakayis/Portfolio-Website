"use client";

import React, { useState } from "react";

const LogoLoop = ({
  logos,
  speed = 80,
  gap = 48,
  logoHeight = 56,
  ariaLabel = "Technology logos",
}) => {
  const duration = Math.max(18, Math.round((logos.length * 140) / speed));
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden text-inherit"
      role="group"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex w-max motion-reduce:animate-none ${
          isPaused ? "" : "animate-logo-scroll"
        }`}
        style={{ "--logo-duration": `${duration}s` }}
      >
        <div
          className="flex items-center"
          style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
        >
          {logos.map((item, index) => (
            <div
              className="flex-none flex flex-col items-center gap-2"
              style={{ fontSize: `${logoHeight}px` }}
              key={`logo-a-${index}`}
            >
              {item.href ? (
                <a
                  className="inline-flex items-center text-inherit transition-opacity duration-200 ease-in-out hover:opacity-85"
                  href={item.href}
                  aria-label={item.title}
                  title={item.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="inline-flex items-center text-inherit">
                    {item.node}
                  </span>
                </a>
              ) : (
                <span
                  className="inline-flex items-center text-inherit"
                  aria-label={item.title}
                  title={item.title}
                >
                  {item.node}
                </span>
              )}
              <span className="text-xs leading-tight tracking-wide opacity-80 whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex items-center"
          style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
          aria-hidden="true"
        >
          {logos.map((item, index) => (
            <div
              className="flex-none flex flex-col items-center gap-2"
              style={{ fontSize: `${logoHeight}px` }}
              key={`logo-b-${index}`}
            >
              {item.href ? (
                <a
                  className="inline-flex items-center text-inherit transition-opacity duration-200 ease-in-out hover:opacity-85"
                  href={item.href}
                  aria-label={item.title}
                  title={item.title}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <span className="inline-flex items-center text-inherit">
                    {item.node}
                  </span>
                </a>
              ) : (
                <span
                  className="inline-flex items-center text-inherit"
                  aria-label={item.title}
                  title={item.title}
                  aria-hidden="true"
                >
                  {item.node}
                </span>
              )}
              <span className="text-xs leading-tight tracking-wide opacity-80 whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoLoop;
