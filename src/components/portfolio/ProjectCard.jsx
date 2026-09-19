"use client";

import React, { useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import { LuArrowUpRight, LuLock } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useContent } from "@/i18n/content";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const shapeTwo = "/assets/shape-2.webp";

const CARD_SIZES =
  "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw";
const FEATURED_SIZES =
  "(min-width: 1280px) 30vw, (min-width: 768px) 90vw, 92vw";

/* ------------------------------------------------------------------ */
/*  Designed covers for projects without a screenshot                  */
/* ------------------------------------------------------------------ */

const REEL_GLYPHS = ["7", "★", "◆", "♠"];

/** Slot-reel motif for the shared canvas game engine. */
const GamesArt = () => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    aria-hidden="true"
  >
    <div className="flex -translate-y-3 gap-2.5 sm:gap-3">
      {REEL_GLYPHS.map((glyph, i) => (
        <span
          key={glyph}
          className="grid h-16 w-12 place-items-center rounded-xl border border-white/20 bg-white/10 text-2xl font-bold text-white/90 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur-[2px] transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:h-20 sm:w-16 sm:text-3xl"
          style={{
            transform: `translateY(${[6, -4, 2, -6][i]}px) rotate(${[-4, 2, -2, 4][i]}deg)`,
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  </div>
);

/** Three-step podium motif for the Three.js showcase. */
const PodiumArt = () => (
  <div
    className="absolute inset-0 flex items-end justify-center pb-[26%]"
    aria-hidden="true"
  >
    <span className="absolute bottom-[20%] h-28 w-28 rounded-full bg-white/25 blur-3xl" />
    {[
      { h: "h-10 sm:h-14", w: "w-10 sm:w-14", tone: "bg-white/20" },
      { h: "h-16 sm:h-24", w: "w-10 sm:w-14", tone: "bg-white/35" },
      { h: "h-7 sm:h-10", w: "w-10 sm:w-14", tone: "bg-white/15" },
    ].map(({ h, w, tone }, i) => (
      <span key={i} className={`relative ${w} ${h} ${tone} border-t border-white/40`}>
        <span className="absolute inset-x-0 -top-[6px] h-[6px] skew-x-[45deg] bg-white/50" />
      </span>
    ))}
  </div>
);

const COVER_ART = { games: GamesArt, podium: PodiumArt };

const Cover = ({ title, cover }) => {
  const Art = COVER_ART[cover?.variant];

  return (
    <div
      className="relative flex h-full w-full flex-col justify-end overflow-hidden p-5 sm:p-6"
      style={{
        background: `linear-gradient(135deg, ${cover?.from ?? "#0f766e"}, ${cover?.to ?? "#134e4a"})`,
      }}
    >
      {/* depth layers */}
      <span
        className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-white/15 blur-3xl"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(255,255,255,0.22),transparent_50%)]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:34px_34px]"
        aria-hidden="true"
      />

      {Art && <Art />}

      {/* readability scrim behind the caption */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative">
        <span className="font-accent block text-5xl font-bold leading-none text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)] sm:text-6xl">
          {cover?.label ?? title}
        </span>
        {cover?.sub && (
          <span className="mt-1.5 block max-w-[85%] text-xs font-semibold leading-snug text-white/80 sm:text-sm">
            {cover.sub}
          </span>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const LinkButton = ({ href, label, children, primary = false }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    onClick={(e) => e.stopPropagation()}
    className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-bold tracking-wide backdrop-blur transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
      primary
        ? "border-primary bg-primary text-white hover:brightness-110"
        : "border-white/40 bg-black/40 text-white hover:border-white/70 hover:bg-black/60"
    }`}
  >
    {children}
  </a>
);

export const ProjectCard = ({ project, featured = false, layout = true }) => {
  const { projectCategories } = useContent();
  const t = useTranslations("projectCard");
  const categoryLabel = (id) => projectCategories.find((c) => c.id === id)?.label ?? id;
  const {
    title,
    description,
    category,
    tags = [],
    img,
    cover,
    live,
    github,
    nda,
    role,
  } = project;

  // Fall back to the designed cover if a screenshot is missing or fails to load.
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(img) && !imgFailed;

  const visibleTags = featured ? tags : tags.slice(0, 4);
  const extraTags = tags.length - visibleTags.length;

  return (
    <m.article
      layout={layout}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 12 }}
      transition={{ duration: 0.4, ease: [0.3, 0, 0.3, 1] }}
      className="h-full"
    >
      <SpotlightCard
        tilt
        tiltStrength={featured ? 4 : 6}
        className={`group flex h-full flex-col overflow-hidden rounded-[22px] ${
          featured ? "p-4 sm:p-5" : "p-4"
        }`}
      >
        {/* Media */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[16px]">
          {showImage ? (
            <Image
              src={img}
              alt={t("screenshotAlt", { title })}
              fill
              sizes={featured ? FEATURED_SIZES : CARD_SIZES}
              onError={() => setImgFailed(true)}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <Cover title={title} cover={cover} />
          )}

          {/* Hover overlay with links */}
          <div className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <div className="flex flex-wrap gap-2">
              {live && (
                <LinkButton href={live} label={t("openLive", { title })} primary>
                  {t("live")} <LuArrowUpRight aria-hidden="true" />
                </LinkButton>
              )}
              {github && (
                <LinkButton href={github} label={t("onGitHub", { title })}>
                  <FaGithub aria-hidden="true" /> {t("code")}
                </LinkButton>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="text-cs rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white backdrop-blur">
              {categoryLabel(category)}
            </span>
            {nda && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold text-white/90 backdrop-blur">
                <LuLock aria-hidden="true" /> {t("sourcePrivate")}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          <h3 className={`font-semibold text-title ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}>
            {title}
          </h3>
          {role && (
            <p className="mt-1 text-xs font-semibold tracking-wide text-primary">{role}</p>
          )}
          <p className={`mt-3 text-text ${featured ? "text-[15px]" : "text-sm"} leading-relaxed`}>
            {description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
            {extraTags > 0 && <li className="chip opacity-70">{t("moreTags", { count: extraTags })}</li>}
          </ul>

          {/* Persistent links for touch devices */}
          <div className="mt-5 flex items-center gap-4 text-sm font-bold text-title lg:hidden">
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary">
                {t("live")} <LuArrowUpRight aria-hidden="true" />
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">
                <FaGithub aria-hidden="true" /> {t("code")}
              </a>
            )}
          </div>
        </div>

        <img
          src={shapeTwo}
          alt=""
          className="shape pointer-events-none -bottom-6 -right-6 h-[120px] w-[120px] opacity-40"
          loading="lazy"
          decoding="async"
        />
      </SpotlightCard>
    </m.article>
  );
};
