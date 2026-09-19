"use client";

import React, { forwardRef, useState } from "react";

export const COMMANDS = [
  ["range 7d|30d|90d", "change the time range"],
  ["refresh", "bypass the 60s cache"],
  ["export json|csv", "download every session in range"],
  ["auto on|off", "toggle auto refresh"],
  ["live / sessions", "jump to a panel"],
  ["sound on|off", "boot and UI sounds"],
  ["exclude", "stop tracking this device"],
  ["hide / exit / logout", "leave the dashboard"],
  ["help", "this list"],
];

export const CommandBar = forwardRef(function CommandBar({ onRun, message }, ref) {
  const [value, setValue] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onRun(value.trim());
    setValue("");
  };
  return (
    <form onSubmit={submit} className="hm-panel flex items-center gap-2 px-4 py-2 text-xs">
      <span className="text-primary">&gt;</span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="type a command · press / to focus · help"
        spellCheck={false}
        autoComplete="off"
        className="hm-input flex-1 bg-transparent !tracking-normal outline-none placeholder:text-[color:var(--muted-color)]"
      />
      {message && <span className="truncate text-[color:var(--muted-color)]">{message}</span>}
    </form>
  );
});
