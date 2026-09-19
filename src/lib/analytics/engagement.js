const IDLE_MS = 60_000;
const TICK_MS = 1_000;
const ACTIVE_LINE = 0.4; // same rule as useActiveSection: top passes 40% of viewport

/**
 * Accrues active time per section, tracks scroll depth and idle time.
 * Only counts time while the tab is visible and the visitor is not idle.
 */
export const startEngagement = (state, { track, markDirty }) => {
  const { eng } = state;
  let current = null;
  let lastInput = Date.now();
  let lastTick = Date.now();
  let raf = 0;

  const sections = () => document.querySelectorAll("section[id]");

  const computeSection = () => {
    raf = 0;
    const line = window.innerHeight * ACTIVE_LINE;
    let next = null;
    for (const el of sections()) {
      if (el.getBoundingClientRect().top <= line) next = el.id;
    }
    if (next && next !== current) {
      current = next;
      track("sec", { id: next });
    }

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const depth = scrollable > 0
      ? Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100)
      : 100;
    if (depth > eng.sd) {
      eng.sd = Math.min(100, depth);
      markDirty();
    }
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(computeSection);
  };

  const onInput = () => {
    lastInput = Date.now();
  };

  const tick = () => {
    const now = Date.now();
    const dt = Math.min(now - lastTick, TICK_MS * 3);
    lastTick = now;
    if (document.visibilityState !== "visible") return;
    if (now - lastInput > IDLE_MS) {
      eng.idle += dt;
      return;
    }
    eng.act += dt;
    if (current) eng.sec[current] = (eng.sec[current] ?? 0) + dt;
    markDirty();
  };

  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      eng.hid += 1;
      markDirty();
    } else {
      lastTick = Date.now();
      lastInput = Date.now();
    }
  };

  const inputEvents = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"];
  for (const name of inputEvents) window.addEventListener(name, onInput, { passive: true });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  const interval = setInterval(tick, TICK_MS);
  schedule();

  return () => {
    for (const name of inputEvents) window.removeEventListener(name, onInput);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    document.removeEventListener("visibilitychange", onVisibility);
    clearInterval(interval);
    if (raf) cancelAnimationFrame(raf);
  };
};
