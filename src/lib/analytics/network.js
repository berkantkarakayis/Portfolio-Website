import { isPublicIp } from "./server-utils";

const CACHE_TTL_SEC = 7 * 86400;
const TIMEOUT_MS = 2500;

const fetchJson = async (url, headers = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const fromIpinfo = async (ip, token) => {
  const d = await fetchJson(`https://ipinfo.io/${ip}/json?token=${token}`);
  if (!d || d.bogon) return null;
  const [lat, lon] = (d.loc ?? "").split(",").map(Number);
  const [asn, ...orgParts] = (d.org ?? "").split(" ");
  return {
    src: "ipinfo",
    org: orgParts.join(" ") || d.org || null,
    asn: asn?.startsWith("AS") ? asn : null,
    hostname: d.hostname ?? null,
    city: d.city ?? null,
    reg: d.region ?? null,
    co: d.country ?? null,
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    tz: d.timezone ?? null,
    postal: d.postal ?? null,
    vpn: d.privacy?.vpn ?? null,
    proxy: d.privacy?.proxy ?? null,
    hosting: d.privacy?.hosting ?? null,
  };
};

// Keyless fallback (non-commercial use, 45 req/min, http only). Results are cached for a week.
const fromIpApi = async (ip) => {
  const fields = "status,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting";
  const d = await fetchJson(`http://ip-api.com/json/${ip}?fields=${fields}`);
  if (!d || d.status !== "success") return null;
  return {
    src: "ip-api",
    org: d.org || d.isp || null,
    isp: d.isp ?? null,
    asn: d.as ? d.as.split(" ")[0] : null,
    hostname: null,
    city: d.city ?? null,
    reg: d.regionName ?? null,
    co: d.countryCode ?? null,
    lat: d.lat ?? null,
    lon: d.lon ?? null,
    tz: d.timezone ?? null,
    postal: d.zip ?? null,
    mobile: d.mobile ?? null,
    proxy: d.proxy ?? null,
    hosting: d.hosting ?? null,
  };
};

/**
 * ISP / organisation / ASN lookup for a public IP, cached per hashed IP so
 * each visitor address is resolved at most once a week.
 */
export const lookupNetwork = async (store, ip, ipHash) => {
  if (!isPublicIp(ip)) return null;
  const cacheKey = `net:${ipHash}`;
  const cached = await store.getCache(cacheKey).catch(() => null);
  if (cached) return cached;
  const token = process.env.IPINFO_TOKEN;
  const result = token ? await fromIpinfo(ip, token) : await fromIpApi(ip);
  if (result) await store.setCache(cacheKey, result, CACHE_TTL_SEC).catch(() => {});
  return result;
};
