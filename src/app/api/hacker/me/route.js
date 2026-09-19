import { getSession } from "@/lib/hacker/auth";
import { getStore } from "@/lib/analytics/store";
import { json } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = getSession(request);
  if (!session) return json({ ok: false }, { status: 401 });
  return json({ ok: true, label: session.label, exp: session.exp, store: getStore()?.kind ?? null });
}
