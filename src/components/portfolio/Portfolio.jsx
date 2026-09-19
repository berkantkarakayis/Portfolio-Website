"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { LuChevronDown } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useContent } from "@/i18n/content";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
// StaggerGroup / StaggerItem return with the Featured block below.
import { Reveal } from "@/components/ui/Reveal";

const shapeOne = "/assets/shape-1.webp";
const INITIAL_VISIBLE = 9;

const FilterTabs = ({ active, onChange, counts, categories, label: groupLabel }) => (
  <div
    className="header__nav mx-auto mb-12 flex max-w-full flex-wrap justify-center gap-1 rounded-full p-1.5"
    role="tablist"
    aria-label={groupLabel}
  >
    {categories.map(({ id, label }) => {
      const selected = active === id;
      return (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={selected}
          data-track="filter"
          data-track-value={id}
          onClick={() => onChange(id)}
          className={`relative rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-300 ${
            selected ? "text-white" : "text-title hover:text-primary"
          }`}
        >
          <span className="relative z-10 inline-flex items-center gap-1.5">
            {label}
            <span className={`text-[10px] ${selected ? "text-white/80" : "text-primary"}`}>
              {counts[id]}
            </span>
          </span>
          {selected && (
            <m.span
              layoutId="filter-pill"
              className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_18px_-6px_var(--primary-color)]"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              aria-hidden="true"
            />
          )}
        </button>
      );
    })}
  </div>
);

const Portfolio = () => {
  const { projects, projectCategories } = useContent();
  const t = useTranslations("portfolio");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState(false);

  // const featured = useMemo(() => projects.filter((p) => p.featured), []);

  const counts = useMemo(() => {
    const c = { all: projects.length };
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [projects]);

  const filtered = useMemo(
    () => (category === "all" ? projects : projects.filter((p) => p.category === category)),
    [category, projects],
  );

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hiddenCount = filtered.length - visible.length;

  const handleCategory = (id) => {
    setCategory(id);
    setExpanded(false);
  };

  return (
    <section className="section scroll-mt-20 bg-first" id="work">
      <SectionHeading title={t("title")} kicker={t("kicker")} accent={t("accent")} />

      {/* Featured showcase — hidden for now; the Archive grid below is enough.
          To restore it, uncomment this block, the `featured` memo above, and the
          StaggerGroup / StaggerItem imports at the top of the file.

      <div className="container mb-20">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4" y={16}>
          <div>
            <p className="text-cs text-xs font-bold tracking-[0.2em] text-primary">Featured</p>
            <h3 className="mt-1 text-2xl font-bold text-title sm:text-3xl">
              Things I&apos;m proud of
            </h3>
          </div>
          <p className="max-w-md text-sm text-text">
            Production iGaming work under NDA is shown with public links only. Personal projects
            include source code.
          </p>
        </Reveal>

        <StaggerGroup className="grid gap-6 md:grid-cols-2" stagger={0.1}>
          {featured.map((project, i) => (
            <StaggerItem
              key={project.id}
              className={i === 0 ? "md:col-span-2 xl:col-span-1" : ""}
            >
              <ProjectCard project={project} featured layout={false} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
      */}

      {/* All projects */}
      <div className="container">
        <Reveal className="mb-8 text-center" y={16}>
          <p className="text-cs text-xs font-bold tracking-[0.2em] text-primary">{t("archive")}</p>
          <h3 className="mt-1 text-2xl font-bold text-title sm:text-3xl">{t("allProjects")}</h3>
        </Reveal>

        <LayoutGroup id="portfolio">
          <Reveal y={12}>
            <FilterTabs
              active={category}
              onChange={handleCategory}
              counts={counts}
              categories={projectCategories}
              label={t("filterLabel")}
            />
          </Reveal>

          <m.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </m.div>
        </LayoutGroup>

        {hiddenCount > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              data-track="show-more"
              className="btn text-cs inline-flex items-center gap-3"
            >
              {t("showMore", { count: hiddenCount })}
              <LuChevronDown aria-hidden="true" />
            </button>
          </div>
        )}
        {expanded && filtered.length > INITIAL_VISIBLE && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              data-track="show-less"
              className="text-cs text-xs font-bold text-title transition-colors hover:text-primary"
            >
              {t("showLess")}
            </button>
          </div>
        )}
      </div>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">{t("watermark")}</span>
      </div>
    </section>
  );
};

export default Portfolio;
