"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { LuArrowUp } from "react-icons/lu";
import { useTranslations } from "next-intl";

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          key="top"
          type="button"
          onClick={toTop}
          aria-label={t("backToTop")}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          className="glass fixed bottom-6 right-5 z-[100] grid h-12 w-12 place-items-center rounded-full text-xl text-title hover:text-primary sm:bottom-8 sm:right-8"
        >
          <LuArrowUp aria-hidden="true" />
        </m.button>
      )}
    </AnimatePresence>
  );
};
