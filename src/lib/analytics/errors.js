const MAX_ERRORS = 10;

const hash = (input) => {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
};

export const startErrors = (state, { track, markDirty }) => {
  const record = (message, stack) => {
    const text = String(message ?? "Error").slice(0, 200);
    const frame = String(stack ?? "").split("\n")[1]?.trim() ?? "";
    const h = hash(text + frame);
    const existing = state.eng.errs.find((e) => e.h === h);
    if (existing) existing.n += 1;
    else if (state.eng.errs.length < MAX_ERRORS) state.eng.errs.push({ h, m: text, n: 1 });
    track("err", { h });
    markDirty();
  };

  const onError = (event) => record(event.message, event.error?.stack);
  const onRejection = (event) => {
    const reason = event.reason;
    record(reason?.message ?? String(reason), reason?.stack);
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
};
