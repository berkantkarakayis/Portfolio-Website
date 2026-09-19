"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { GroupIcon } from "@/components/ui/icons";
import { SYSTEMS } from "./systemsData";
import { Diagram } from "./Diagram";

const shapeOne = "/assets/shape-1.webp";

const Systems = () => {
  const t = useTranslations("systems");
  const [active, setActive] = useState(SYSTEMS[0].id);
  const [hovered, setHovered] = useState(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only media query
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const system = SYSTEMS.find((s) => s.id === active) ?? SYSTEMS[0];
  const labels = {
    title: t(`${system.id}.title`),
    nodes: Object.fromEntries(
      system.nodes.map((n) => [
        n.id,
        {
          title: t(`${system.id}.nodes.${n.id}.title`),
          desc: t(`${system.id}.nodes.${n.id}.desc`),
        },
      ]),
    ),
  };
  const hoveredNode = hovered ? labels.nodes[hovered] : null;

  return (
    <section className="section scroll-mt-20 bg-third" id="systems">
      <SectionHeading
        title={t("title")}
        kicker={t("kicker")}
        accent={t("accent")}
      />

      <Reveal className="container -mt-8 mb-10 text-center" y={16}>
        <p className="mx-auto max-w-2xl text-base text-text">{t("intro")}</p>
      </Reveal>

      <div className="container">
        {/* system tabs */}
        <div
          className="mx-auto mb-8 flex max-w-full flex-wrap justify-center gap-2"
          role="tablist"
          aria-label={t("title")}
        >
          {SYSTEMS.map((s) => {
            const selected = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActive(s.id);
                  setHovered(null);
                }}
                data-track="systems-tab"
                data-track-value={s.id}
                className={`text-cs relative inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold tracking-[0.08em] transition-all duration-300 ${
                  selected
                    ? "border-primary bg-primary text-white shadow-[0_6px_18px_-6px_var(--primary-color)]"
                    : "border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-title hover:border-primary hover:text-primary"
                }`}
              >
                <GroupIcon name={s.icon} />
                {t(`${s.id}.tab`)}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          {/* diagram */}
          <SpotlightCard className="relative flex min-w-0 flex-col overflow-hidden rounded-[24px] p-4 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={system.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-title sm:text-2xl">
                      {t(`${system.id}.title`)}
                    </h3>
                    <p className="mt-1 text-sm text-text">
                      {t(`${system.id}.summary`)}
                    </p>
                  </div>
                </div>
                {/* On phones the diagram scrolls sideways instead of shrinking the labels. */}
                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
                  <div className="min-w-[560px] sm:min-w-0">
                    <Diagram
                      system={system}
                      labels={labels}
                      hovered={hovered}
                      onHover={setHovered}
                      reduced={reduced}
                    />
                  </div>
                </div>
              </m.div>
            </AnimatePresence>

            {/* node inspector */}
            <div
              className="mt-3 flex h-[5.5rem] items-center rounded-2xl border border-[color:var(--glass-border)] bg-black/10 px-4 py-3 text-sm sm:h-[4.75rem]"
              aria-live="polite"
            >
              <p className="line-clamp-3 sm:line-clamp-2">
                {hoveredNode ? (
                  <>
                    <span className="font-bold text-title">
                      {hoveredNode.title}
                    </span>
                    <span className="text-text"> — {hoveredNode.desc}</span>
                  </>
                ) : (
                  <span className="text-[color:var(--muted-color)]">
                    {t("hint")}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-[color:var(--muted-color)]">
              {["client", "core", "store", "external"].map((kind) => (
                <span key={kind} className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-sm border ${kind === "client" ? "border-[color:var(--glass-border)] bg-white/10" : kind === "core" ? "border-primary bg-[color:var(--primary-soft)]" : kind === "store" ? "border-[#f5b942] bg-[#f5b942]/10" : "border-[#a78bfa] bg-[#a78bfa]/10"}`}
                  />
                  {t(`legend.${kind}`)}
                </span>
              ))}
            </div>
          </SpotlightCard>

          {/* decisions */}
          <SpotlightCard className="relative flex min-w-0 flex-col overflow-hidden rounded-[24px] p-5 sm:p-7 lg:self-start">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={system.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-cs mb-3 text-xs font-bold tracking-[0.2em] text-primary">
                  {t("decisions")}
                </p>
                <ul className="space-y-4">
                  {system.decisions.map((key) => (
                    <li key={key} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-[color:var(--primary-soft)] text-primary">
                        <LuCheck className="text-xs" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-title">
                          {t(`${system.id}.decisions.${key}.title`)}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-text">
                          {t(`${system.id}.decisions.${key}.desc`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-cs mb-2 mt-6 text-xs font-bold tracking-[0.2em] text-primary">
                  {t("stack")}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {system.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[11px] text-[color:var(--muted-color)]">
                  {t("nda")}
                </p>
              </m.div>
            </AnimatePresence>
            <img
              src={shapeOne}
              alt=""
              className="shape pointer-events-none -bottom-10 -right-10 h-[140px] w-[140px] opacity-30"
              loading="lazy"
              decoding="async"
            />
          </SpotlightCard>
        </div>
      </div>

      <div className="section__deco deco__left">
        <img
          src={shapeOne}
          alt=""
          className="shape"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">
          {t("watermark")}
        </span>
      </div>
    </section>
  );
};

export default Systems;
