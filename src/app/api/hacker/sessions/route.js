import { withAuth } from "@/lib/hacker/auth";
import { summarize } from "@/lib/analytics/aggregate";
import { RANGES, json, lastDays, parseRange } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 100;

/**
 * Newest-first session rows with a "day:t0" cursor. Days are walked from the
 * most recent; within a day, rows older than the cursor's t0 are returned.
 */
export const GET = withAuth(async (request, { store }) => {
  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  const cursor = url.searchParams.get("cursor");

  let days = lastDays(RANGES[range]);
  let beforeT0 = Infinity;
  if (cursor) {
    const [day, t0] = cursor.split(":");
    const idx = days.indexOf(day);
    if (idx !== -1) {
      days = days.slice(idx);
      beforeT0 = Number(t0) || Infinity;
    }
  }

  const perDay = await store.daySessions(days);
  const picked = [];
  let next = null;
  outer: for (let i = 0; i < perDay.length; i += 1) {
    const rows = i === 0 ? perDay[i].filter((r) => r.t0 < beforeT0) : perDay[i];
    for (const row of rows) {
      if (picked.length === limit) {
        next = `${days[i]}:${picked[picked.length - 1].t0}`;
        break outer;
      }
      picked.push({ ...row, day: days[i] });
    }
  }

  const docs = await store.getSessions(picked.map((r) => r.sid));
  const byId = new Map(docs.map((d) => [d.sid, d]));
  const items = picked.map((r) => byId.get(r.sid)).filter(Boolean).map(summarize);
  return json({ ok: true, items, next });
});
