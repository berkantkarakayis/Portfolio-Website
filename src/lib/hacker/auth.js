import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { getStore } from "@/lib/analytics/store";
import { NO_STORE_HEADERS, getIp, hashIp, json } from "@/lib/analytics/server-utils";

export const SESSION_COOKIE = "hm";
export const UI_COOKIE = "hm_ui";
const SESSION_TTL_SEC = 7 * 24 * 3600;
const LABEL_RE = /^[a-z0-9_-]{1,24}$/;
const MIN_SECRET_LENGTH = 12;
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_SEC = 15 * 60;

/** `owner:xxx,friend:yyy` → [{ label, secret }] (invalid pairs are skipped). */
export const parseSecrets = (raw = process.env.HACKER_MODE_SECRETS ?? "") =>
  raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const idx = pair.indexOf(":");
      if (idx === -1) return null;
      const label = pair.slice(0, idx).trim();
      const secret = pair.slice(idx + 1).trim();
      if (!LABEL_RE.test(label) || secret.length < MIN_SECRET_LENGTH) return null;
      return { label, secret };
    })
    .filter(Boolean);

const signingKey = () => {
  const key = process.env.HACKER_MODE_SIGNING_KEY;
  return key && key.length >= 32 ? key : null;
};

const sha256 = (value) => createHash("sha256").update(String(value)).digest();
const b64url = (buf) => Buffer.from(buf).toString("base64url");
const sign = (payload, key) => b64url(createHmac("sha256", key).update(payload).digest());

/** Constant-time match against every configured secret; returns the label. */
export const matchSecret = (code) => {
  const target = sha256(code ?? "");
  let matched = null;
  for (const { label, secret } of parseSecrets()) {
    if (timingSafeEqual(target, sha256(secret)) && matched === null) matched = label;
  }
  return matched;
};

export const issueToken = (label) => {
  const key = signingKey();
  if (!key) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(
    JSON.stringify({ l: label, iat: now, exp: now + SESSION_TTL_SEC, n: randomBytes(16).toString("hex") }),
  );
  return { token: `${payload}.${sign(payload, key)}`, exp: (now + SESSION_TTL_SEC) * 1000 };
};

/** Verifies signature, expiry and that the label is still configured. */
export const verifyToken = (token) => {
  const key = signingKey();
  if (!key || typeof token !== "string") return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp * 1000 < Date.now()) return null;
    if (!parseSecrets().some((s) => s.label === data.l)) return null;
    return { label: data.l, exp: data.exp * 1000 };
  } catch {
    return null;
  }
};

const readCookie = (request, name) => {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
};

export const getSession = (request) => verifyToken(readCookie(request, SESSION_COOKIE));

const cookie = (name, value, maxAge, { httpOnly }) => {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Strict",
  ];
  if (httpOnly) parts.push("HttpOnly");
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
};

export const sessionCookies = (token) => [
  cookie(SESSION_COOKIE, token, SESSION_TTL_SEC, { httpOnly: true }),
  cookie(UI_COOKIE, "1", SESSION_TTL_SEC, { httpOnly: false }),
];

export const clearCookies = () => [
  cookie(SESSION_COOKIE, "", 0, { httpOnly: true }),
  cookie(UI_COOKIE, "", 0, { httpOnly: false }),
];

/** Cheap CSRF belt on top of SameSite=Strict. */
export const isSameOrigin = (request) => {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
};

/** Rate-limits login attempts per hashed IP. Returns remaining attempts or -1. */
export const loginAttempt = async (request) => {
  const store = getStore();
  if (!store) return -1;
  const key = `hm:rl:login:${hashIp(getIp(request))}`;
  const hits = await store.incr(key, LOGIN_WINDOW_SEC);
  return hits > LOGIN_LIMIT ? -1 : LOGIN_LIMIT - hits;
};

export const recordLogin = async (request, label) => {
  const store = getStore();
  if (!store) return;
  await store.pushAudit({
    label,
    at: Date.now(),
    ip: hashIp(getIp(request)),
    co: request.headers.get("x-vercel-ip-country") ?? null,
    ua: (request.headers.get("user-agent") ?? "").slice(0, 160),
  });
};

/** Wraps a route handler: 401 without a valid session, 503 without storage. */
export const withAuth = (handler) => async (request, context) => {
  const session = getSession(request);
  if (!session) return json({ ok: false, error: "unauthorized" }, { status: 401 });
  const store = getStore();
  if (!store) return json({ ok: false, error: "storage unavailable" }, { status: 503 });
  return handler(request, { ...context, session, store });
};

export const withCookies = (response, cookies) => {
  for (const c of cookies) response.headers.append("Set-Cookie", c);
  for (const [k, v] of Object.entries(NO_STORE_HEADERS)) response.headers.set(k, v);
  return response;
};
