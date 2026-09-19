import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  // "/" is English, "/tr" is Turkish. No auto-detection or cookie: URLs stay
  // stable for crawlers and the switcher is the only way to change language.
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});

export const localeNames = { en: "English", tr: "Türkçe" };
