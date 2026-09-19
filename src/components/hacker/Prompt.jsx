"use client";

import React, { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { api } from "./api";

const HINTS = {
  idle: "Esc to cancel",
  checking: "verifying…",
  denied: "ACCESS DENIED",
  locked: "TOO MANY ATTEMPTS — try again in 15 minutes",
  error: "server unavailable",
};

export const Prompt = ({ onSuccess, onClose }) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [remaining, setRemaining] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (status === "checking" || status === "locked" || !code) return;
    setStatus("checking");
    try {
      const { status: httpStatus, data } = await api.login(code);
      if (httpStatus === 200 && data?.ok) {
        onSuccess(data.label);
        return;
      }
      if (httpStatus === 429) {
        setStatus("locked");
        return;
      }
      if (httpStatus === 401) {
        setRemaining(data?.remaining ?? null);
        setStatus("denied");
        setCode("");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const denied = status === "denied" || status === "locked";

  return (
    <m.div
      key="hm-prompt"
      role="dialog"
      aria-modal="true"
      aria-label="Hacker mode access"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="hm-root fixed inset-0 z-[400] grid place-items-center bg-black/85 p-5 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <m.form
        onSubmit={submit}
        initial={{ scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className={`hm-terminal w-full max-w-lg ${denied ? "hm-shake" : ""}`}
      >
        <div className="hm-terminal__bar">
          <span className="hm-terminal__dot" />
          <span className="hm-terminal__dot" />
          <span className="hm-terminal__dot" />
          <span className="ml-3 opacity-70">berkant@portfolio:~ — access</span>
        </div>
        <div className="space-y-2 p-5 text-sm">
          <p className="opacity-70">&gt; hacker mode v1.0</p>
          <p className="opacity-70">&gt; this area is restricted.</p>
          <label className="flex items-center gap-2 pt-2" htmlFor="hm-code">
            <span>&gt; access code:</span>
            <input
              id="hm-code"
              ref={inputRef}
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={code}
              disabled={status === "locked"}
              onChange={(e) => {
                setCode(e.target.value);
                if (status === "denied") setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(e);
              }}
              className="hm-input flex-1 bg-transparent outline-none"
            />
            <span className="hm-cursor" aria-hidden="true" />
            <button
              type="submit"
              disabled={status === "locked" || status === "checking" || !code}
              aria-label="Submit access code"
              className="rounded border border-primary/40 px-2 py-0.5 text-[11px] text-primary transition-colors hover:bg-primary/15 disabled:opacity-40"
            >
              ↵
            </button>
          </label>
          <p
            className={`pt-2 text-xs ${denied ? "hm-glitch text-[#ff5f56]" : "opacity-60"}`}
            role={denied ? "alert" : undefined}
          >
            &gt; {HINTS[status]}
            {status === "denied" && remaining != null && ` (${remaining} attempts left)`}
          </p>
        </div>
      </m.form>
    </m.div>
  );
};
