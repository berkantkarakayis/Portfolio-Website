export const TEAMS = { home: "BRK", away: "PXP" };

const BEAT_MS = [1200, 2200];
const MATCH_MINUTES = 90;
const BUFFER = 600;

const EVENT_WEIGHTS = [
  ["possession", 42],
  ["shot", 15],
  ["corner", 12],
  ["foul", 9],
  ["yellow", 6],
  ["goal", 8],
  ["var", 4],
  ["sub", 4],
];

const pickWeighted = (weights) => {
  const total = weights.reduce((a, [, w]) => a + w, 0);
  let roll = Math.random() * total;
  for (const [type, w] of weights) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return weights[0][0];
};

const randomBetween = (min, max) => min + Math.random() * (max - min);

/**
 * "Server side" of the demo: produces numbered match events on a schedule and
 * keeps a replay buffer so a client can resume from any sequence number.
 */
export const createSimulator = ({ onEvent }) => {
  let seq = 0;
  let minute = 0;
  let half = 1;
  let score = { home: 0, away: 0 };
  let timer = null;
  let running = false;
  const buffer = [];

  const ballFor = (type, team) => {
    const attackingRight = team === "home";
    const x = type === "goal" || type === "shot"
      ? attackingRight ? randomBetween(78, 94) : randomBetween(6, 22)
      : type === "corner"
        ? attackingRight ? 96 : 4
        : randomBetween(25, 75);
    const y = type === "corner" ? (Math.random() < 0.5 ? 4 : 96) : randomBetween(18, 82);
    return { x: Math.round(x), y: Math.round(y) };
  };

  const emit = (type, data = {}) => {
    seq += 1;
    const event = { seq, type, minute, ts: Date.now(), ...data };
    buffer.push(event);
    if (buffer.length > BUFFER) buffer.shift();
    onEvent(event);
    return event;
  };

  const beat = () => {
    if (!running) return;
    minute += 1;
    if (minute === 45 && half === 1) {
      half = 2;
      emit("halftime", { score: { ...score } });
    } else if (minute >= MATCH_MINUTES) {
      emit("fulltime", { score: { ...score } });
      minute = 0;
      half = 1;
      score = { home: 0, away: 0 };
      timer = setTimeout(() => {
        emit("kickoff", { score: { ...score } });
        timer = setTimeout(beat, randomBetween(...BEAT_MS));
      }, 2500);
      return;
    } else {
      const type = pickWeighted(EVENT_WEIGHTS);
      const team = Math.random() < 0.5 ? "home" : "away";
      if (type === "goal") score = { ...score, [team]: score[team] + 1 };
      emit(type, { team, score: { ...score }, ball: ballFor(type, team) });
    }
    timer = setTimeout(beat, randomBetween(...BEAT_MS));
  };

  return {
    start() {
      if (running) return;
      running = true;
      if (seq === 0) emit("kickoff", { score: { ...score }, ball: { x: 50, y: 50 } });
      timer = setTimeout(beat, randomBetween(...BEAT_MS));
    },
    stop() {
      running = false;
      clearTimeout(timer);
    },
    eventsSince(lastSeq) {
      return buffer.filter((e) => e.seq > lastSeq);
    },
    get state() {
      return { seq, minute, score };
    },
  };
};
