/**
 * Fixed-timestep game loop. `update(dt)` runs at a constant rate (default
 * 60 Hz) while `render(alpha)` runs once per animation frame. Tracks fps and
 * frame cost so demos can show their own performance.
 */
export const createLoop = ({ update, render, step = 1000 / 60, maxFrame = 250 }) => {
  let raf = 0;
  let last = 0;
  let acc = 0;
  let running = false;
  let fps = 0;
  let frameMs = 0;
  let frames = 0;
  let fpsWindow = 0;

  const frame = (now) => {
    if (!running) return;
    const dt = Math.min(maxFrame, now - last);
    last = now;
    acc += dt;
    const started = performance.now();
    while (acc >= step) {
      update(step / 1000);
      acc -= step;
    }
    render(acc / step);
    frameMs = performance.now() - started;
    frames += 1;
    fpsWindow += dt;
    if (fpsWindow >= 500) {
      fps = Math.round((frames * 1000) / fpsWindow);
      frames = 0;
      fpsWindow = 0;
    }
    raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    get running() {
      return running;
    },
    stats: () => ({ fps, frameMs: Math.round(frameMs * 10) / 10 }),
  };
};
