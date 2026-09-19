/**
 * Derives evidence for a skill from the content itself: which projects tag
 * it, which roles used it and since when. No hand-maintained numbers.
 */
const ALIASES = {
  react: ["react", "react 18", "react.js"],
  "react native (expo)": ["react native"],
  "expo router": ["react native"],
  reanimated: ["react native"],
  "swift / swiftui": ["swift", "swiftui"],
  "three.js / webgl": ["three.js", "webgl"],
  "html5 canvas": ["html5 canvas", "canvas"],
  "rest / openapi": ["rest apis", "rest", "swagger"],
  "jwt · oauth 2.0 · 2fa": ["jwt", "oauth"],
  "provably-fair rng": ["rng / rtp"],
  "rtp / game math": ["rng / rtp"],
  "strapi cms": ["strapi"],
  "redis pub/sub": ["redis"],
  redis: ["redis", "redis pub/sub"],
  "tailwind css": ["tailwind css", "tailwind"],
  "material ui": ["mui", "material ui"],
  swagger: ["swagger", "rest / openapi"],
  "socket.io": ["socket.io"],
  websocket: ["websocket"],
};

const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();

const matches = (skill, tag) => {
  const s = norm(skill);
  const t = norm(tag);
  if (s === t) return true;
  const aliases = ALIASES[s];
  return aliases ? aliases.includes(t) : false;
};

const startYear = (iso) => Number(String(iso).slice(0, 4));
const monthsSince = (iso, now) => {
  const [y, m = 1] = String(iso).split("-").map(Number);
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
};

/**
 * @returns {{ projects: Array<{id,title}>, roles: Array<{company, role}>, since: number|null, years: number|null }}
 */
export const proofFor = (skill, { projects, experience }, now = new Date()) => {
  const usedIn = projects.filter((p) => (p.tags ?? []).some((tag) => matches(skill, tag)));
  const roles = experience.filter((e) => (e.tags ?? []).some((tag) => matches(skill, tag)));
  const earliest = roles.length ? roles.reduce((a, r) => (String(r.start) < String(a.start) ? r : a)).start : null;
  const since = earliest ? startYear(earliest) : null;
  // Whole years of experience, matching the "4+ years" wording elsewhere on the site.
  const years = earliest ? Math.max(1, Math.floor(monthsSince(earliest, now) / 12)) : null;
  return {
    projects: usedIn.map((p) => ({ id: p.id, title: p.title })),
    roles: roles.map((r) => ({ company: r.company, role: r.role })),
    since,
    years,
  };
};

export const hasProof = (proof) => proof.projects.length > 0 || proof.roles.length > 0;
