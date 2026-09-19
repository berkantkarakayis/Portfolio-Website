"use client";

import React, { useEffect, useState } from "react";
import { api } from "./api";
import { setSoundEnabled, soundEnabled } from "./sound";

const Key = ({ children }) => (
  <kbd className="rounded border border-current/40 px-1 py-px text-[10px] leading-none">{children}</kbd>
);

/** Persistent terminal-style bar while Hacker Mode is active. */
export const StatusBar = ({ label, hidden, onShow, onHide, onExit, onLogout }) => {
  const [live, setLive] = useState(null);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage after hydration
    setSound(soundEnabled());
    const controller = new AbortController();
    const load = () => api.live(controller.signal).then((d) => setLive(d.items.length)).catch(() => {});
    load();
    const timer = setInterval(load, 30_000);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, []);

  const toggleSound = () => {
    setSoundEnabled(!sound);
    setSound(!sound);
  };

  return (
    <div className="hm-root fixed inset-x-0 bottom-0 z-[420] flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-primary/40 bg-[#020a04]/95 px-3 py-2 font-mono text-[10px] text-[#7dff7d] backdrop-blur sm:gap-x-4 sm:px-4 sm:text-xs">
      <span className="inline-flex items-center gap-2 font-bold tracking-[0.2em]">
        <span className="hm-pulse inline-block h-2 w-2 rounded-full bg-primary" />
        HACKER MODE
      </span>
      <span className="opacity-70">{label ?? "…"}</span>
      <span className="opacity-70">live {live ?? "…"}</span>
      <span className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3">
        <button type="button" onClick={toggleSound} className="hover:underline" aria-pressed={sound}>
          {sound ? "sound on" : "sound off"}
        </button>
        {hidden ? (
          <button type="button" onClick={onShow} className="hover:underline">
            <Key>h</Key> show
          </button>
        ) : (
          <button type="button" onClick={onHide} className="hover:underline">
            <Key>Esc</Key> hide
          </button>
        )}
        <button type="button" onClick={onExit} className="hover:underline">
          exit
        </button>
        <button type="button" onClick={onLogout} className="text-[#ff9f9f] hover:underline">
          logout
        </button>
      </span>
    </div>
  );
};
