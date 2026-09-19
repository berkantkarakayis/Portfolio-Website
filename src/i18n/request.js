import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { deepMerge } from "./merge";
import en from "../../messages/en.json";
import tr from "../../messages/tr.json";

export const TIME_ZONE = "Europe/Istanbul";

// Turkish is layered over English so any key missing from tr.json falls back
// to the English copy instead of breaking the page.
const messagesByLocale = { en, tr: deepMerge(en, tr) };

export const getMessagesFor = (locale) =>
  messagesByLocale[locale] ?? messagesByLocale[routing.defaultLocale];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: getMessagesFor(locale),
    timeZone: TIME_ZONE,
    onError(error) {
      if (error.code === "MISSING_MESSAGE") return;
      throw error;
    },
    getMessageFallback({ key }) {
      return key.split(".").pop();
    },
  };
});
