export const fmtNumber = (n) => Number(n ?? 0).toLocaleString("en-US");

export const fmtDuration = (ms) => {
  const s = Math.round((ms ?? 0) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

export const fmtPct = (n) => `${Math.round((n ?? 0) * 10) / 10}%`;

export const flag = (code) => {
  if (!code || code.length !== 2 || code === "??") return "🏳️";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
};

export const timeAgo = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export const fmtDateTime = (ts) =>
  new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDay = (day) => {
  const [, m, d] = day.split("-");
  return `${d}/${m}`;
};

export const VITALS = {
  LCP: { label: "Largest Contentful Paint", thresholds: [2500, 4000], unit: "ms" },
  INP: { label: "Interaction to Next Paint", thresholds: [200, 500], unit: "ms" },
  CLS: { label: "Cumulative Layout Shift", thresholds: [0.1, 0.25], unit: "" },
  FCP: { label: "First Contentful Paint", thresholds: [1800, 3000], unit: "ms" },
  TTFB: { label: "Time to First Byte", thresholds: [800, 1800], unit: "ms" },
};

export const vitalRating = (name, value) => {
  if (value == null) return "none";
  const [good, poor] = VITALS[name].thresholds;
  return value <= good ? "good" : value <= poor ? "ok" : "poor";
};

export const fmtVital = (name, value) => {
  if (value == null) return "—";
  return name === "CLS" ? value.toFixed(3) : `${Math.round(value)} ms`;
};

export const RATING_COLOR = {
  good: "var(--primary-color)",
  ok: "#f5b942",
  poor: "#ff5f56",
  none: "var(--muted-color)",
};
