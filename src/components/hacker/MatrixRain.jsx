"use client";

import React, { useEffect, useRef, useState } from "react";

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[]=+*#$%&";

/** Canvas "digital rain" sweep that runs for `duration` ms and fades out. */
export const MatrixRain = ({ duration = 1600, onDone }) => {
  const canvasRef = useRef(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const fontSize = 16;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`;
    };
    resize();

    const columns = Math.ceil(window.innerWidth / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -40);
    const start = performance.now();
    let raf = 0;

    const frame = (now) => {
      ctx.fillStyle = "rgba(2, 10, 4, 0.18)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < columns; i += 1) {
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() < 0.08 ? "#d6ffd6" : "hsl(120 100% 50%)";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * fontSize, y);
        drops[i] = y > window.innerHeight && Math.random() > 0.97 ? 0 : drops[i] + 1;
      }
      if (now - start < duration) raf = requestAnimationFrame(frame);
      else {
        setFading(true);
        setTimeout(() => onDone?.(), 500);
      }
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration, onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[401] transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    />
  );
};
