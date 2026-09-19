/**
 * Synthesised sound effects for Hacker Mode (Web Audio, no asset files).
 * Every call is a no-op when sound is muted, unsupported, or the context is
 * still locked (no user gesture yet). Preference persists in localStorage.
 */
const KEY = "hm_sound";
let ctx = null;
let noise = null;

export const soundEnabled = () => {
  try {
    return localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
};

export const setSoundEnabled = (value) => {
  try {
    localStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
};

const getContext = () => {
  if (typeof window === "undefined" || !soundEnabled()) return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx.state === "running" || ctx.state === "suspended" ? ctx : null;
};

const envelope = (gain, t, attack, decay, peak) => {
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(peak, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
};

const noiseBuffer = (c) => {
  if (noise) return noise;
  noise = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return noise;
};

const tone = (c, { type = "sine", from, to = from, at, attack = 0.01, decay = 0.3, peak = 0.2, filter }) => {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + attack + decay);
  let node = osc;
  if (filter) {
    const f = c.createBiquadFilter();
    f.type = filter.type;
    f.frequency.setValueAtTime(filter.from, at);
    if (filter.to) f.frequency.exponentialRampToValueAtTime(filter.to, at + attack + decay);
    node = osc.connect(f);
  }
  node.connect(gain).connect(c.destination);
  envelope(gain, at, attack, decay, peak);
  osc.start(at);
  osc.stop(at + attack + decay + 0.05);
};

export const sfx = {
  /** CRT power-on: rising filtered saw with a relay click. */
  powerOn() {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    tone(c, { type: "square", from: 1800, at: t, attack: 0.001, decay: 0.05, peak: 0.08 });
    tone(c, {
      type: "sawtooth",
      from: 38,
      to: 210,
      at: t + 0.03,
      attack: 0.06,
      decay: 1.0,
      peak: 0.16,
      filter: { type: "lowpass", from: 180, to: 2600 },
    });
    tone(c, { type: "sine", from: 55, to: 110, at: t + 0.03, attack: 0.1, decay: 1.1, peak: 0.12 });
  },
  /** Typewriter tick: short band-passed noise burst. */
  tick() {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 2200 + Math.random() * 1600;
    f.Q.value = 5;
    const gain = c.createGain();
    src.connect(f).connect(gain).connect(c.destination);
    envelope(gain, t, 0.001, 0.03, 0.07);
    src.start(t);
    src.stop(t + 0.05);
  },
  /** Access granted: quick ascending arpeggio. */
  chime() {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      tone(c, { type: "triangle", from: freq, at: t + i * 0.09, attack: 0.01, decay: 0.45, peak: 0.12 });
    });
  },
  /** Access denied: low descending buzz. */
  deny() {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    tone(c, { type: "square", from: 140, to: 60, at: t, attack: 0.01, decay: 0.28, peak: 0.1 });
  },
  /** Power off: falling sine. */
  powerOff() {
    const c = getContext();
    if (!c) return;
    const t = c.currentTime;
    tone(c, { type: "sine", from: 320, to: 40, at: t, attack: 0.01, decay: 0.4, peak: 0.12 });
  },
};
