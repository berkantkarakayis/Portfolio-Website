import { withAuth } from "@/lib/hacker/auth";
import { summarize } from "@/lib/analytics/aggregate";
import { NO_STORE_HEADERS, RANGES, lastDays, parseRange } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const csvCell = (value) => {
  if (value == null) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const GET = withAuth(async (request, { store }) => {
  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const format = url.searchParams.get("format") === "csv" ? "csv" : "json";

  const days = lastDays(RANGES[range]);
  const perDay = await store.daySessions(days);
  const sids = [...new Set(perDay.flat().map((r) => r.sid))];
  const sessions = await store.getSessions(sids);
  const filename = `analytics-${range}-${days[0]}.${format}`;
  const headers = {
    ...NO_STORE_HEADERS,
    "Content-Disposition": `attachment; filename="${filename}"`,
  };

  if (format === "json") {
    return new Response(JSON.stringify({ range, exportedAt: Date.now(), sessions }), {
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const rows = sessions.map((s) => ({
    ...summarize(s),
    sections: s.eng?.sec ?? {},
    clickIds: s.eng?.clicks ?? {},
    outbound: s.eng?.out ?? {},
    vitals: s.eng?.vit ?? {},
    utm: s.ctx?.utm ?? null,
    screen: s.ctx?.scr?.join("x") ?? "",
    tz: s.ctx?.tz ?? "",
    theme: s.ctx?.theme ?? "",
  }));
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const csv = [columns.join(","), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(","))].join("\n");
  return new Response(csv, { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8" } });
});
