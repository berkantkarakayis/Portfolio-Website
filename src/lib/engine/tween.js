export const ease = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outCubic: (t) => 1 - (1 - t) ** 3,
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  outBack: (t) => {
    const c1 = 1.2;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  },
};

/** Time-based interpolation driven by `update(dt)` from the loop. */
export const createTween = ({ from, to, duration, easing = ease.outCubic, delay = 0, onUpdate, onComplete }) => {
  let elapsed = -delay;
  let done = false;
  return {
    get done() {
      return done;
    },
    update(dt) {
      if (done) return;
      elapsed += dt;
      if (elapsed < 0) return;
      const t = Math.min(1, elapsed / duration);
      onUpdate?.(from + (to - from) * easing(t), t);
      if (t >= 1) {
        done = true;
        onComplete?.();
      }
    },
  };
};

/** Small manager so a scene can hold many tweens without bookkeeping. */
export const createTweens = () => {
  let list = [];
  return {
    add(tween) {
      list.push(tween);
      return tween;
    },
    update(dt) {
      for (const t of list) t.update(dt);
      list = list.filter((t) => !t.done);
    },
    get active() {
      return list.length;
    },
    clear() {
      list = [];
    },
  };
};
