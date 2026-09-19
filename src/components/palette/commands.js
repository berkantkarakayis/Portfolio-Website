/**
 * Command registry for the palette. Everything is data + a `run` that gets
 * the palette context (navigation helpers, locale, theme). Labels come from
 * the `palette` namespace; skills are generated from the content.
 */
import { links } from "@/Data";

const RECENT_KEY = "palette_recent";
const RECENT_MAX = 5;

export const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
};

export const pushRecent = (id) => {
  try {
    const next = [id, ...readRecent().filter((x) => x !== id)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
};

/** Cheap fuzzy match: substring beats subsequence; returns a score or -1. */
export const score = (query, text) => {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;
  const idx = t.indexOf(q);
  if (idx !== -1) return 100 - idx;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i += 1) if (t[i] === q[qi]) qi += 1;
  return qi === q.length ? 10 : -1;
};

export const buildCommands = ({ t, tNav, content, otherLocale }) => {
  const commands = [];

  for (const { path } of links) {
    commands.push({
      id: `nav:${path}`,
      group: "navigate",
      label: tNav(path),
      keywords: path,
      shortcut: null,
      run: (ctx) => ctx.scrollTo(path),
    });
  }

  commands.push(
    { id: "cv", group: "actions", label: t("actions.cv"), keywords: "resume pdf download", run: (ctx) => ctx.download() },
    { id: "email", group: "actions", label: t("actions.email"), keywords: "mail contact", run: (ctx) => ctx.mailto() },
    { id: "copy-email", group: "actions", label: t("actions.copyEmail"), keywords: "clipboard", run: (ctx) => ctx.copyEmail() },
    { id: "theme", group: "actions", label: t("actions.theme"), keywords: "dark light mode", run: (ctx) => ctx.toggleTheme() },
    { id: "locale", group: "actions", label: t("actions.locale", { language: otherLocale.name }), keywords: "language english türkçe tr en", run: (ctx) => ctx.switchLocale(otherLocale.code) },
  );

  for (const social of content.site.socials) {
    commands.push({
      id: `social:${social.id}`,
      group: "socials",
      label: t("actions.open", { name: social.name }),
      keywords: social.id,
      run: (ctx) => ctx.open(social.url),
    });
  }

  for (const group of content.skillGroups) {
    for (const item of group.items) {
      commands.push({
        id: `skill:${group.id}:${item}`,
        group: "skills",
        label: item,
        hint: group.title,
        keywords: `${group.title} ${item}`,
        run: (ctx) => ctx.scrollTo("skills"),
      });
    }
  }

  return commands;
};
