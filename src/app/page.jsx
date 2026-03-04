"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/header/Header";
import Home from "../components/home/Home";
import Skills from "../components/skills/Skills";
import Portfolio from "../components/portfolio/Portfolio";
import Resume from "../components/resume/Resume";
import Pricing from "../components/pricing/Pricing";
import Contact from "../components/contact/Contact";
import Footer from "../components/footer/Footer";

export default function Page() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [introMoving, setIntroMoving] = useState(false);
  const [introDone, setIntroDone] = useState(prefersReducedMotion);
  const [introDelta, setIntroDelta] = useState({ x: 0, y: 0 });
  const logoRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let holdTimer;
    let moveTimer;
    let resizeRaf = 0;

    const updateDelta = () => {
      const logoEl = logoRef.current;
      if (!logoEl) return;

      const rect = logoEl.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      setIntroDelta({ x: targetX - centerX, y: targetY - centerY });
    };

    const scheduleDelta = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(updateDelta);
    };

    const startMove = () => {
      scheduleDelta();
      requestAnimationFrame(() => {
        setIntroMoving(true);
      });
      moveTimer = setTimeout(() => {
        setIntroDone(true);
      }, 900);
    };

    holdTimer = setTimeout(startMove, 550);

    const handleResize = () => {
      if (!introDone) scheduleDelta();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(moveTimer);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", handleResize);
    };
  }, [introDone, prefersReducedMotion]);

  return (
    <main className="main">
      {!introDone && !prefersReducedMotion && (
        <div
          className={`intro-logo ${introMoving ? "is-moving" : ""} ${
            introDone ? "is-done" : ""
          }`}
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
      {/* <Services /> */}
      <Skills />
      <Portfolio />
      <Resume />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
