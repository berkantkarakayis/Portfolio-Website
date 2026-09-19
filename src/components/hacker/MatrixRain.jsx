"use client";

import React, { useEffect, useRef } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[]=+*#$%&";
const FONT_SIZE = 16;

/**
 * Canvas "digital rain" that fills its parent. Sweeps in from the left,
 * keeps raining while `running`, then fades out over `fadeMs`.
 */
export const MatrixRain = ({ running = true, fadeMs = 700, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];
    let raf = 0;

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px ui-monospace, Menlo, monospace`;
      const next = Math.ceil(width / FONT_SIZE);
      // Negative offsets stagger columns so the rain sweeps left → right.
      drops = Array.from({ length: next }, (_, i) => drops[i] ?? -i * 0.9 - Math.random() * 6);
      columns = next;
    };
    resize();

    const frame = () => {
      ctx.fillStyle = "rgba(2, 10, 4, 0.16)";
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < columns; i += 1) {
        const y = drops[i] * FONT_SIZE;
        if (y > 0) {
          ctx.fillStyle = Math.random() < 0.06 ? "#e6ffe6" : "hsl(120 100% 50%)";
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * FONT_SIZE, y);
        }
        drops[i] = y > height && Math.random() > 0.96 ? Math.random() * -8 : drops[i] + 0.9;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity ease-out ${running ? "opacity-100" : "opacity-0"} ${className}`}
      style={{ transitionDuration: `${fadeMs}ms` }}
    />
  );
};
