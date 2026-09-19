/** Fire-and-forget custom event; a no-op when the collector is not running. */
export const emitTrack = (type, data) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("analytics:track", { detail: { type, data } }));
};
