import { getStore } from "@/lib/analytics/store";
import { RANGES, lastDays } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_KEY = "public";
const CACHE_TTL_SEC = 60;
const LIVE_WINDOW_MS = 60_000;

/**
 * Anonymous, aggregate-only numbers for the public "live on this site" widget.
 * No ids, no per-session data; cached for a minute and safe to expose.
 */
export async function GET() {
  const store = getStore();
  if (!store) return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const cached = await store.getCache(CACHE_KEY).catch(() => null);
  const now = Date.now();
  const liveNow = (await store.liveSids(now - LIVE_WINDOW_MS).catch(() => [])).length;

  let payload = cached;
  if (!payload) {
    const days = lastDays(RANGES["30d"]);
    const perDay = await store.daySessions(days);
    const sids = [...new Set(perDay.flat().map((r) => r.sid))];
    const sessions = await store.getSessions(sids);
    const visitors = new Set();
    const countries = new Map();
    for (const s of sessions) {
      visitors.add(s.vid ?? s.sid);
      const co = s.geo?.co;
      if (co && co !== "??") countries.set(co, (countries.get(co) ?? 0) + 1);
    }
    payload = {
      visitors: visitors.size,
      sessions: sessions.length,
      countries: countries.size,
      topCountries: [...countries.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k),
      generatedAt: now,
    };
    await store.setCache(CACHE_KEY, payload, CACHE_TTL_SEC).catch(() => {});
  }

  return Response.json(
    { ok: true, ...payload, liveNow },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=60", "X-Robots-Tag": "noindex" } },
  );
}
