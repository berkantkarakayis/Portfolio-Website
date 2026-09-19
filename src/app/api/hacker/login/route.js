import {
  isSameOrigin,
  issueToken,
  loginAttempt,
  matchSecret,
  recordLogin,
  sessionCookies,
  withCookies,
} from "@/lib/hacker/auth";
import { json } from "@/lib/analytics/server-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: "forbidden" }, { status: 403 });

  const remaining = await loginAttempt(request);
  if (remaining < 0) {
    return json({ ok: false, error: "too many attempts" }, { status: 429, headers: { "Retry-After": "900" } });
  }

  let code;
  try {
    ({ code } = await request.json());
  } catch {
    return json({ ok: false, error: "bad request" }, { status: 400 });
  }
  if (typeof code !== "string" || code.length > 200) {
    return json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const label = matchSecret(code);
  if (!label) return json({ ok: false, error: "access denied", remaining }, { status: 401 });

  const issued = issueToken(label);
  if (!issued) return json({ ok: false, error: "signing key not configured" }, { status: 503 });

  await recordLogin(request, label).catch(() => {});
  return withCookies(json({ ok: true, label, exp: issued.exp }), sessionCookies(issued.token));
}
