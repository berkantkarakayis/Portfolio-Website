"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";

const shapeTwo = "/assets/shape-2.webp";

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-7 w-2/3 rounded-full bg-white/10" />
    <div className="h-4 w-full rounded-full bg-white/5" />
    <div className="aspect-[2/1] w-full rounded-[18px] bg-white/5" />
    <div className="h-11 w-40 rounded-full bg-white/10" />
  </div>
);

// Interactive demos are client-only and loaded on demand.
const SlotMachine = dynamic(() => import("./SlotMachine").then((m) => m.SlotMachine), {
  ssr: false,
  loading: Skeleton,
});
const MatchTracker = dynamic(() => import("./MatchTracker").then((m) => m.MatchTracker), {
  ssr: false,
  loading: Skeleton,
});

const Lab = () => {
  const t = useTranslations("lab");

  return (
    <section className="section scroll-mt-20 bg-third" id="lab">
      <SectionHeading title={t("title")} kicker={t("kicker")} accent={t("accent")} />

      <Reveal className="container -mt-8 mb-12 text-center" y={16}>
        <p className="mx-auto max-w-2xl text-base text-text">{t("intro")}</p>
      </Reveal>

      <StaggerGroup className="container grid gap-6 xl:grid-cols-2" stagger={0.1}>
        <StaggerItem className="h-full">
          <SpotlightCard className="relative flex h-full flex-col overflow-hidden rounded-[24px] p-5 sm:p-7">
            <SlotMachine />
            <img src={shapeTwo} alt="" className="shape pointer-events-none -bottom-8 -right-8 h-[140px] w-[140px] opacity-30" loading="lazy" decoding="async" />
          </SpotlightCard>
        </StaggerItem>
        <StaggerItem className="h-full">
          <SpotlightCard className="relative flex h-full flex-col overflow-hidden rounded-[24px] p-5 sm:p-7">
            <MatchTracker />
          </SpotlightCard>
        </StaggerItem>
      </StaggerGroup>

      <div className="section__bg-wrapper">
        <span className="bg__title" aria-hidden="true">{t("watermark")}</span>
      </div>
    </section>
  );
};

export default Lab;
