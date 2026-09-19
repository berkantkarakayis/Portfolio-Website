const KEYS = { vid: "a_vid", n: "a_n", sid: "a_sid", last: "a_last", pv: "a_pv" };
const SESSION_IDLE_MS = 30 * 60 * 1000;

const uuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  return [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const safe = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

/** Anonymous visitor id (persistent) + session id (per tab, 30 min idle). */
export const getIdentity = () => {
  const now = Date.now();

  const { vid, ret, n } = safe(() => {
    const existing = localStorage.getItem(KEYS.vid);
    const id = existing ?? uuid();
    if (!existing) localStorage.setItem(KEYS.vid, id);
    const visits = (Number(localStorage.getItem(KEYS.n)) || 0) + 1;
    localStorage.setItem(KEYS.n, String(visits));
    return { vid: id, ret: Boolean(existing), n: visits };
  }, { vid: uuid(), ret: false, n: 1 });

  const { sid, pv } = safe(() => {
    const last = Number(sessionStorage.getItem(KEYS.last)) || 0;
    let id = sessionStorage.getItem(KEYS.sid);
    let views = Number(sessionStorage.getItem(KEYS.pv)) || 0;
    if (!id || now - last > SESSION_IDLE_MS) {
      id = uuid();
      views = 0;
      sessionStorage.setItem(KEYS.sid, id);
    }
    views += 1;
    sessionStorage.setItem(KEYS.pv, String(views));
    sessionStorage.setItem(KEYS.last, String(now));
    return { sid: id, pv: views };
  }, { sid: uuid(), pv: 1 });

  return { vid, ret, n, sid, pv };
};

export const touchSession = () => {
  safe(() => sessionStorage.setItem(KEYS.last, String(Date.now())));
};
