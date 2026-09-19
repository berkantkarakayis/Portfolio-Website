import { after } from "next/server";
import { getStore, TTL } from "@/lib/analytics/store";
import { heartbeatSchema, sessionSchema } from "@/lib/analytics/schema";
import {
  MAX_BODY_BYTES,
  dayKey,
  empty,
  geoFrom,
  getIp,
  hashIp,
  ipMode,
  isBot,
} from "@/lib/analytics/server-utils";
import { lookupNetwork } from "@/lib/analytics/network";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_PER_MINUTE = 60;

const swallow = (promise) => promise.catch(() => {});

export async function POST(request) {
  const store = getStore();
  if (!store) return empty(503);

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return empty(413);

  let raw;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return empty(413);
    raw = JSON.parse(text);
  } catch {
    return empty(400);
  }

  const now = Date.now();

  // Heartbeat: keeps the "live now" set fresh without rewriting the document.
  if (raw?.hb === true) {
    const parsed = heartbeatSchema.safeParse(raw);
    if (!parsed.success) return empty(400);
    after(() => swallow(store.heartbeat(parsed.data.sid, now)));
    return empty(204);
  }

  const parsed = sessionSchema.safeParse(raw);
  if (!parsed.success) return empty(400);
  const doc = parsed.data;

  const today = dayKey(now);
  const userAgent = request.headers.get("user-agent") ?? "";
  if (isBot(userAgent, doc.ctx)) {
    after(() => swallow(store.incr(`a:bots:${today}`, TTL.day)));
    return empty(204);
  }

  const ip = getIp(request);
  const ipHash = hashIp(ip, today);
  const minute = Math.floor(now / 60_000);
  const hits = await store.incr(`a:rl:c:${ipHash}:${minute}`, 120);
  if (hits > RATE_LIMIT_PER_MINUTE) return empty(429);

  const headerGeo = geoFrom(request.headers);
  const base = {
    ...doc,
    geo: headerGeo,
    ip: ipHash,
    ipRaw: ipMode() === "full" ? ip : undefined,
    ua: userAgent.slice(0, 200),
    rx: now,
  };

  after(async () => {
    // Network lookup runs after the response; the edge geo wins when present.
    const net = await lookupNetwork(store, ip, ipHash).catch(() => null);
    const geo =
      headerGeo ??
      (net?.co ? { co: net.co, reg: net.reg, city: net.city, lat: net.lat, lon: net.lon, tz: net.tz, src: net.src } : null);
    await swallow(
      store.writeSession({ sid: doc.sid, doc: { ...base, geo, net }, day: dayKey(doc.t0), now }),
    );
  });
  return empty(204);
}
