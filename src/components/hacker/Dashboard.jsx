"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { api } from "./api";
import { CommandBar, COMMANDS } from "./CommandBar";
import { AreaLine } from "./charts/AreaLine";
import { Bars } from "./charts/Bars";
import { Kpis } from "./panels/Kpis";
import { Panel, Empty } from "./panels/Panel";
import { RankList } from "./panels/RankList";
import { Sections } from "./panels/Sections";
import { Vitals } from "./panels/Vitals";
import { Errors } from "./panels/Errors";
import { Live } from "./panels/Live";
import { Sessions } from "./panels/Sessions";
import { SessionDrawer } from "./panels/SessionDrawer";
import { flag, fmtDay, fmtDateTime } from "./format";
import { trackLabel } from "@/lib/analytics/track-ids";
import { setSoundEnabled } from "./sound";

const RANGES = ["7d", "30d", "90d"];
const STATS_REFRESH_MS = 60_000;

const Button = ({ active = false, children, ...rest }) => (
  <button
    type="button"
    className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
      active
        ? "border-primary bg-primary text-[#020a04]"
        : "border-primary/40 text-[#b6ffb6] hover:border-primary hover:text-primary"
    }`}
    {...rest}
  >
    {children}
  </button>
);

const Skeleton = () => (
  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="hm-panel h-24 animate-pulse" />
    ))}
  </div>
);

export const Dashboard = ({ label, onHide, onExit, onLogout }) => {
  const [range, setRange] = useState("30d");
  const [auto, setAuto] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const commandRef = useRef(null);
  const controller = useRef(null);

  const load = useCallback(
    async (fresh = false) => {
      controller.current?.abort();
      const ac = new AbortController();
      controller.current = ac;
      setLoading(true);
      try {
        const data = await api.stats(range, { fresh, signal: ac.signal });
        setStats(data);
        setError(null);
      } catch (e) {
        if (e.name === "AbortError") return;
        if (e.status === 401) {
          onLogout();
          return;
        }
        setError(e.message);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    },
    [range, onLogout],
  );

  useEffect(() => {
    load();
    return () => controller.current?.abort();
  }, [load, refreshKey]);

  useEffect(() => {
    if (!auto) return undefined;
    const timer = setInterval(() => load(), STATS_REFRESH_MS);
    return () => clearInterval(timer);
  }, [auto, load]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea")) return;
      e.preventDefault();
      commandRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const refresh = () => {
    setRefreshKey((k) => k + 1);
    load(true);
  };

  const run = (raw) => {
    const [cmd, arg] = raw.toLowerCase().split(/\s+/);
    setShowHelp(false);
    switch (cmd) {
      case "range":
        if (RANGES.includes(arg)) setRange(arg);
        else setMessage("usage: range 7d|30d|90d");
        return;
      case "refresh":
        refresh();
        setMessage("refreshed");
        return;
      case "export":
        window.open(api.exportUrl(range, arg === "csv" ? "csv" : "json"), "_blank", "noopener");
        return;
      case "auto":
        setAuto(arg !== "off");
        setMessage(`auto refresh ${arg !== "off" ? "on" : "off"}`);
        return;
      case "live":
      case "sessions":
        document.getElementById(`hm-${cmd}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      case "exclude":
        try {
          localStorage.setItem("a_optout", "1");
          setMessage("this device is now excluded from analytics");
        } catch {
          setMessage("storage unavailable");
        }
        return;
      case "hide":
        onHide();
        return;
      case "exit":
        onExit();
        return;
      case "logout":
        onLogout();
        return;
      case "sound":
        setSoundEnabled(arg !== "off");
        setMessage(`sound ${arg !== "off" ? "on" : "off"}`);
        return;
      case "help":
        setShowHelp(true);
        return;
      default:
        setMessage(`unknown command: ${cmd} (try help)`);
    }
  };

  const total = stats?.kpi.sessions ?? 0;

  return (
    <m.div
      key="hm-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="hm-root fixed inset-0 z-[400] overflow-y-auto bg-[#020a04] pb-24 text-[#7dff7d]"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        <header className="mb-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary sm:text-sm">Hacker mode // analytics</h2>
              <p className="mt-1 truncate text-[11px] text-[color:var(--muted-color)] sm:text-xs">
                operator {label ?? "…"} · {stats ? `generated ${fmtDateTime(stats.generatedAt)}${stats.cached ? " (cached)" : ""}` : "loading…"}
              </p>
            </div>
            <Button onClick={onHide} title="Esc">hide</Button>
          </div>
          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex shrink-0 rounded-full border border-primary/40 p-0.5" role="radiogroup" aria-label="Range">
              {RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={range === r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-3 py-0.5 text-xs transition-colors ${range === r ? "bg-primary text-[#020a04]" : "text-[#b6ffb6] hover:text-primary"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <Button active={auto} onClick={() => setAuto((v) => !v)} title="auto refresh">auto</Button>
            <Button onClick={refresh}>{loading ? "…" : "refresh"}</Button>
            <Button onClick={() => run("export json")}>json</Button>
            <Button onClick={() => run("export csv")}>csv</Button>
          </div>
        </header>

        <CommandBar ref={commandRef} onRun={run} message={message} />

        {showHelp && (
          <div className="hm-panel mt-3 grid gap-1 p-4 text-xs sm:grid-cols-2">
            {COMMANDS.map(([cmd, desc]) => (
              <p key={cmd}>
                <span className="text-primary">{cmd}</span>
                <span className="text-[color:var(--muted-color)]"> — {desc}</span>
              </p>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-[#ff5f56]/40 bg-[#ff5f56]/10 px-4 py-2 text-xs text-[#ffb3ae]">
            &gt; {error}
          </p>
        )}

        <m.div
          className="mt-4 space-y-3 sm:mt-5 sm:space-y-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
        >
          {!stats ? (
            <Skeleton />
          ) : (
            <>
              <m.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                <Kpis stats={stats} />
              </m.div>

              <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
                <Panel title="Sessions per day" sub={`last ${range}`} className="lg:col-span-2">
                  <AreaLine data={stats.byDay.map((d) => ({ label: fmtDay(d.day), value: d.sessions }))} />
                </Panel>
                <Panel title="By local hour" sub="visitor's own timezone">
                  <Bars data={stats.byHour.map((v, h) => ({ label: `${h}h`, value: v }))} labelEvery={6} />
                </Panel>
              </div>

              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                <Sections sections={stats.sections} sessions={total} />
                <Panel title="Scroll depth" sub="sessions per 10% bucket">
                  <Bars
                    data={stats.scrollHist.map((v, i) => ({ label: `${i * 10}%`, value: v }))}
                    labelEvery={2}
                  />
                </Panel>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                <RankList title="Countries" items={stats.countries} total={total} render={(k) => `${flag(k)} ${k}`} />
                <RankList title="Cities" items={stats.cities} total={total} />
                <RankList title="Referrers" items={stats.referrers} total={total} />
                <RankList
                  title="UTM sources"
                  items={stats.utm.source}
                  total={total}
                  sub={stats.utm.campaign.length ? `campaigns: ${stats.utm.campaign.map((c) => c.k).join(", ")}` : undefined}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                <RankList title="Devices" items={stats.devices} total={total} />
                <RankList title="Operating systems" items={stats.os} total={total} />
                <RankList title="Browsers" items={stats.browsers} total={total} />
                <RankList title="Screen widths" items={stats.screens} total={total} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                <RankList title="Language" items={stats.locales} total={total} render={(k) => k.toUpperCase()} />
                <RankList title="Theme" items={stats.themes} total={total} />
                <RankList title="Clicks" sub="tracked controls" items={stats.clicks} render={(k) => trackLabel(k)} max={12} />
                <RankList title="Outbound links" items={stats.outbound} max={12} />
              </div>

              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                <RankList
                  title="Networks / ISPs"
                  sub={stats.flagged ? `${stats.flagged} session(s) via VPN, proxy or hosting` : "resolved from the visitor IP"}
                  items={stats.networks ?? []}
                  total={total}
                />
                <RankList title="GPUs" sub="WebGL renderer string" items={stats.gpus ?? []} total={total} />
              </div>

              <Vitals vitals={stats.vitals} />

              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                <Errors errors={stats.errors} />
                <Live auto={auto} onSelect={setSelected} />
              </div>

              <Sessions range={range} refreshKey={refreshKey} onSelect={setSelected} />

              {total === 0 && (
                <Panel title="Nothing yet">
                  <Empty>no sessions in this range — share the link and come back</Empty>
                </Panel>
              )}
            </>
          )}
        </m.div>
      </div>

      <AnimatePresence>
        {selected && <SessionDrawer sid={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </m.div>
  );
};
