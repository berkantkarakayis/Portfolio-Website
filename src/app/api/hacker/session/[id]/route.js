import { withAuth } from "@/lib/hacker/auth";
import { json } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withAuth(async (request, { params, store }) => {
  const { id } = await params;
  if (!/^[a-f0-9-]{8,40}$/i.test(id)) return json({ ok: false, error: "bad id" }, { status: 400 });
  const session = await store.getSession(id);
  if (!session) return json({ ok: false, error: "not found" }, { status: 404 });
  return json({ ok: true, session });
});
