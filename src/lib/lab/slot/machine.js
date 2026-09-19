import { createTween, createTweens, ease } from "@/lib/engine/tween";
import { roundRect } from "@/lib/engine/canvas";

export const SYMBOLS = [
  { glyph: "7", pay: 50, color: "#ff5f56" },
  { glyph: "★", pay: 20, color: "#f5b942" },
  { glyph: "◆", pay: 12, color: "#4cc9f0" },
  { glyph: "♠", pay: 8, color: "#b6ffb6" },
  { glyph: "♥", pay: 6, color: "#f472b6" },
  { glyph: "●", pay: 4, color: "#a78bfa" },
];

export const REELS = 3;
const ROWS = 3;
const STRIP = 24; // symbols per reel strip
const SPIN_TURNS = [3, 4, 5];
const SPIN_MS = [1100, 1400, 1750];

const mod = (n, m) => ((n % m) + m) % m;

/** Payout for the centre line: three of a kind pays the symbol, two 7s pay 2×. */
export const evaluate = (symbols, bet) => {
  const [a, b, c] = symbols;
  if (a === b && b === c) return { win: bet * SYMBOLS[a].pay, kind: "three" };
  const sevens = symbols.filter((s) => s === 0).length;
  if (sevens >= 2) return { win: bet * 2, kind: "sevens" };
  return { win: 0, kind: null };
};

/**
 * Renderer + animation state for the three reels. Pure canvas, no React
 * state inside the hot path; React only reads results via callbacks.
 */
export const createMachine = ({ onStop }) => {
  // Each reel strip is a fixed permutation so results are readable, not random per frame.
  const strips = Array.from({ length: REELS }, (_, r) =>
    Array.from({ length: STRIP }, (_, i) => (i * 7 + r * 3) % SYMBOLS.length),
  );
  const offsets = strips.map(() => 0); // in symbol units; centre row shows round(offset)
  const speeds = strips.map(() => 0);
  const tweens = createTweens();
  let flash = 0;
  let winLine = null;
  let spinning = false;
  let stopped = 0;

  /** Finds a strip index whose symbol matches, at least `minAhead` symbols ahead. */
  const targetFor = (reel, symbol, minAhead) => {
    const start = Math.round(offsets[reel]) + minAhead;
    for (let k = 0; k < STRIP; k += 1) {
      if (strips[reel][mod(start + k, STRIP)] === symbol) return start + k;
    }
    return start;
  };

  const spin = (outcome) => {
    if (spinning) return;
    spinning = true;
    stopped = 0;
    winLine = null;
    outcome.forEach((symbol, r) => {
      const from = offsets[r];
      const to = targetFor(r, symbol, SPIN_TURNS[r] * STRIP);
      tweens.add(
        createTween({
          from,
          to,
          duration: SPIN_MS[r] / 1000,
          easing: ease.outBack,
          onUpdate: (value) => {
            speeds[r] = value - offsets[r];
            offsets[r] = value;
          },
          onComplete: () => {
            offsets[r] = to;
            speeds[r] = 0;
            stopped += 1;
            if (stopped === REELS) {
              spinning = false;
              onStop?.();
            }
          },
        }),
      );
    });
  };

  const celebrate = (kind) => {
    winLine = kind;
    flash = 1;
  };

  const update = (dt) => {
    tweens.update(dt);
    if (flash > 0) flash = Math.max(0, flash - dt * 1.2);
  };

  const render = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    const pad = 14;
    const gap = 10;
    const reelW = (width - pad * 2 - gap * (REELS - 1)) / REELS;
    const cabinetH = height - pad * 2;
    const rowH = cabinetH / ROWS;

    // cabinet
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "rgba(255,255,255,0.05)");
    bg.addColorStop(1, "rgba(0,0,0,0.25)");
    roundRect(ctx, 0, 0, width, height, 18);
    ctx.fillStyle = bg;
    ctx.fill();

    for (let r = 0; r < REELS; r += 1) {
      const x = pad + r * (reelW + gap);
      roundRect(ctx, x, pad, reelW, cabinetH, 12);
      ctx.save();
      ctx.clip();
      const window = ctx.createLinearGradient(0, pad, 0, pad + cabinetH);
      window.addColorStop(0, "rgba(0,0,0,0.55)");
      window.addColorStop(0.5, "rgba(255,255,255,0.06)");
      window.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = window;
      ctx.fillRect(x, pad, reelW, cabinetH);

      const blur = Math.min(1, Math.abs(speeds[r]) * 6);
      const centre = offsets[r];
      const base = Math.floor(centre);
      const frac = centre - base;
      ctx.font = `${Math.round(rowH * 0.58)}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let row = -2; row <= 2; row += 1) {
        const idx = mod(base + row, STRIP);
        const symbol = SYMBOLS[strips[r][idx]];
        const y = pad + cabinetH / 2 + (row - frac) * rowH;
        ctx.globalAlpha = 1 - blur * 0.55;
        ctx.fillStyle = symbol.color;
        ctx.shadowColor = symbol.color;
        ctx.shadowBlur = blur * 14;
        ctx.fillText(symbol.glyph, x + reelW / 2, y);
        if (blur > 0.2) {
          ctx.globalAlpha = blur * 0.25;
          ctx.fillText(symbol.glyph, x + reelW / 2, y - rowH * 0.35 * Math.sign(speeds[r]));
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      roundRect(ctx, x, pad, reelW, cabinetH, 12);
      ctx.stroke();
    }

    // centre pay line
    const lineY = pad + cabinetH / 2;
    ctx.strokeStyle = winLine ? `rgba(255, 215, 90, ${0.6 + flash * 0.4})` : "rgba(255,255,255,0.22)";
    ctx.lineWidth = winLine ? 2 : 1;
    ctx.setLineDash(winLine ? [] : [6, 6]);
    ctx.beginPath();
    ctx.moveTo(pad - 6, lineY);
    ctx.lineTo(width - pad + 6, lineY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (flash > 0) {
      ctx.fillStyle = `rgba(255, 215, 90, ${flash * 0.18})`;
      roundRect(ctx, 0, 0, width, height, 18);
      ctx.fill();
    }
  };

  return {
    spin,
    celebrate,
    update,
    render,
    get spinning() {
      return spinning;
    },
  };
};
