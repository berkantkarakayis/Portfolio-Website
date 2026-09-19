"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { m, useScroll, useSpring } from "framer-motion";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTranslations } from "next-intl";
import { links } from "@/Data";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { LanguageSwitcher } from "@/components/header/LanguageSwitcher";
import { useActiveSection, scrollToSection } from "@/hooks/useActiveSection";
import { useMultiTap } from "@/hooks/useMultiTap";
import { useHackerMode } from "@/components/hacker/HackerModeProvider";

const shapeOne = "/assets/shape-1.webp";

const DEFAULT_THEME = "dark-theme";

const getStorageTheme = () => {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light-theme" || stored === "dark-theme" ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

const Header = ({ introDone, logoRef }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [themeReady, setThemeReady] = useState(false);
  const themeToggleRef = useRef(null);
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  // Five quick taps on the logo open Hacker Mode on touch devices.
  const { open: openHackerMode } = useHackerMode();
  const onLogoTap = useMultiTap(openHackerMode);

  const sectionIds = useMemo(() => links.map((l) => l.path), []);
  const activeLink = useActiveSection(sectionIds, "home");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.3,
  });

  /* ---------------- theme ---------------- */
  const applyTheme = (next) => {
    setTheme(next);
  };

  const toggleTheme = async () => {
    const next = theme === "light-theme" ? "dark-theme" : "light-theme";

    if (!themeToggleRef.current || !document.startViewTransition) {
      applyTheme(next);
      return;
    }

    const { top, left, width, height } =
      themeToggleRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    await document.startViewTransition(() => {
      flushSync(() => applyTheme(next));
    }).ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 450,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  useEffect(() => {
    // Read the persisted theme once after hydration (SSR can't see localStorage).
    /* eslint-disable react-hooks/set-state-in-effect */
    setTheme(getStorageTheme());
    setThemeReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    // Swap only the theme class; next/font adds its own classes to <html>.
    const root = document.documentElement;
    root.classList.remove("light-theme", "dark-theme");
    root.classList.add(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme, themeReady]);

  /* ---------------- scroll state ---------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- mobile menu ---------------- */
  useEffect(() => {
    document.body.classList.toggle("no-scroll", showMenu);
    if (!showMenu) return;
    const onKey = (e) => e.key === "Escape" && setShowMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMenu]);

  const goTo = (id) => {
    setShowMenu(false);
    scrollToSection(id);
  };

  const isDark = theme === "dark-theme";

  return (
    <header
      className={`fixed top-0 z-[130] w-full transition-[padding,background-color,box-shadow] duration-500 ease-out ${
        scrolled ? "header--solid py-3" : "py-5 lg:py-7"
      }`}
    >
      <m.span
        className="pointer-events-none absolute left-0 top-0 h-[2px] w-full origin-left bg-primary"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      <nav className="container flex items-center justify-between gap-6" aria-label={t("primaryNav")}>
        <span ref={logoRef} className="inline-flex">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onLogoTap();
              goTo("home");
            }}
            className={`text-cs text-2xl font-bold text-title transition-all duration-500 ease-in-out hover:text-primary ${
              introDone ? "" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            Berkant
          </a>
        </span>

        {/* Desktop nav */}
        <ul className="header__nav hidden items-center gap-1 rounded-full p-1.5 lg:flex">
          {links.map(({ path }) => {
            const active = activeLink === path;
            return (
              <li key={path} className="relative">
                <a
                  href={`#${path}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(path);
                  }}
                  aria-current={active ? "location" : undefined}
                  data-track="nav"
                  data-track-value={path}
                  className={`relative z-10 block rounded-full px-4 py-2 text-xs font-bold tracking-[0.08em] uppercase transition-colors duration-300 ${
                    active ? "text-white" : "text-title hover:text-primary"
                  }`}
                >
                  {tNav(path)}
                </a>
                {active && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_18px_-6px_var(--primary-color)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />

          <button
            ref={themeToggleRef}
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? t("switchToLight") : t("switchToDark")}
            aria-pressed={isDark}
            data-track="theme-toggle"
            data-track-value={isDark ? "light" : "dark"}
            className="grid h-11 w-11 place-items-center rounded-full text-xl text-title transition-all duration-300 hover:bg-[color:var(--glass-bg)] hover:text-primary active:scale-95"
          >
            {themeReady && isDark ? <BsSun /> : <BsMoon />}
          </button>

          <button
            type="button"
            onClick={() => setShowMenu((v) => !v)}
            aria-label={showMenu ? t("closeMenu") : t("openMenu")}
            aria-expanded={showMenu}
            aria-controls="mobile-menu"
            data-track="menu-toggle"
            className="relative z-[140] grid h-11 w-11 place-items-center rounded-full text-title transition-colors duration-300 hover:bg-[color:var(--glass-bg)] lg:hidden"
          >
            <span className="relative block h-5 w-6">
              <span
                className={`absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ease-in-out ${
                  showMenu ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full bg-current transition-all duration-300 ease-in-out ${
                  showMenu ? "top-1/2 -translate-y-1/2 rotate-45" : "bottom-0.5"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`fixed right-0 top-0 z-[120] h-dvh w-0 overflow-hidden bg-bg-alt transition-[width] duration-700 ease-[var(--transition)] lg:hidden ${
          showMenu ? "w-full sm:w-96" : ""
        }`}
        aria-hidden={!showMenu}
      >
        <div className="flex h-full w-full flex-col items-center justify-center px-8 pt-20">
          <ul className="mb-10 flex flex-col items-center gap-1">
            {links.map(({ path }, i) => (
              <li
                key={path}
                className={`transition-all duration-500 ${
                  showMenu ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
                style={{ transitionDelay: showMenu ? `${120 + i * 50}ms` : "0ms" }}
              >
                <a
                  href={`#${path}`}
                  tabIndex={showMenu ? 0 : -1}
                  data-track="nav"
                  data-track-value={path}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(path);
                  }}
                  className={`text-cs block px-4 py-2.5 text-lg font-bold transition-colors duration-300 hover:text-primary ${
                    activeLink === path ? "text-primary" : "text-title"
                  }`}
                >
                  {tNav(path)}
                </a>
              </li>
            ))}
          </ul>

          <SocialLinks size="text-lg" />
        </div>

        <div className="section__deco deco__left left-20">
          <img src={shapeOne} alt="" className="shape -left-40 -top-48 -z-10" />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 lg:hidden ${
          showMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setShowMenu(false)}
        aria-hidden="true"
      />
    </header>
  );
};

export default Header;
