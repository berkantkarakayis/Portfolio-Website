import { withAuth } from "@/lib/hacker/auth";
import { json } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withAuth(async (request, { store }) => {
  const items = await store.audit();
  return json({ ok: true, items });
});
