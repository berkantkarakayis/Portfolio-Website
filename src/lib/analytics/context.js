import { parseUserAgent } from "./ua";

/** One-off snapshot of where the visitor is and what they came with. */
export const buildContext = () => {
  const url = new URL(window.location.href);
  const html = document.documentElement;

  const utm = {};
  for (const [key, value] of url.searchParams) {
    if (key.startsWith("utm_")) utm[key.slice(4)] = value.slice(0, 120);
  }

  const referrer = document.referrer || null;
  let refHost = null;
  if (referrer) {
    try {
      const host = new URL(referrer).hostname;
      refHost = host === window.location.hostname ? null : host;
    } catch {
      refHost = null;
    }
  }

  return {
    url: `${url.origin}${url.pathname}${url.search}`.slice(0, 600),
    path: url.pathname.slice(0, 200),
    hash: url.hash.slice(0, 80),
    loc: html.lang || "en",
    ref: refHost ? referrer.slice(0, 600) : null,
    refHost,
    utm: Object.keys(utm).length ? utm : null,
    scr: [window.screen?.width ?? 0, window.screen?.height ?? 0],
    vp: [window.innerWidth, window.innerHeight],
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    lang: navigator.language ?? "",
    langs: [...(navigator.languages ?? [])].slice(0, 10),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    ...parseUserAgent(),
    conn: navigator.connection?.effectiveType ?? null,
    rm: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    theme: html.classList.contains("light-theme") ? "light" : "dark",
    cs: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    touch: (navigator.maxTouchPoints ?? 0) > 0,
    wd: navigator.webdriver === true,
  };
};
