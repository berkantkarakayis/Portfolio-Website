import { clearCookies, withCookies } from "@/lib/hacker/auth";
import { json } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return withCookies(json({ ok: true }), clearCookies());
}
