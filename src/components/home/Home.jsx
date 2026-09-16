"use client";

import React from "react";
import Image from "next/image";
import { LuArrowDown, LuDownload } from "react-icons/lu";
import { site, heroRoles, heroStats } from "../../Data";
import { SplineScene } from "../ui/SplineScene";
import { SocialLinks } from "../ui/SocialLinks";
import { RotatingText } from "../ui/RotatingText";
import { CountUp } from "../ui/CountUp";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { scrollToSection } from "../../hooks/useActiveSection";

const shapeOne = "/assets/shape-1.webp";
const shapeTwo = "/assets/shape-2.webp";
const profileImg = "/assets/profile-img.webp";

const reveal = (introDone, delay) => ({
  className: `opacity-0 translate-y-5 ${introDone ? "animate-home-reveal" : ""}`,
  style: { animationDelay: `${delay}s` },
});

const Home = ({ introDone }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Only pull the Spline runtime on desktop, after the intro. Mobile gets the static portrait.
  const showSpline = introDone && isDesktop;

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
              Hello, <span className="text-primary">my name is</span>
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
              <span className="text-cs text-base lg:text-2xl">I am</span>
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
                download="Berkant-Karakayis-Resume.pdf"
                className="btn text-cs inline-flex items-center gap-3"
              >
                <LuDownload className="text-base" aria-hidden="true" />
                Download CV
              </a>

              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("work");
                }}
                className="hero__link text-cs group inline-flex items-center gap-3 px-2"
              >
                View my work
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
            <div className="relative z-10 aspect-square w-full overflow-hidden rounded-full bg-primary shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
              {showSpline ? (
                <SplineScene />
              ) : (
                <Image
                  src={profileImg}
                  alt="Portrait of Berkant Karakayış"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom"
                  width={685}
                  height={800}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  priority
                />
              )}
              <span
                className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"
                aria-hidden="true"
              />
            </div>

            {/* Stats: stacked row on mobile, floating cards on desktop */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 lg:contents">
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
          aria-label="Scroll to skills"
          className={`absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-title opacity-0 lg:flex ${
            introDone ? "animate-home-reveal" : ""
          }`}
          style={{ animationDelay: "1.4s" }}
        >
          Scroll
          <span className="relative h-10 w-[2px] overflow-hidden rounded-full bg-[color:var(--glass-border)]">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-hint rounded-full bg-primary" />
          </span>
        </a>

        <div className="section__deco deco__left">
          <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
        </div>
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title">Developer</span>
      </div>
    </section>
  );
};

export default Home;
