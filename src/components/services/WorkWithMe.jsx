"use client";

import React from "react";
import { LuCheck, LuArrowRight, LuMail, LuSparkles } from "react-icons/lu";
import { useTranslations } from "next-intl";
import { useContent } from "@/i18n/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { GroupIcon } from "@/components/ui/icons";
import { scrollToSection } from "@/hooks/useActiveSection";

const shapeOne = "/assets/shape-1.webp";
const shapeTwo = "/assets/shape-2.webp";

const WorkWithMe = () => {
  const { site, services, engagementModels } = useContent();
  const t = useTranslations("services");

  return (
    <section className="section scroll-mt-20 bg-third" id="services">
      <SectionHeading title={t("title")} kicker={t("kicker")} accent={t("accent")} />

      <StaggerGroup className="container grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.1}>
        {services.map(({ id, kicker, title, icon, description, points, popular }) => (
          <StaggerItem key={id} className="h-full">
            <SpotlightCard
              tilt
              tiltStrength={3}
              className={`relative flex h-full flex-col overflow-hidden rounded-[24px] p-7 sm:p-8 ${
                popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Full-width ribbon flush with the card's top edge, above the icon and title. */}
              {popular && (
                <span className="text-cs -mx-7 -mt-7 mb-7 flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold tracking-[0.18em] text-white sm:-mx-8 sm:-mt-8 sm:mb-8">
                  <LuSparkles aria-hidden="true" /> {t("mostRequested")}
                </span>
              )}

              <div className="mb-6">
                <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--primary-soft)] text-3xl text-primary">
                  <GroupIcon name={icon} />
                </span>
              </div>

              <span className="text-cs mb-2 block text-xs font-bold tracking-[0.2em] text-primary">
                {kicker}
              </span>
              <h3 className="text-2xl font-bold leading-tight text-title">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-text">{description}</p>

              <ul className="mt-6 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-title">
                    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[color:var(--primary-soft)] text-primary">
                      <LuCheck className="text-xs" aria-hidden="true" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("contact");
                  }}
                  data-track="service-cta"
                  data-track-value={id}
                  className="group inline-flex items-center gap-3 text-sm font-bold text-title transition-colors hover:text-primary"
                >
                  {t("startConversation")}
                  <LuArrowRight className="text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>

              <img
                src={shapeTwo}
                alt=""
                className="shape pointer-events-none -bottom-6 -right-6 h-[130px] w-[130px] opacity-40"
                loading="lazy"
                decoding="async"
              />
            </SpotlightCard>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Engagement models + CTA */}
      <Reveal className="container mt-10" y={20}>
        <div className="glass flex flex-col gap-8 rounded-[24px] p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-6 sm:grid-cols-3 lg:flex-1">
            {engagementModels.map(({ id, label, note }) => (
              <div key={id} className="border-l-2 border-primary pl-4">
                <p className="text-cs text-xs font-bold tracking-[0.15em] text-title">{label}</p>
                <p className="mt-1 text-sm text-text">{note}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-none">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              data-track="lets-talk"
              className="btn btn--primary text-cs inline-flex items-center justify-center gap-3"
            >
              {t("letsTalk")}
              <LuArrowRight aria-hidden="true" />
            </a>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(t("mailSubject"))}`}
              data-track="email"
              data-track-value="services"
              className="btn text-cs inline-flex items-center justify-center gap-3"
            >
              <LuMail aria-hidden="true" />
              {t("emailMe")}
            </a>
          </div>
        </div>
      </Reveal>

      <div className="section__deco deco__left">
        <img src={shapeOne} alt="" className="shape" loading="lazy" decoding="async" />
      </div>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">{t("watermark")}</span>
      </div>
    </section>
  );
};

export default WorkWithMe;
