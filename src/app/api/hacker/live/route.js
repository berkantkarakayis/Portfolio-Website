import { withAuth } from "@/lib/hacker/auth";
import { summarize } from "@/lib/analytics/aggregate";
import { json } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVE_WINDOW_MS = 60_000;

export const GET = withAuth(async (request, { store }) => {
  const now = Date.now();
  const sids = await store.liveSids(now - LIVE_WINDOW_MS);
  const docs = await store.getSessions(sids);
  const items = docs.map((doc) => {
    const lastSection = [...(doc.ev ?? [])].reverse().find((e) => e[1] === "sec");
    return { ...summarize(doc), section: lastSection?.[2]?.id ?? null, seenAgo: now - (doc.rx ?? doc.t1) };
  });
  items.sort((a, b) => a.seenAgo - b.seenAgo);
  return json({ ok: true, now, items });
});
