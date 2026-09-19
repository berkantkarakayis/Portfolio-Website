"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";
import { hasProof } from "@/lib/skillProof";

const MAX_PROJECTS = 4;

/**
 * A skill tag that proves itself: hover, focus or tap reveals where the
 * skill was used (projects, roles) and for how long, all derived from Data.
 */
export const SkillChip = ({ label, proof }) => {
  const t = useTranslations("skills.proof");
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const ref = useRef(null);
  const id = useId();
  const proven = hasProof(proof);

  // Close on outside tap (touch devices toggle with a tap).
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const show = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setAlignRight(rect.left + rect.width / 2 > window.innerWidth / 2);
    setOpen(true);
  };

  if (!proven) return <li className="chip">{label}</li>;

  const count = proof.projects.length;
  const extra = count - MAX_PROJECTS;

  return (
    <li ref={ref} className="relative" onMouseEnter={show} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : show())}
        onFocus={show}
        onBlur={(e) => !ref.current?.contains(e.relatedTarget) && setOpen(false)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={t("chipLabel", { skill: label, count, years: proof.years ?? 0 })}
        data-track="skill-proof"
        data-track-value={label}
        className={`chip cursor-pointer ${open ? "!border-primary !bg-[color:var(--primary-soft)]" : ""}`}
      >
        {label}
        {count > 0 && (
          <span className="rounded-full bg-primary/15 px-1.5 text-[10px] font-bold tabular-nums text-primary">{count}</span>
        )}
        {count === 0 && proof.years && (
          <span className="rounded-full bg-primary/15 px-1.5 text-[10px] font-bold tabular-nums text-primary">{proof.years}y</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="pop"
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`palette-surface absolute top-[calc(100%+8px)] z-30 w-64 rounded-2xl p-4 text-left text-xs shadow-card ${alignRight ? "right-0" : "left-0"}`}
          >
            <p className="text-sm font-bold text-title">{label}</p>
            <p className="mt-1 text-[color:var(--muted-color)]">
              {proof.years ? t("since", { years: proof.years, since: proof.since }) : t("recent")}
              {count > 0 && ` · ${t("projects", { count })}`}
            </p>
            {proof.roles.length > 0 && (
              <p className="mt-2 text-text">
                {t("usedAt")} <span className="font-semibold text-title">{[...new Set(proof.roles.map((r) => r.company))].join(", ")}</span>
              </p>
            )}
            {count > 0 && (
              <ul className="mt-2 space-y-1">
                {proof.projects.slice(0, MAX_PROJECTS).map((p) => (
                  <li key={p.id} className="flex items-center gap-2 text-text">
                    <span className="h-1 w-1 flex-none rounded-full bg-primary" aria-hidden="true" />
                    <span className="truncate">{p.title}</span>
                  </li>
                ))}
                {extra > 0 && <li className="text-[color:var(--muted-color)]">{t("more", { count: extra })}</li>}
              </ul>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
};
