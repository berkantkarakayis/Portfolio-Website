const MAX_EVENTS = 150;
const RAGE_WINDOW_MS = 600;
const RAGE_RADIUS_PX = 30;

export const TRACK_EVENT = "analytics:track";

/**
 * Event ring buffer + one delegated click listener for `[data-track]`
 * elements and outbound links. Components never import the collector; they
 * either set data attributes or dispatch a TRACK_EVENT (see emit.js).
 */
export const startEvents = (state, { markDirty }) => {
  const { eng } = state;
  const recent = [];

  const track = (type, data = null) => {
    if (state.ev.length >= MAX_EVENTS) state.ev.shift();
    state.ev.push([Date.now() - state.t0, type, data]);
    markDirty();
  };

  const onClick = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const tracked = target.closest("[data-track]");
    if (tracked) {
      const id = tracked.dataset.track;
      const value = tracked.dataset.trackValue;
      eng.clicks[id] = (eng.clicks[id] ?? 0) + 1;
      track("click", value ? { id, v: value } : { id });
    }

    const anchor = target.closest("a[href]");
    if (anchor) {
      try {
        const url = new URL(anchor.href, window.location.href);
        if (/^https?:$/.test(url.protocol) && url.hostname !== window.location.hostname) {
          eng.out[url.hostname] = (eng.out[url.hostname] ?? 0) + 1;
          track("out", { h: url.hostname });
        }
      } catch {
        /* invalid href */
      }
    }

    // Rage clicks: three fast clicks in the same spot.
    const now = Date.now();
    recent.push({ t: now, x: event.clientX, y: event.clientY });
    while (recent.length && now - recent[0].t > RAGE_WINDOW_MS) recent.shift();
    if (recent.length >= 3) {
      const [a] = recent;
      const close = recent.every(
        (p) => Math.hypot(p.x - a.x, p.y - a.y) <= RAGE_RADIUS_PX,
      );
      if (close) {
        eng.rage += 1;
        track("rage", null);
        recent.length = 0;
      }
    }
  };

  const onCustom = (event) => {
    const { type, data } = event.detail ?? {};
    if (typeof type === "string") track(type.slice(0, 32), data ?? null);
  };

  document.addEventListener("click", onClick, { capture: true, passive: true });
  window.addEventListener(TRACK_EVENT, onCustom);

  return {
    track,
    stop: () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener(TRACK_EVENT, onCustom);
    },
  };
};
