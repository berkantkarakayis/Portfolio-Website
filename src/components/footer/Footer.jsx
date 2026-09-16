"use client";

import React from "react";
import { SiNextdotjs, SiTailwindcss } from "react-icons/si";
import { site, links } from "../../Data";
import { SocialLinks } from "../ui/SocialLinks";
import { scrollToSection } from "../../hooks/useActiveSection";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[color:var(--glass-border)] bg-second pb-10 pt-14">
      <div className="container grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className="text-cs text-2xl font-bold text-title transition-colors hover:text-primary"
          >
            Berkant
          </a>
          <p className="mt-3 max-w-sm text-sm text-text">
            {site.role} building real-time products, game engines and multi-brand interfaces.
            Based in {site.location}, working remotely.
          </p>
          <SocialLinks className="mt-5 -ml-2" size="text-lg" />
        </div>

        <nav aria-label="Footer">
          <p className="text-cs mb-4 text-xs font-bold tracking-[0.2em] text-primary">Navigate</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {links.map(({ name, path }) => (
              <li key={path}>
                <a
                  href={`#${path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(path);
                  }}
                  className="text-sm font-semibold text-title transition-colors hover:text-primary"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-cs mb-4 text-xs font-bold tracking-[0.2em] text-primary">Get in touch</p>
          <a href={`mailto:${site.email}`} className="text-sm font-semibold text-title transition-colors hover:text-primary">
            {site.email}
          </a>
          <p className="mt-2 text-sm text-text">{site.availability}</p>
          <a
            href={site.resume}
            download="Berkant-Karakayis-Resume.pdf"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Download CV ↓
          </a>
        </div>
      </div>

      <div className="container mt-12 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--glass-border)] pt-6 text-xs font-bold text-text sm:flex-row">
        <p className="text-cs">
          <span className="text-primary">&copy; {year}</span> {site.name}. All rights reserved.
        </p>
        <p className="inline-flex items-center gap-2">
          Built with <SiNextdotjs aria-hidden="true" title="Next.js" /> Next.js &amp;{" "}
          <SiTailwindcss aria-hidden="true" title="Tailwind CSS" /> Tailwind
        </p>
      </div>
    </footer>
  );
};

export default Footer;
