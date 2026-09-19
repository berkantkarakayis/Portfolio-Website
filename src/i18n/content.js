import { useMemo } from "react";
import { useMessages } from "next-intl";
import * as data from "@/Data";

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/**
 * Applies a translation overlay onto a content structure.
 *
 *  - primitive          -> overlay value if present, else the original
 *  - array of strings   -> replaced wholesale when the overlay is an array
 *  - array of {id} items-> matched by id when the overlay is an object keyed by id
 *  - object             -> recursed key by key (overlay-only keys are accepted)
 *
 * Structure (urls, tags, ids, icons) always comes from Data.jsx; only text is
 * ever overridden, so an incomplete overlay degrades to English, never breaks.
 */
export const localize = (structure, overlay) => {
  if (overlay === undefined || overlay === null) return structure;

  if (Array.isArray(structure)) {
    if (Array.isArray(overlay)) return overlay;
    if (isPlainObject(overlay)) {
      return structure.map((item) =>
        isPlainObject(item) && item.id !== undefined
          ? localize(item, overlay[item.id])
          : item,
      );
    }
    return structure;
  }

  if (isPlainObject(structure)) {
    if (!isPlainObject(overlay)) return structure;
    const out = { ...structure };
    for (const [key, value] of Object.entries(overlay)) {
      out[key] = localize(structure[key], value);
    }
    return out;
  }

  return overlay;
};

const CONTENT_KEYS = [
  "site",
  "links",
  "heroRoles",
  "heroStats",
  "skillGroups",
  "experience",
  "milestones",
  "education",
  "certificates",
  "languages",
  "projectCategories",
  "projects",
  "services",
  "engagementModels",
];

/** All Data.jsx exports, localized with the `data` namespace of the messages. */
export const getContent = (overlay = {}) =>
  Object.fromEntries(
    CONTENT_KEYS.map((key) => [key, localize(data[key], overlay?.[key])]),
  );

/** Client hook: localized content, memoised so array identities stay stable. */
export const useContent = () => {
  const messages = useMessages();
  return useMemo(() => getContent(messages?.data), [messages]);
};
