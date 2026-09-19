"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSecretSequence } from "@/hooks/useSecretSequence";
import { api } from "@/components/hacker/api";

const STAGE_KEY = "hm_stage";
const UI_COOKIE = "hm_ui";
const ACTIVE_STAGES = new Set(["on", "hidden"]);

// Nothing below is downloaded until a visitor actually triggers the mode.
const HackerMode = dynamic(
  () => import("@/components/hacker/HackerMode").then((m) => m.HackerMode),
  { ssr: false },
);

const HackerModeContext = createContext(null);

const hasUiCookie = () =>
  typeof document !== "undefined" && new RegExp(`(^|; )${UI_COOKIE}=1`).test(document.cookie);

const readStage = () => {
  try {
    const stage = sessionStorage.getItem(STAGE_KEY);
    return ACTIVE_STAGES.has(stage) ? stage : null;
  } catch {
    return null;
  }
};

/**
 * Stage machine for the hidden analytics dashboard:
 * off → prompt → boot → on ⇄ hidden → closing → off
 */
export const HackerModeProvider = ({ children }) => {
  const [stage, setStage] = useState("off");
  const [label, setLabel] = useState(null);
  const [resumable, setResumable] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  // Restore an active session after a reload, or offer to resume one.
  useEffect(() => {
    const authed = hasUiCookie();
    const stored = readStage();
    /* eslint-disable react-hooks/set-state-in-effect -- one-off sync with cookie + sessionStorage */
    if (authed && stored) {
      setStage(stored);
      setEverOpened(true);
    } else {
      setResumable(authed);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // The label lives in the httpOnly cookie; ask the server for it when needed.
  useEffect(() => {
    if (stage === "off" || label) return undefined;
    const controller = new AbortController();
    api
      .me(controller.signal)
      .then(({ ok, data }) => ok && data?.label && setLabel(data.label))
      .catch(() => {});
    return () => controller.abort();
  }, [stage, label]);

  useEffect(() => {
    const root = document.documentElement;
    if (ACTIVE_STAGES.has(stage)) root.dataset.mode = "hacker";
    else delete root.dataset.mode;
    try {
      if (ACTIVE_STAGES.has(stage)) sessionStorage.setItem(STAGE_KEY, stage);
      else sessionStorage.removeItem(STAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [stage]);

  const open = useCallback(() => {
    setResumable(false);
    setEverOpened(true);
    setStage((current) => {
      if (current === "off") return hasUiCookie() ? "boot" : "prompt";
      if (current === "hidden") return "on";
      return current;
    });
  }, []);

  /** Leaves the mode; offers the resume pill while the auth cookie is still valid. */
  const close = useCallback(() => {
    setResumable(hasUiCookie());
    setStage("off");
  }, []);

  useSecretSequence("hacker", open, stage === "off" || stage === "hidden");

  const value = useMemo(
    () => ({ stage, label, resumable, open, close, setStage, setLabel }),
     
    [stage, label, resumable, open, close],
  );

  return (
    <HackerModeContext.Provider value={value}>
      {children}
      {everOpened && <HackerMode />}
      {stage === "off" && resumable && (
        <button
          type="button"
          onClick={open}
          className="fixed bottom-6 left-5 z-[100] rounded-full border border-primary/60 bg-container px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.2em] text-primary shadow-soft transition-transform hover:scale-105 sm:bottom-8 sm:left-8"
        >
          HM ▸
        </button>
      )}
    </HackerModeContext.Provider>
  );
};

const fallback = {
  stage: "off",
  label: null,
  resumable: false,
  open: () => {},
  close: () => {},
  setStage: () => {},
  setLabel: () => {},
};

export const useHackerMode = () => useContext(HackerModeContext) ?? fallback;
