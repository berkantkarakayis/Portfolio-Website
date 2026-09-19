const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 8000;
const REPLAY_STAGGER_MS = 70;

/**
 * "Client side" socket stand-in with exponential backoff and
 * resume-from-sequence. The first reconnect attempt always fails and the
 * second succeeds half the time so the backoff curve is visible in the demo.
 */
export const createConnection = ({ simulator, onMessage, onStatus }) => {
  let status = "connected";
  let lastSeq = 0;
  let attempt = 0;
  let autoReconnect = true;
  let timer = null;
  let replayTimers = [];

  const setStatus = (next, extra = {}) => {
    status = next;
    onStatus({ status, attempt, ...extra });
  };

  const clearReplay = () => {
    for (const id of replayTimers) clearTimeout(id);
    replayTimers = [];
  };

  const connect = () => {
    clearTimeout(timer);
    const missed = simulator.eventsSince(lastSeq);
    attempt = 0;
    setStatus("connected", { replayed: missed.length, resumeFrom: lastSeq });
    missed.forEach((event, i) => {
      replayTimers.push(
        setTimeout(() => {
          lastSeq = event.seq;
          onMessage(event, { replay: true, remaining: missed.length - i - 1 });
        }, i * REPLAY_STAGGER_MS),
      );
    });
  };

  const scheduleReconnect = () => {
    attempt += 1;
    const delay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (attempt - 1));
    setStatus("reconnecting", { delay, until: Date.now() + delay });
    timer = setTimeout(() => {
      const succeeds = attempt >= 3 || (attempt === 2 && Math.random() < 0.5);
      if (succeeds) connect();
      else scheduleReconnect();
    }, delay);
  };

  return {
    /** Called by the "server" for every new event. */
    push(event) {
      if (status !== "connected") return;
      lastSeq = event.seq;
      onMessage(event, { replay: false });
    },
    disconnect() {
      if (status === "disconnected") return;
      clearTimeout(timer);
      clearReplay();
      attempt = 0;
      setStatus("disconnected");
      if (autoReconnect) scheduleReconnect();
    },
    reconnectNow() {
      if (status === "connected") return;
      connect();
    },
    setAutoReconnect(value) {
      autoReconnect = value;
      if (value && status === "disconnected") scheduleReconnect();
      if (!value && status === "reconnecting") {
        clearTimeout(timer);
        setStatus("disconnected");
      }
    },
    get lastSeq() {
      return lastSeq;
    },
    destroy() {
      clearTimeout(timer);
      clearReplay();
    },
  };
};
