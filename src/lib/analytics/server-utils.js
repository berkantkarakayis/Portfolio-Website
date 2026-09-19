import { createHash } from "node:crypto";

export const MAX_BODY_BYTES = 64 * 1024;

export const dayKey = (ts = Date.now()) => new Date(ts).toISOString().slice(0, 10);

export const getIp = (request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
};

/** ANALYTICS_IP_MODE=full stores the raw address next to the hash. */
export const ipMode = () => (process.env.ANALYTICS_IP_MODE === "full" ? "full" : "hash");

export const isPublicIp = (ip) =>
  Boolean(ip) &&
  !/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0|::1$|fc|fd|fe80)/i.test(ip);

/** Daily-rotating salted hash (used for uniqueness and rate limits). */
export const hashIp = (ip, day = dayKey()) =>
  createHash("sha256")
    .update(`${ip}:${process.env.ANALYTICS_IP_SALT ?? "dev-salt"}:${day}`)
    .digest("hex")
    .slice(0, 16);

const decode = (value) => {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** Vercel edge geo headers; null when running locally. */
export const geoFrom = (headers) => {
  const country = headers.get("x-vercel-ip-country");
  if (!country) return null;
  const num = (v) => (v == null || v === "" ? null : Number(v));
  return {
    co: country,
    reg: decode(headers.get("x-vercel-ip-country-region")),
    city: decode(headers.get("x-vercel-ip-city")),
    lat: num(headers.get("x-vercel-ip-latitude")),
    lon: num(headers.get("x-vercel-ip-longitude")),
    tz: headers.get("x-vercel-ip-timezone"),
  };
};

const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|axios|go-http|java\/|okhttp|vercel-screenshot|uptime|monitor|scrapy|phantom|selenium|puppeteer|playwright/i;

export const isBot = (userAgent, ctx) =>
  !userAgent || BOT_UA.test(userAgent) || ctx?.wd === true;

export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export const json = (body, init = {}) =>
  Response.json(body, {
    ...init,
    headers: { ...NO_STORE_HEADERS, ...(init.headers ?? {}) },
  });

export const empty = (status) =>
  new Response(null, { status, headers: NO_STORE_HEADERS });

/** Days in a range ending today: ["2026-09-19", "2026-09-18", ...]. */
export const lastDays = (n) => {
  const out = [];
  const now = Date.now();
  for (let i = 0; i < n; i += 1) out.push(dayKey(now - i * 86400000));
  return out;
};

export const RANGES = { "7d": 7, "30d": 30, "90d": 90 };
export const parseRange = (value) => RANGES[value] ? value : "30d";
