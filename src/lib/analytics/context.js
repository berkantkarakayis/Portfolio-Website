import { parseUserAgent } from "./ua";

const gpuRenderer = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return null;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    return typeof renderer === "string" ? renderer.slice(0, 120) : null;
  } catch {
    return null;
  }
};

/** Navigation timing in ms: dns, tcp, ttfb, dom-interactive, load. */
export const navigationTiming = () => {
  const [nav] = performance.getEntriesByType?.("navigation") ?? [];
  if (!nav) return null;
  const ms = (v) => Math.max(0, Math.round(v));
  return {
    dns: ms(nav.domainLookupEnd - nav.domainLookupStart),
    tcp: ms(nav.connectEnd - nav.connectStart),
    ttfb: ms(nav.responseStart - nav.requestStart),
    dom: ms(nav.domInteractive),
    load: ms(nav.loadEventEnd || nav.domComplete),
    type: nav.type,
  };
};

/** Battery snapshot when the (Chromium-only) API exists. */
export const batterySnapshot = async () => {
  try {
    if (!navigator.getBattery) return null;
    const b = await navigator.getBattery();
    return { lvl: Math.round(b.level * 100), chg: b.charging };
  } catch {
    return null;
  }
};

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
    // hardware & environment
    pf: navigator.platform ?? "",
    cores: navigator.hardwareConcurrency ?? null,
    mem: navigator.deviceMemory ?? null,
    gpu: gpuRenderer(),
    depth: window.screen?.colorDepth ?? null,
    orient: window.screen?.orientation?.type ?? (window.innerWidth >= window.innerHeight ? "landscape" : "portrait"),
    tzo: new Date().getTimezoneOffset(),
    cookies: navigator.cookieEnabled,
    standalone: window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true,
    net: navigator.connection
      ? {
          down: navigator.connection.downlink ?? null,
          rtt: navigator.connection.rtt ?? null,
          save: navigator.connection.saveData ?? false,
        }
      : null,
    bat: null,
    nav: navigationTiming(),
  };
};
