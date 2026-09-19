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
  isBot,
} from "@/lib/analytics/server-utils";

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

  const ipHash = hashIp(getIp(request), today);
  const minute = Math.floor(now / 60_000);
  const hits = await store.incr(`a:rl:c:${ipHash}:${minute}`, 120);
  if (hits > RATE_LIMIT_PER_MINUTE) return empty(429);

  const enriched = {
    ...doc,
    geo: geoFrom(request.headers),
    ip: ipHash,
    ua: userAgent.slice(0, 200),
    rx: now,
  };

  after(() =>
    swallow(store.writeSession({ sid: doc.sid, doc: enriched, day: dayKey(doc.t0), now })),
  );
  return empty(204);
}
