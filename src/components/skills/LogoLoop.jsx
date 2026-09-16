"use client";

import React from "react";

const Row = ({ logos, gap, logoHeight, hidden = false }) => (
  <ul
    className="flex items-center"
    style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
    aria-hidden={hidden || undefined}
  >
    {logos.map((item, index) => (
      <li
        className="group flex flex-none flex-col items-center gap-2"
        style={{ fontSize: `${logoHeight}px` }}
        key={`${item.title}-${index}`}
      >
        <a
          className="inline-flex items-center text-inherit transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:text-primary"
          href={item.href}
          aria-label={item.title}
          title={item.title}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : 0}
        >
          {item.node}
        </a>
        <span className="whitespace-nowrap text-xs leading-tight tracking-wide opacity-70">
          {item.title}
        </span>
      </li>
    ))}
  </ul>
);

const LogoLoop = ({
  logos,
  speed = 80,
  gap = 48,
  logoHeight = 56,
  ariaLabel = "Technology logos",
}) => {
  const duration = Math.max(18, Math.round((logos.length * 140) / speed));

  return (
    <div
      className="logo-loop relative w-full overflow-hidden text-inherit"
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className="logo-loop__track flex w-max motion-reduce:animate-none"
        style={{ "--logo-duration": `${duration}s` }}
      >
        <Row logos={logos} gap={gap} logoHeight={logoHeight} />
        <Row logos={logos} gap={gap} logoHeight={logoHeight} hidden />
      </div>
    </div>
  );
};

export default LogoLoop;
