import { withAuth } from "@/lib/hacker/auth";
import { aggregate } from "@/lib/analytics/aggregate";
import { RANGES, json, lastDays, parseRange } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_TTL_SEC = 60;

export const GET = withAuth(async (request, { store }) => {
  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const fresh = url.searchParams.get("fresh") === "1";

  if (!fresh) {
    const cached = await store.getCache(`stats:${range}`);
    if (cached) return json({ ok: true, cached: true, ...cached });
  }

  const days = lastDays(RANGES[range]);
  const perDay = await store.daySessions(days);
  const sids = [...new Set(perDay.flat().map((row) => row.sid))];
  const sessions = await store.getSessions(sids);
  const now = Date.now();
  const liveSids = await store.liveSids(now - 60_000);
  const bots = await store.get(`a:bots:${days[0]}`);

  const stats = {
    ...aggregate(sessions, { range, days: [...days].reverse(), now }),
    liveNow: liveSids.length,
    botsToday: Number(bots) || 0,
  };
  await store.setCache(`stats:${range}`, stats, CACHE_TTL_SEC).catch(() => {});
  return json({ ok: true, cached: false, ...stats });
});
