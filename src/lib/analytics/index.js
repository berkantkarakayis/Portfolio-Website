import { getIdentity } from "./ids";
import { batterySnapshot, buildContext, navigationTiming } from "./context";
import { startEngagement } from "./engagement";
import { startEvents } from "./events";
import { startErrors } from "./errors";
import { startVitals } from "./vitals";
import { startTransport } from "./transport";

let running = null;

const hasCookie = (name) => new RegExp(`(^|; )${name}=`).test(document.cookie);

/** Whether this browser should be measured at all. */
export const shouldTrack = () => {
  const enabled =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "1";
  if (!enabled) return false;
  if (navigator.globalPrivacyControl === true) return false;
  if (navigator.webdriver === true) return false;
  if (hasCookie("hm_ui")) return false; // owner / hacker-mode viewers
  try {
    if (localStorage.getItem("a_optout") === "1") return false;
  } catch {
    /* storage unavailable */
  }
  return true;
};

/** Starts the collector once per page; returns a stop function. */
export const startAnalytics = () => {
  if (running) return running.stop;

  const identity = getIdentity();
  const t0 = Date.now();
  const state = {
    v: 1,
    sid: identity.sid,
    vid: identity.vid,
    seq: 0,
    ret: identity.ret,
    n: identity.n,
    t0,
    t1: t0,
    pv: identity.pv,
    ctx: buildContext(),
    eng: { act: 0, idle: 0, hid: 0, sd: 0, sec: {}, clicks: {}, out: {}, rage: 0, errs: [], vit: {} },
    ev: [],
  };

  const transport = startTransport(state);
  const { markDirty } = transport;
  const events = startEvents(state, { markDirty });
  const stopEngagement = startEngagement(state, { track: events.track, markDirty });
  const stopErrors = startErrors(state, { track: events.track, markDirty });
  startVitals(state, { markDirty });

  // Async enrichments land before the first snapshot goes out.
  batterySnapshot().then((bat) => {
    if (bat) {
      state.ctx.bat = bat;
      markDirty();
    }
  });
  window.addEventListener(
    "load",
    () => {
      state.ctx.nav = navigationTiming();
      markDirty();
    },
    { once: true },
  );

  // First snapshot goes out quickly so short visits are still recorded.
  const firstFlush = setTimeout(transport.flush, 3_000);

  const stop = () => {
    clearTimeout(firstFlush);
    transport.flush();
    stopEngagement();
    stopErrors();
    events.stop();
    transport.stop();
    running = null;
  };

  running = { stop };
  return stop;
};
