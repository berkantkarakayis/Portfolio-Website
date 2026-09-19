"use client";

import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { useHackerMode } from "./HackerModeProvider";
import { Prompt } from "./Prompt";
import { BootSequence } from "./BootSequence";
import { Dashboard } from "./Dashboard";
import { StatusBar } from "./StatusBar";
import { api } from "./api";
import { sfx } from "./sound";

const LOCKING_STAGES = new Set(["prompt", "boot", "on"]);

/** Reverse power-on: collapses to a line, then to a dot. */
const PowerOff = ({ onDone }) => (
  <m.div
    key="hm-off"
    className="fixed inset-0 z-[400] bg-[#020a04]"
    initial={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
    animate={{ clipPath: ["inset(0 0 0 0)", "inset(49.5% 0 49.5% 0)", "inset(49.5% 49.5% 49.5% 49.5%)"], opacity: [1, 1, 0] }}
    transition={{ duration: 0.5, times: [0, 0.6, 1], ease: "easeInOut" }}
    onAnimationComplete={onDone}
  />
);

export const HackerMode = () => {
  const { stage, setStage, label, setLabel, close } = useHackerMode();

  useEffect(() => {
    document.body.classList.toggle("no-scroll", LOCKING_STAGES.has(stage));
    return () => document.body.classList.remove("no-scroll");
  }, [stage]);

  const hide = useCallback(() => setStage("hidden"), [setStage]);
  const show = useCallback(() => setStage("on"), [setStage]);
  const exit = useCallback(() => {
    sfx.powerOff();
    setStage("closing");
  }, [setStage]);
  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    sfx.powerOff();
    setLabel(null);
    setStage("closing");
  }, [setLabel, setStage]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        if (stage === "prompt") close();
        else if (stage === "on") hide();
      } else if (event.key === "h" && stage === "hidden" && !event.metaKey && !event.ctrlKey) {
        const target = event.target;
        if (target instanceof Element && target.closest("input, textarea, [contenteditable]")) return;
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, close, hide, show]);

  const active = stage === "on" || stage === "hidden";
  if (stage === "off") return null;

  return createPortal(
    <>
      {active && <div className="hm-scanlines" aria-hidden="true" />}
      <AnimatePresence>
        {stage === "prompt" && (
          <Prompt
            onSuccess={(who) => {
              setLabel(who);
              setStage("boot");
            }}
            onClose={close}
          />
        )}
        {stage === "boot" && <BootSequence label={label} onDone={() => setStage("on")} />}
        {stage === "on" && (
          <Dashboard label={label} onHide={hide} onExit={exit} onLogout={logout} />
        )}
        {stage === "closing" && <PowerOff onDone={close} />}
      </AnimatePresence>
      {active && (
        <StatusBar
          label={label}
          hidden={stage === "hidden"}
          onShow={show}
          onHide={hide}
          onExit={exit}
          onLogout={logout}
        />
      )}
    </>,
    document.body,
  );
};
