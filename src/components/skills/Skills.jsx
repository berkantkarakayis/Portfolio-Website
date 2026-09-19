"use client";

import React from "react";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiTailwindcss,
  SiFramer,
  SiVite,
  SiNodedotjs,
  SiFastify,
  SiExpress,
  SiSocketdotio,
  SiRedis,
  SiMongodb,
  SiClickhouse,
  SiApachekafka,
  SiRabbitmq,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiGit,
  SiSwift,
  SiExpo,
  SiThreedotjs,
  SiStrapi,
  SiSwagger,
  SiVercel,
} from "react-icons/si";
import { useTranslations } from "next-intl";
import { useContent } from "@/i18n/content";
import LogoLoop from "@/components/skills/LogoLoop";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { GroupIcon } from "@/components/ui/icons";
import { SkillChip } from "@/components/skills/SkillChip";
import { proofFor } from "@/lib/skillProof";

const shapeOne = "/assets/shape-1.webp";

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/docs/Web/JavaScript" },
  { node: <SiRedux />, title: "Redux Toolkit", href: "https://redux-toolkit.js.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiFramer />, title: "framer-motion", href: "https://www.framer.com/motion/" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiFastify />, title: "Fastify", href: "https://fastify.dev" },
  { node: <SiExpress />, title: "Express", href: "https://expressjs.com" },
  { node: <SiSocketdotio />, title: "socket.io", href: "https://socket.io" },
  { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
  { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
  { node: <SiClickhouse />, title: "ClickHouse", href: "https://clickhouse.com" },
  { node: <SiApachekafka />, title: "Kafka", href: "https://kafka.apache.org" },
  { node: <SiRabbitmq />, title: "RabbitMQ", href: "https://www.rabbitmq.com" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiNginx />, title: "nginx", href: "https://nginx.org" },
  { node: <SiGithubactions />, title: "GitHub Actions", href: "https://github.com/features/actions" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiSwift />, title: "Swift", href: "https://www.swift.org" },
  { node: <SiExpo />, title: "Expo", href: "https://expo.dev" },
  { node: <SiThreedotjs />, title: "Three.js", href: "https://threejs.org" },
  { node: <SiStrapi />, title: "Strapi", href: "https://strapi.io" },
  { node: <SiSwagger />, title: "Swagger", href: "https://swagger.io" },
  { node: <SiVite />, title: "Vite", href: "https://vitejs.dev" },
  { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
  { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/docs/Web/HTML" },
  { node: <SiCss />, title: "CSS3", href: "https://developer.mozilla.org/docs/Web/CSS" },
];

const Skills = () => {
  const { skillGroups, projects, experience } = useContent();
  const t = useTranslations("skills");
  const content = { projects, experience };

  return (
    <section className="section relative scroll-mt-20 bg-[image:var(--second-gradient)]" id="skills">
      <SectionHeading title={t("title")} kicker={t("kicker")} accent={t("accent")} />

      <div className="relative my-6 mb-14 overflow-hidden text-title" aria-label={t("stackLabel")}>
        <LogoLoop logos={techLogos} speed={90} logoHeight={52} gap={56} ariaLabel={t("logosLabel")} />
      </div>

      <StaggerGroup
        className="skills-grid container grid gap-6 md:grid-cols-2 xl:grid-cols-6"
        stagger={0.07}
      >
        {skillGroups.map(({ id, title, icon, blurb, items, span }) => {
          const full = span === "full";
          const wide = span === "wide";

          return (
            <StaggerItem
              key={id}
              className={`h-full ${
                full
                  ? "md:col-span-2 xl:col-span-6"
                  : wide
                    ? "md:col-span-2 xl:col-span-3"
                    : "xl:col-span-2"
              }`}
            >
              <SpotlightCard className="skill-card flex h-full flex-col rounded-[22px] p-6 sm:p-7 !overflow-visible">
                <div
                  className={`flex flex-1 ${
                    full
                      ? "flex-col gap-7 lg:flex-row lg:items-center lg:gap-10"
                      : "flex-col"
                  }`}
                >
                  {/* Header: horizontal on wide/full cards, stacked on narrow ones
                      so the blurb gets the full card width instead of a ~160px column. */}
                  <div
                    className={`flex gap-4 ${
                      full || wide ? "items-start" : "flex-col items-start gap-4"
                    } ${full ? "lg:w-[320px] lg:flex-none" : ""}`}
                  >
                    <span className="skill-card__icon grid h-12 w-12 flex-none place-items-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--primary-soft)] text-2xl text-primary">
                      <GroupIcon name={icon} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-title md:text-xl">{title}</h3>
                        <span className="text-cs rounded-full border border-[color:var(--glass-border)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--muted-color)]">
                          {items.length}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-text">{blurb}</p>
                    </div>
                  </div>

                  <ul
                    className={`flex flex-wrap gap-2 ${
                      full ? "lg:flex-1" : "mt-auto pt-6"
                    }`}
                  >
                    {items.map((item) => (
                      <SkillChip key={item} label={item} proof={proofFor(item, content)} />
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <div className="section__deco deco__right">
        <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">{t("watermark")}</span>
      </div>
    </section>
  );
};

export default Skills;
