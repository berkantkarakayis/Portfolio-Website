import { Redis } from "@upstash/redis";

/**
 * Storage adapter for analytics. Backed by Upstash Redis in production; falls
 * back to an in-process memory store in development when no credentials are
 * configured (or when ANALYTICS_STORE=memory), so the full flow can be tested
 * locally. Returns null in production without credentials.
 *
 * Key layout (all TTLs in seconds):
 *   a:sess:{sid}        JSON      90d   one document per session
 *   a:day:{YYYY-MM-DD}  ZSET      91d   member=sid score=t0
 *   a:live              ZSET            member=sid score=last seen (trimmed on read)
 *   a:bots:{day}        counter   91d
 *   a:rl:*              counters  short rate-limit windows
 *   a:cache:*           JSON      60s   dashboard aggregates
 *   hm:audit            LIST            last 200 hacker-mode logins
 */

export const TTL = {
  session: 90 * 86400,
  day: 91 * 86400,
};

const AUDIT_MAX = 200;

const envAny = (...names) => names.map((n) => process.env[n]).find(Boolean);

const parse = (value) => {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
};

/* ------------------------------------------------------------------ */
/*  Upstash implementation                                             */
/* ------------------------------------------------------------------ */

const createUpstashStore = (redis) => ({
  kind: "upstash",

  async writeSession({ sid, doc, day, now }) {
    const p = redis.pipeline();
    p.set(`a:sess:${sid}`, doc, { ex: TTL.session });
    p.zadd("a:live", { score: now, member: sid });
    // NX keeps the original t0 score; re-adding is idempotent and survives a
    // lost first beacon.
    p.zadd(`a:day:${day}`, { nx: true }, { score: doc.t0, member: sid });
    p.expire(`a:day:${day}`, TTL.day);
    await p.exec();
  },

  async heartbeat(sid, now) {
    await redis.zadd("a:live", { score: now, member: sid });
  },

  async incr(key, ttl) {
    const p = redis.pipeline();
    p.incr(key);
    p.expire(key, ttl);
    const [count] = await p.exec();
    return Number(count);
  },

  /** [{ sid, t0 }] for each day, newest first within a day. */
  async daySessions(days) {
    if (!days.length) return [];
    const p = redis.pipeline();
    for (const day of days) p.zrange(`a:day:${day}`, 0, -1, { withScores: true });
    const results = await p.exec();
    return results.map((flat) => {
      const out = [];
      for (let i = 0; i < flat.length; i += 2) {
        out.push({ sid: String(flat[i]), t0: Number(flat[i + 1]) });
      }
      return out.sort((a, b) => b.t0 - a.t0);
    });
  },

  async getSessions(sids) {
    const out = [];
    for (let i = 0; i < sids.length; i += 100) {
      const chunk = sids.slice(i, i + 100);
      const docs = await redis.mget(...chunk.map((sid) => `a:sess:${sid}`));
      for (const doc of docs) {
        const parsed = parse(doc);
        if (parsed) out.push(parsed);
      }
    }
    return out;
  },

  async getSession(sid) {
    return parse(await redis.get(`a:sess:${sid}`));
  },

  async liveSids(cutoff) {
    const p = redis.pipeline();
    p.zremrangebyscore("a:live", "-inf", cutoff);
    p.zrange("a:live", 0, -1);
    const [, sids] = await p.exec();
    return sids.map(String);
  },

  async getCache(key) {
    return parse(await redis.get(`a:cache:${key}`));
  },

  async setCache(key, value, ttl) {
    await redis.set(`a:cache:${key}`, value, { ex: ttl });
  },

  async get(key) {
    return parse(await redis.get(key));
  },

  async pushAudit(entry) {
    const p = redis.pipeline();
    p.lpush("hm:audit", JSON.stringify(entry));
    p.ltrim("hm:audit", 0, AUDIT_MAX - 1);
    await p.exec();
  },

  async audit() {
    const rows = await redis.lrange("hm:audit", 0, AUDIT_MAX - 1);
    return rows.map(parse).filter(Boolean);
  },
});

/* ------------------------------------------------------------------ */
/*  In-memory implementation (development only)                        */
/* ------------------------------------------------------------------ */

const createMemoryStore = () => {
  const values = new Map(); // key -> { value, exp }
  const zsets = new Map(); // key -> Map(member -> score)
  const audit = [];

  const alive = (entry) => entry && (!entry.exp || entry.exp > Date.now());
  const setValue = (key, value, ttl) =>
    values.set(key, { value, exp: ttl ? Date.now() + ttl * 1000 : 0 });
  const getValue = (key) => {
    const entry = values.get(key);
    if (!alive(entry)) {
      values.delete(key);
      return null;
    }
    return entry.value;
  };
  const zset = (key) => {
    if (!zsets.has(key)) zsets.set(key, new Map());
    return zsets.get(key);
  };

  return {
    kind: "memory",
    async writeSession({ sid, doc, day, now }) {
      setValue(`a:sess:${sid}`, doc, TTL.session);
      zset("a:live").set(sid, now);
      const dayset = zset(`a:day:${day}`);
      if (!dayset.has(sid)) dayset.set(sid, doc.t0);
    },
    async heartbeat(sid, now) {
      zset("a:live").set(sid, now);
    },
    async incr(key, ttl) {
      const next = (Number(getValue(key)) || 0) + 1;
      setValue(key, next, ttl);
      return next;
    },
    async daySessions(days) {
      return days.map((day) =>
        [...zset(`a:day:${day}`).entries()]
          .map(([sid, t0]) => ({ sid, t0 }))
          .sort((a, b) => b.t0 - a.t0),
      );
    },
    async getSessions(sids) {
      return sids.map((sid) => getValue(`a:sess:${sid}`)).filter(Boolean);
    },
    async getSession(sid) {
      return getValue(`a:sess:${sid}`);
    },
    async liveSids(cutoff) {
      const live = zset("a:live");
      for (const [sid, score] of live) if (score < cutoff) live.delete(sid);
      return [...live.keys()];
    },
    async getCache(key) {
      return getValue(`a:cache:${key}`);
    },
    async setCache(key, value, ttl) {
      setValue(`a:cache:${key}`, value, ttl);
    },
    async get(key) {
      return getValue(key);
    },
    async pushAudit(entry) {
      audit.unshift(entry);
      audit.length = Math.min(audit.length, AUDIT_MAX);
    },
    async audit() {
      return [...audit];
    },
  };
};

/* ------------------------------------------------------------------ */

let store;

/** Lazy singleton; never throws at import time so builds pass without env. */
export const getStore = () => {
  if (store !== undefined) return store;

  const url = envAny("UPSTASH_REDIS_REST_URL", "KV_REST_API_URL");
  const token = envAny("UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN");

  if (url && token && process.env.ANALYTICS_STORE !== "memory") {
    store = createUpstashStore(new Redis({ url, token }));
  } else if (process.env.NODE_ENV !== "production" || process.env.ANALYTICS_STORE === "memory") {
    // Module-level singleton survives HMR within one dev server process.
    globalThis.__analyticsMemoryStore ??= createMemoryStore();
    store = globalThis.__analyticsMemoryStore;
  } else {
    store = null;
  }
  return store;
};
