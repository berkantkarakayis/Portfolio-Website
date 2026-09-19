"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { LuArrowDown, LuBoxes, LuDownload, LuUserRound } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useContent } from "@/i18n/content";
import { SplineScene } from "@/components/ui/SplineScene";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { RotatingText } from "@/components/ui/RotatingText";
import { CountUp } from "@/components/ui/CountUp";
import { scrollToSection } from "@/hooks/useActiveSection";

const shapeOne = "/assets/shape-1.webp";
const shapeTwo = "/assets/shape-2.webp";
const profileImg = "/assets/profile-img.webp";

const reveal = (introDone, delay) => ({
  className: `opacity-0 translate-y-5 ${introDone ? "animate-home-reveal" : ""}`,
  style: { animationDelay: `${delay}s` },
});

const Home = ({ introDone }) => {
  const { site, heroRoles, heroStats } = useContent();
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const [flipped, setFlipped] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  // The "press me" hint retires once the toggle has done its job.
  const [toggleUsed, setToggleUsed] = useState(false);

  const handleSplineReady = useCallback(() => setSplineReady(true), []);

  // The Spline runtime is heavy, so it still waits for the intro to finish —
  // but it now loads on every viewport, with the portrait as the poster frame.
  const showSpline = introDone;

  return (
    <section className="relative bg-first pb-16 pt-24 lg:pb-20 lg:pt-0" id="home">
      <div className="relative grid min-h-[100svh] items-center pt-2 lg:pt-4">
        <div className="container relative z-10 flex w-full flex-col-reverse gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* -------- Copy -------- */}
          <div className="w-full lg:w-1/2 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:text-center">
            <span
              {...reveal(introDone, 0.05)}
              className={`${reveal(introDone, 0.05).className} mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-2 text-xs font-bold tracking-wide text-title backdrop-blur`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              {site.availability}
            </span>

            <p
              {...reveal(introDone, 0.1)}
              className={`${reveal(introDone, 0.1).className} text-cs text-base font-bold uppercase tracking-wide text-title lg:text-2xl`}
            >
              {t("greeting")} <span className="text-primary">{t("greetingAccent")}</span>
            </p>

            <h1
              {...reveal(introDone, 0.18)}
              className={`${reveal(introDone, 0.18).className} text-cs mt-1 text-5xl font-bold leading-[0.95] text-title drop-shadow-[2px_2px_0_#000] sm:text-6xl lg:text-7xl xl:text-8xl`}
            >
              <span className="block text-primary">{site.firstName}</span>
              <span className="block">{site.lastName}</span>
            </h1>

            <p
              {...reveal(introDone, 0.34)}
              className={`${reveal(introDone, 0.34).className} mt-4 flex flex-wrap items-baseline justify-center gap-x-3 font-bold text-title lg:justify-start`}
            >
              <span className="text-cs text-base lg:text-2xl">{t("iAm")}</span>
              <RotatingText
                items={heroRoles}
                className="font-accent text-2xl text-primary sm:text-3xl lg:text-4xl"
              />
            </p>

            <p
              {...reveal(introDone, 0.5)}
              className={`${reveal(introDone, 0.5).className} my-8 max-w-xl text-base text-text sm:text-lg lg:my-10`}
            >
              {site.tagline}
            </p>

            <div {...reveal(introDone, 0.7)} className={`${reveal(introDone, 0.7).className} mb-8`}>
              <SocialLinks />
            </div>

            <div
              {...reveal(introDone, 0.85)}
              className={`${reveal(introDone, 0.85).className} flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:justify-start`}
            >
              <a
                href={site.resume}
                download={tc("cvFilename")}
                className="btn text-cs inline-flex items-center gap-3"
              >
                <LuDownload className="text-base" aria-hidden="true" />
                {tc("downloadCv")}
              </a>

              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("work");
                }}
                className="hero__link text-cs group inline-flex items-center gap-3 px-2"
              >
                {t("viewWork")}
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--border-color)] transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                  <LuArrowDown className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>

          {/* -------- Visual -------- */}
          <div
            className={`relative mx-auto w-full max-w-md opacity-0 translate-y-6 scale-105 blur-sm max-lg:mb-10 sm:max-w-lg lg:w-1/2 lg:max-w-2xl ${
              introDone ? "animate-home-reveal-pop" : ""
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="hero-flip relative z-10 aspect-square w-full">
              <div className={`hero-flip__inner ${flipped ? "is-flipped" : ""}`}>
                {/* Front: the 3D scene, with the portrait as its poster. */}
                <div className="hero-flip__face overflow-hidden rounded-full bg-primary shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                  <Image
                    src={profileImg}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom transition-opacity duration-700 ${
                      splineReady ? "opacity-0" : "opacity-100"
                    }`}
                    width={1570}
                    height={1448}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    priority
                  />
                  {showSpline && (
                    <SplineScene onReady={handleSplineReady} paused={flipped} />
                  )}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"
                    aria-hidden="true"
                  />
                </div>

                {/* Back: the portrait. */}
                <div className="hero-flip__face hero-flip__face--back overflow-hidden rounded-full bg-primary shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                  <Image
                    src={profileImg}
                    alt={t("portraitAlt")}
                    className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom"
                    width={1570}
                    height={1448}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                  />
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Controls live in their own layer: .hero-flip is a z-10 stacking
                context, so anything inside it renders below the z-20 stat cards.
                This overlay matches the circle's box exactly (same width,
                aspect-square) but sits above them. */}
            <div className="pointer-events-none absolute left-0 top-0 z-40 aspect-square w-full">
              <button
                type="button"
                onClick={() => {
                  setFlipped((v) => !v);
                  setToggleUsed(true);
                }}
                aria-pressed={flipped}
                aria-label={flipped ? t("showScene") : t("showPhoto")}
                title={flipped ? t("showScene") : t("showPhoto")}
                className="hero-flip__toggle text-cs pointer-events-auto absolute bottom-0 left-1/2 grid h-12 w-12 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border-2 border-[color:var(--border-color)] bg-container text-lg text-title shadow-soft transition-colors duration-300 hover:border-primary hover:text-primary"
              >
                {!toggleUsed && (
                  <span
                    className="hero-flip__ping pointer-events-none absolute -inset-[2px] rounded-full border-2 border-primary"
                    aria-hidden="true"
                  />
                )}
                {flipped ? <LuBoxes aria-hidden="true" /> : <LuUserRound aria-hidden="true" />}
              </button>

              {/* Hand-drawn nudge so the toggle reads as a control, not decoration. */}
              <div
                className={`hero-flip__hint ${toggleUsed ? "is-gone" : ""}`}
                aria-hidden="true"
              >
                <span className="hero-flip__hint-label font-accent">{t("pressMe")}</span>
                <svg className="hero-flip__hint-arrow" viewBox="0 0 62 42" role="presentation">
                  <path d="M57 6C47 3 22 7 13 29" />
                  <path d="M11 32l13 1M11 32l8-10" />
                </svg>
              </div>
            </div>

            {/* Stats: stacked row on mobile, floating cards on desktop */}
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:contents">
              {heroStats.map(({ id, value, suffix, label, accent }, i) => (
                <p
                  key={id}
                  className={`z-20 flex h-[76px] w-[232px] items-center justify-center gap-4 rounded-full border-2 border-[color:var(--border-color)] bg-container px-5 shadow-soft lg:absolute lg:h-20 lg:w-60 ${
                    i === 0
                      ? "lg:bottom-1/4 lg:-left-6 xl:-left-10"
                      : "lg:bottom-14 lg:-right-2 xl:-right-6"
                  } ${
                    introDone
                      ? i === 0
                        ? "lg:animate-home-reveal-card-left"
                        : "lg:animate-home-reveal-card-right"
                      : "lg:opacity-0"
                  }`}
                  style={{ animationDelay: i === 0 ? "0.7s" : "0.82s" }}
                >
                  <span className="text-3xl font-bold text-title">
                    <CountUp to={value} start={introDone} />
                    <b className="text-primary">{suffix}</b>
                  </span>
                  <span className="text-cs w-1/2 text-xs font-bold leading-tight text-title sm:text-sm">
                    {label} <span className="text-primary">{accent}</span>
                  </span>
                </p>
              ))}
            </div>

            <img
              src={shapeOne}
              alt=""
              className="shape right-6 top-4 h-24 w-24 max-md:h-16 max-md:w-16"
              loading="lazy"
              decoding="async"
            />
            <img
              src={shapeTwo}
              alt=""
              className="shape bottom-10 left-0 h-16 w-16 max-md:h-12 max-md:w-12"
              loading="lazy"
              decoding="async"
            />
            <img
              src={shapeTwo}
              alt=""
              className="shape bottom-2 right-0 h-16 w-16 max-md:h-12 max-md:w-12"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <a
          href="#skills"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("skills");
          }}
          aria-label={t("scrollToSkills")}
          className={`absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-title opacity-0 lg:flex ${
            introDone ? "animate-home-reveal" : ""
          }`}
          style={{ animationDelay: "1.4s" }}
        >
          {t("scroll")}
          <span className="relative h-10 w-[2px] overflow-hidden rounded-full bg-[color:var(--glass-border)]">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-hint rounded-full bg-primary" />
          </span>
        </a>

        <div className="section__deco deco__left">
          <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
        </div>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">{t("watermark")}</span>
      </div>
    </section>
  );
};

export default Home;
