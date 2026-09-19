import { touchSession } from "./ids";

const ENDPOINT = "/api/collect";
const TICK_MS = 15_000;
const MAX_BYTES = 60_000;

const beacon = (body) => {
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return;
  } catch {
    /* fall through */
  }
  fetch(ENDPOINT, {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
    keepalive: true,
  }).catch(() => {});
};

/** Sends cumulative snapshots; heartbeats when nothing changed. */
export const startTransport = (state) => {
  let dirty = true;

  const markDirty = () => {
    dirty = true;
  };

  const serialize = () => {
    state.t1 = Date.now();
    return JSON.stringify(state);
  };

  const flush = () => {
    touchSession();
    if (!dirty) {
      beacon(JSON.stringify({ v: 1, sid: state.sid, hb: true }));
      return;
    }
    dirty = false;
    state.seq += 1;
    let body = serialize();
    while (body.length > MAX_BYTES && state.ev.length) {
      state.ev.splice(0, 25);
      body = serialize();
    }
    beacon(body);
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") flush();
  };
  const interval = setInterval(() => {
    if (document.visibilityState === "visible") flush();
  }, TICK_MS);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", flush);

  return {
    markDirty,
    flush,
    stop: () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    },
  };
};
