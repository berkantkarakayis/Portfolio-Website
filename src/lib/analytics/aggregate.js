import { dayKey } from "./server-utils";

const TOP = 50;

const counter = () => new Map();
const bump = (map, key, by = 1) => {
  if (key == null || key === "") return;
  map.set(key, (map.get(key) ?? 0) + by);
};
const top = (map, limit = TOP) =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, n]) => ({ k, n }));

const percentile = (values, p) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))];
};

const hourFormatters = new Map();
const localHour = (ts, tz) => {
  try {
    if (!hourFormatters.has(tz)) {
      hourFormatters.set(
        tz,
        new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: tz }),
      );
    }
    return Number(hourFormatters.get(tz).format(new Date(ts))) % 24;
  } catch {
    return new Date(ts).getUTCHours();
  }
};

const screenBucket = ([w]) => {
  if (!w) return "unknown";
  if (w < 480) return "< 480";
  if (w < 768) return "480–767";
  if (w < 1024) return "768–1023";
  if (w < 1440) return "1024–1439";
  if (w < 1920) return "1440–1919";
  return "≥ 1920";
};

export const isBounce = (s) => {
  const act = s.eng?.act ?? 0;
  const sd = s.eng?.sd ?? 0;
  const clicks = Object.values(s.eng?.clicks ?? {}).reduce((a, b) => a + b, 0);
  return act < 10_000 && sd < 25 && clicks === 0;
};

/** Reduces session documents into the dashboard payload. */
export const aggregate = (sessions, { range, days, now = Date.now() }) => {
  const visitors = new Set();
  const byDay = new Map(days.map((d) => [d, { day: d, sessions: 0, visitors: new Set() }]));
  const byHour = Array(24).fill(0);
  const countries = counter();
  const cities = counter();
  const referrers = counter();
  const utm = { source: counter(), medium: counter(), campaign: counter() };
  const devices = counter();
  const os = counter();
  const browsers = counter();
  const screens = counter();
  const locales = counter();
  const themes = counter();
  const sections = new Map();
  const scrollHist = Array(10).fill(0);
  const clicks = new Map();
  const outbound = counter();
  const vitals = { LCP: [], CLS: [], INP: [], FCP: [], TTFB: [] };
  const errors = new Map();
  const activeTimes = [];
  const scrolls = [];
  let bounces = 0;
  let returning = 0;
  let pageviews = 0;

  for (const s of sessions) {
    if (!s?.sid) continue;
    visitors.add(s.vid ?? s.sid);
    pageviews += s.pv ?? 1;
    const act = s.eng?.act ?? 0;
    activeTimes.push(act);
    const sd = Math.max(0, Math.min(100, s.eng?.sd ?? 0));
    scrolls.push(sd);
    scrollHist[Math.min(9, Math.floor(sd / 10))] += 1;
    if (isBounce(s)) bounces += 1;
    if (s.ret) returning += 1;

    const d = byDay.get(dayKey(s.t0));
    if (d) {
      d.sessions += 1;
      d.visitors.add(s.vid ?? s.sid);
    }
    byHour[localHour(s.t0, s.ctx?.tz)] += 1;

    if (s.geo?.co) {
      bump(countries, s.geo.co);
      if (s.geo.city) bump(cities, `${s.geo.city}, ${s.geo.co}`);
    } else {
      bump(countries, "??");
    }
    bump(referrers, s.ctx?.refHost ?? "(direct)");
    if (s.ctx?.utm) {
      bump(utm.source, s.ctx.utm.source ?? s.ctx.utm.s);
      bump(utm.medium, s.ctx.utm.medium ?? s.ctx.utm.m);
      bump(utm.campaign, s.ctx.utm.campaign ?? s.ctx.utm.c);
    }
    bump(devices, s.ctx?.dev ?? "unknown");
    bump(os, s.ctx?.os ?? "unknown");
    bump(browsers, s.ctx?.br ?? "unknown");
    bump(screens, screenBucket(s.ctx?.scr ?? []));
    bump(locales, s.ctx?.loc ?? "en");
    bump(themes, s.ctx?.theme ?? "dark");

    for (const [id, ms] of Object.entries(s.eng?.sec ?? {})) {
      const entry = sections.get(id) ?? { id, total: 0, sessions: 0 };
      entry.total += ms;
      entry.sessions += 1;
      sections.set(id, entry);
    }
    for (const [id, n] of Object.entries(s.eng?.clicks ?? {})) {
      const entry = clicks.get(id) ?? { k: id, n: 0, sessions: 0 };
      entry.n += n;
      entry.sessions += 1;
      clicks.set(id, entry);
    }
    for (const [host, n] of Object.entries(s.eng?.out ?? {})) bump(outbound, host, n);
    for (const [name, value] of Object.entries(s.eng?.vit ?? {})) {
      if (vitals[name] && Number.isFinite(value)) vitals[name].push(value);
    }
    for (const err of s.eng?.errs ?? []) {
      const entry = errors.get(err.h) ?? { h: err.h, m: err.m, n: 0, sessions: 0 };
      entry.n += err.n ?? 1;
      entry.sessions += 1;
      errors.set(err.h, entry);
    }
  }

  const total = sessions.length;
  const pct = (n) => (total ? Math.round((n / total) * 1000) / 10 : 0);

  return {
    range,
    days,
    generatedAt: now,
    kpi: {
      visitors: visitors.size,
      sessions: total,
      pageviews,
      avgActive: total ? Math.round(activeTimes.reduce((a, b) => a + b, 0) / total) : 0,
      medianActive: percentile(activeTimes, 0.5) ?? 0,
      medianScroll: percentile(scrolls, 0.5) ?? 0,
      bounceRate: pct(bounces),
      returningRate: pct(returning),
    },
    byDay: [...byDay.values()]
      .map((d) => ({ day: d.day, sessions: d.sessions, visitors: d.visitors.size }))
      .sort((a, b) => (a.day < b.day ? -1 : 1)),
    byHour,
    countries: top(countries),
    cities: top(cities, 30),
    referrers: top(referrers, 30),
    utm: { source: top(utm.source, 20), medium: top(utm.medium, 20), campaign: top(utm.campaign, 20) },
    devices: top(devices, 5),
    os: top(os, 10),
    browsers: top(browsers, 10),
    screens: top(screens, 10),
    locales: top(locales, 5),
    themes: top(themes, 3),
    sections: [...sections.values()]
      .map((e) => ({ ...e, avg: e.sessions ? Math.round(e.total / e.sessions) : 0 }))
      .sort((a, b) => b.total - a.total),
    scrollHist,
    clicks: [...clicks.values()].sort((a, b) => b.n - a.n).slice(0, TOP),
    outbound: top(outbound, 30),
    vitals: Object.fromEntries(
      Object.entries(vitals).map(([name, values]) => [
        name,
        { p75: percentile(values, 0.75), n: values.length },
      ]),
    ),
    errors: [...errors.values()].sort((a, b) => b.n - a.n).slice(0, 30),
  };
};

/** Compact row for session tables. */
export const summarize = (s) => ({
  sid: s.sid,
  vid: s.vid,
  t0: s.t0,
  t1: s.t1,
  ret: Boolean(s.ret),
  pv: s.pv ?? 1,
  act: s.eng?.act ?? 0,
  sd: s.eng?.sd ?? 0,
  clicks: Object.values(s.eng?.clicks ?? {}).reduce((a, b) => a + b, 0),
  co: s.geo?.co ?? null,
  city: s.geo?.city ?? null,
  dev: s.ctx?.dev ?? null,
  os: s.ctx?.os ?? null,
  br: s.ctx?.br ?? null,
  loc: s.ctx?.loc ?? null,
  ref: s.ctx?.refHost ?? null,
  bounce: isBounce(s),
  errs: (s.eng?.errs ?? []).length,
});
