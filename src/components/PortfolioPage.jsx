"use client";

import React, { useEffect, useRef, useState } from "react";
import { LazyMotion } from "framer-motion";
import Header from "@/components/header/Header";
import Home from "@/components/home/Home";
import Skills from "@/components/skills/Skills";
import Portfolio from "@/components/portfolio/Portfolio";
import Resume from "@/components/resume/Resume";
import WorkWithMe from "@/components/services/WorkWithMe";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { HackerModeProvider } from "@/components/hacker/HackerModeProvider";

// Loaded on demand so the animation runtime stays out of the initial bundle.
const loadMotionFeatures = () =>
  import("framer-motion").then((mod) => mod.domMax);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INTRO_SEEN_KEY = "introSeen";

const introAlreadySeen = () => {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage unavailable */
  }
};

export default function PortfolioPage() {
  const [introMoving, setIntroMoving] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introDelta, setIntroDelta] = useState({ x: 0, y: 0 });
  const logoRef = useRef(null);

  useEffect(() => {
    // Skip the intro for reduced motion, and don't replay it when the page
    // remounts on a locale switch within the same tab.
    if (prefersReducedMotion() || introAlreadySeen()) {
      // One-off sync with browser-only state after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIntroDone(true);
      return;
    }

    let resizeRaf = 0;

    const updateDelta = () => {
      const logoEl = logoRef.current;
      if (!logoEl) return;
      const rect = logoEl.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      setIntroDelta({
        x: targetX - window.innerWidth / 2,
        y: targetY - window.innerHeight / 2,
      });
    };

    const scheduleDelta = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(updateDelta);
    };

    const holdTimer = setTimeout(() => {
      scheduleDelta();
      requestAnimationFrame(() => setIntroMoving(true));
    }, 550);
    const moveTimer = setTimeout(() => {
      markIntroSeen();
      setIntroDone(true);
    }, 550 + 900);

    window.addEventListener("resize", scheduleDelta);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(moveTimer);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", scheduleDelta);
    };
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <HackerModeProvider>
      <main className="main">
        {!introDone && (
          <div
            className={`intro-logo ${introMoving ? "is-moving" : ""}`}
            style={{
              "--intro-dx": `${introDelta.x}px`,
              "--intro-dy": `${introDelta.y}px`,
            }}
            aria-hidden="true"
          >
            <span className="text-cs">BERKANT</span>
          </div>
        )}

        <Header introDone={introDone} logoRef={logoRef} />
        <Home introDone={introDone} />
        <Skills />
        <Portfolio />
        <Resume />
        <WorkWithMe />
        <Contact />
        <Footer />
        <BackToTop />
      </main>
      </HackerModeProvider>
    </LazyMotion>
  );
}
