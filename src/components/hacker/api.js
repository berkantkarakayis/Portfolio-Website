const BASE = "/api/hacker";

const request = async (path, init = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "same-origin",
    headers: { accept: "application/json", ...(init.headers ?? {}) },
    ...init,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
};

const getOrThrow = async (path, signal) => {
  const { status, ok, data } = await request(path, { signal });
  if (!ok) throw Object.assign(new Error(data?.error ?? `HTTP ${status}`), { status });
  return data;
};

export const api = {
  login: (code) =>
    request("/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    }),
  logout: () => request("/logout", { method: "POST" }),
  me: (signal) => request("/me", { signal }),
  stats: (range, { fresh = false, signal } = {}) =>
    getOrThrow(`/stats?range=${range}${fresh ? "&fresh=1" : ""}`, signal),
  live: (signal) => getOrThrow("/live", signal),
  sessions: (range, cursor, signal) =>
    getOrThrow(
      `/sessions?range=${range}&limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`,
      signal,
    ),
  session: (id, signal) => getOrThrow(`/session/${encodeURIComponent(id)}`, signal),
  audit: (signal) => getOrThrow("/audit", signal),
  exportUrl: (range, format) => `${BASE}/export?range=${range}&format=${format}`,
};
