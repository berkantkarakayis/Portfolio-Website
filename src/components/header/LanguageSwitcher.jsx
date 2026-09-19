"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeNames } from "@/i18n/routing";

/**
 * Two-state EN | TR pill. Rendered as real links (crawlers, no-JS) but handled
 * client-side so the current hash section and scroll position survive.
 */
export const LanguageSwitcher = ({ className = "" }) => {
  const locale = useLocale();
  const t = useTranslations("header");
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (event, code) => {
    event.preventDefault();
    if (code === locale) return;
    router.replace(`${pathname}${window.location.hash}`, {
      locale: code,
      scroll: false,
    });
  };

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={`header__nav inline-flex items-center gap-0.5 rounded-full p-1 ${className}`}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        // "as-needed" prefix: the default locale lives at the bare path.
        const href =
          code === routing.defaultLocale
            ? pathname
            : `/${code}${pathname === "/" ? "" : pathname}`;
        return (
          <a
            key={code}
            href={href}
            hrefLang={code}
            lang={code}
            aria-current={active ? "true" : undefined}
            aria-label={
              active ? localeNames[code] : t("switchTo", { language: localeNames[code] })
            }
            onClick={(e) => switchTo(e, code)}
            className={`text-cs rounded-full px-2.5 py-1.5 text-[11px] font-bold leading-none tracking-[0.08em] transition-colors duration-300 ${
              active ? "bg-primary text-white" : "text-title hover:text-primary"
            }`}
          >
            {code}
          </a>
        );
      })}
    </div>
  );
};
