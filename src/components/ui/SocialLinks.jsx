"use client";

import React from "react";
import { site } from "../../Data";
import { SocialIcon } from "./icons";

export const SocialLinks = ({ className = "", itemClassName = "", size = "text-xl" }) => {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {site.socials.map(({ id, name, url }) => (
        <li key={id}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            title={name}
            className={`group inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-title transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[color:var(--glass-border)] hover:bg-[color:var(--glass-bg)] hover:text-primary active:translate-y-0 ${size} ${itemClassName}`}
          >
            <SocialIcon id={id} className="transition-transform duration-300 group-hover:scale-110" />
          </a>
        </li>
      ))}
    </ul>
  );
};
