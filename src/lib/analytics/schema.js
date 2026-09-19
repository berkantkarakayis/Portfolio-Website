import { z } from "zod";

const str = (max) => z.string().max(max);
const count = z.number().int().min(0).max(1e9);
const ms = z.number().min(0).max(1e13);
const key = z.string().regex(/^[a-z0-9_.:/@ -]{1,80}$/i);

const record = (value, max = 60) =>
  z.record(key, value).refine((o) => Object.keys(o).length <= max, {
    message: `too many keys (max ${max})`,
  });

const id = z.string().regex(/^[a-f0-9-]{8,40}$/i);

export const heartbeatSchema = z.object({
  v: z.literal(1),
  sid: id,
  hb: z.literal(true),
});

const contextSchema = z
  .object({
    url: str(600),
    path: str(200),
    hash: str(80),
    loc: str(8),
    ref: str(600).nullable(),
    refHost: str(120).nullable(),
    utm: record(str(120), 8).nullable(),
    scr: z.tuple([count, count]),
    vp: z.tuple([count, count]),
    dpr: z.number().min(0).max(10),
    lang: str(20),
    langs: z.array(str(20)).max(10),
    tz: str(60),
    dev: z.enum(["desktop", "mobile", "tablet"]),
    os: str(40),
    br: str(40),
    brv: str(20),
    conn: str(20).nullable(),
    rm: z.boolean(),
    theme: str(20),
    cs: str(10),
    touch: z.boolean(),
    wd: z.boolean(),
  })
  .partial();

const engagementSchema = z
  .object({
    act: ms,
    idle: ms,
    hid: count,
    sd: z.number().min(0).max(100),
    sec: record(ms, 30),
    clicks: record(count, 60),
    out: record(count, 60),
    rage: count,
    errs: z.array(z.object({ h: str(16), m: str(200), n: count })).max(10),
    vit: record(z.number(), 8),
  })
  .partial();

export const sessionSchema = z.object({
  v: z.literal(1),
  sid: id,
  vid: id,
  seq: count,
  ret: z.boolean(),
  n: count,
  t0: ms,
  t1: ms,
  pv: count,
  ctx: contextSchema,
  eng: engagementSchema,
  ev: z.array(z.tuple([ms, str(32), z.unknown()])).max(150),
});
