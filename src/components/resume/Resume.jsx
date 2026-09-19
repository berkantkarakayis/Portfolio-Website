"use client";

import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  LuBriefcase,
  LuGraduationCap,
  LuAward,
  LuLanguages,
  LuDownload,
  LuChevronDown,
} from "react-icons/lu";
import { useFormatter, useTranslations } from "next-intl";
import { useContent } from "@/i18n/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
// import { Journey } from "@/components/resume/Journey";

const shapeOne = "/assets/shape-1.webp";

/** "2024-12" -> "Dec 2024" / "Ara 2024" in the active locale. */
const useMonthYear = () => {
  const format = useFormatter();
  return (iso) => {
    const [year, month] = iso.split("-").map(Number);
    return format.dateTime(new Date(Date.UTC(year, month - 1, 1)), {
      month: "short",
      year: "numeric",
    });
  };
};

const TimelineItem = ({ item, defaultOpen = false, last = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const t = useTranslations("resume");
  const monthYear = useMonthYear();
  const panelId = `exp-${item.id}`;

  return (
    <div className="relative grid gap-4 pl-10 md:grid-cols-[150px_1fr] md:gap-8 md:pl-0">
      {/* rail */}
      <span
        className={`absolute left-[11px] top-3 w-[2px] bg-[color:var(--glass-border)] md:left-[161px] ${
          last ? "h-8" : "-bottom-8"
        }`}
        aria-hidden="true"
      />
      <span
        className={`absolute left-1 top-2 grid h-4 w-4 place-items-center rounded-full border-2 md:left-[154px] ${
          item.current
            ? "border-primary bg-primary shadow-[0_0_0_6px_var(--primary-soft)]"
            : "border-[color:var(--border-color)] bg-bg"
        }`}
        aria-hidden="true"
      >
        {item.current && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        )}
      </span>

      {/* date */}
      <div className="md:pr-8 md:text-right">
        <p className="text-cs text-xs font-bold tracking-wide text-primary">
          {monthYear(item.start)} — {item.end ? monthYear(item.end) : t("present")}
        </p>
        <p className="mt-1 text-xs text-[color:var(--muted-color)]">{item.location}</p>
      </div>

      {/* card */}
      <SpotlightCard className="rounded-[20px] p-5 sm:p-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          data-track="resume-toggle"
          data-track-value={item.id}
          className="flex w-full items-start justify-between gap-4 text-left"
        >
          <div>
            <h3 className="text-lg font-semibold text-title sm:text-xl">{item.role}</h3>
            <p className="font-accent mt-0.5 text-xl text-primary">{item.company}</p>
            <p className="mt-2 text-sm text-text">{item.summary}</p>
          </div>
          <span
            className={`mt-1 grid h-9 w-9 flex-none place-items-center rounded-full border border-[color:var(--glass-border)] text-title transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            <LuChevronDown aria-hidden="true" />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <m.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.3, 0, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-5 space-y-3 border-t border-[color:var(--glass-border)] pt-5">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-text">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </m.div>
          )}
        </AnimatePresence>

        <ul className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      </SpotlightCard>
    </div>
  );
};

const SideCard = ({ icon: Icon, title, children }) => (
  <SpotlightCard className="rounded-[20px] p-5 sm:p-6">
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--glass-border)] bg-[color:var(--primary-soft)] text-xl text-primary">
        <Icon aria-hidden="true" />
      </span>
      <h3 className="text-lg font-semibold text-title">{title}</h3>
    </div>
    {children}
  </SpotlightCard>
);

const Resume = () => {
  const { site, experience, education, certificates, languages } = useContent();
  const t = useTranslations("resume");
  const tc = useTranslations("common");

  return (
    <section className="section scroll-mt-20 bg-second" id="resume">
      <SectionHeading title={t("title")} kicker={t("kicker")} accent={t("accent")} />

      {/* Journey timeline — parked for now. Re-enable by restoring <Journey /> and its import. */}
      {/* <Journey /> */}

      <div className="container grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-12">
        {/* Experience timeline */}
        <div>
          <Reveal className="mb-8 flex items-center gap-3" y={16}>
            <LuBriefcase className="text-2xl text-primary" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-title">{t("experience")}</h3>
          </Reveal>

          <StaggerGroup as="ol" className="space-y-8" stagger={0.12}>
            {experience.map((item, i) => (
              <StaggerItem key={item.id} as="li">
                <TimelineItem
                  item={item}
                  defaultOpen={i === 0}
                  last={i === experience.length - 1}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        {/* Side column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="mb-8 flex items-center gap-3" y={16}>
            <LuGraduationCap className="text-2xl text-primary" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-title">{t("educationMore")}</h3>
          </Reveal>

        <StaggerGroup className="space-y-6" stagger={0.1}>
          <StaggerItem>
            <SideCard icon={LuGraduationCap} title={t("education")}>
              {education.map((e) => (
                <div key={e.id}>
                  <p className="font-semibold text-title">{e.degree}</p>
                  <p className="font-accent text-lg text-primary">{e.school}</p>
                  <p className="text-cs mt-1 text-xs font-bold text-[color:var(--muted-color)]">
                    {e.start} — {e.end} · {e.location}
                  </p>
                  <p className="mt-3 text-sm text-text">{e.description}</p>
                </div>
              ))}
            </SideCard>
          </StaggerItem>

          <StaggerItem>
            <SideCard icon={LuAward} title={t("certificates")}>
              <ul className="flex flex-wrap gap-2">
                {certificates.map((c) => (
                  <li key={c.id} className="chip !whitespace-normal" title={`${c.name} · ${c.issuer}`}>
                    {c.name} <span className="opacity-60">· {c.issuer}</span>
                  </li>
                ))}
              </ul>
            </SideCard>
          </StaggerItem>

          <StaggerItem>
            <SideCard icon={LuLanguages} title={t("languages")}>
              <ul className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <li key={l.id} className="chip">
                    {l.name} <span className="opacity-60">· {l.level}</span>
                  </li>
                ))}
              </ul>
            </SideCard>
          </StaggerItem>

          <StaggerItem>
            <a
              href={site.resume}
              download={tc("cvFilename")}
              data-track="cv-download"
              data-track-value="resume"
              className="btn btn--primary text-cs inline-flex w-full items-center justify-center gap-3"
            >
              <LuDownload aria-hidden="true" />
              {t("downloadFull")}
            </a>
          </StaggerItem>
        </StaggerGroup>
        </div>
      </div>

      <div className="section__deco deco__right">
        <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">{t("watermark")}</span>
      </div>
    </section>
  );
};

export default Resume;
