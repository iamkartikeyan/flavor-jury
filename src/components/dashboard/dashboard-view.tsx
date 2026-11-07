"use client";

/**
 * Dashboard — the command room.
 * Greeting, weekly illusion score, quick actions, recent verdicts and the
 * 7-day compliance tracker.
 */

import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, History, LineChart as LineChartIcon, Sparkles, Thermometer } from "lucide-react";
import { useJury, weekScore, avgScore } from "@/lib/store";
import { LineChart, CountUp } from "@/components/visuals/charts";
import type { View } from "@/lib/types";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardView() {
  const profile = useJury((s) => s.profile);
  const deliberations = useJury((s) => s.deliberations);
  const dailyStats = useJury((s) => s.dailyStats);
  const setCurrentVerdict = useJury((s) => s.setCurrentVerdict);
  const setView = useJury((s) => s.setView);
  const openSettings = useJury((s) => s.openSettings);

  const recent = deliberations.slice(0, 5);
  const ws = weekScore(deliberations);
  const avg = avgScore(deliberations);
  const totalOverrides = deliberations.reduce((a, d) => a + d.overrides.length, 0);

  const last7 = dailyStats.slice(-7);
  const compliance = last7.length ? Math.round(last7.reduce((a, d) => a + d.compliance, 0) / last7.length) : 0;

  const quickActions: { title: string; body: string; icon: React.ElementType; go: View }[] = [
    { title: "Start New Deliberation", body: "Bring a craving. The Jury will rebuild it — safely.", icon: FlaskConical, go: "deliberation" },
    { title: "View Recent Recipes", body: "Re-open your last verdicts and cook them again.", icon: History, go: "visualizer" },
    { title: "Analyze Your Journey", body: "30 days of illusion scores, compounds and overrides.", icon: LineChartIcon, go: "visualizer" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      {/* greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="caption text-dim">{greeting()},</p>
        <h1 className="text-balance mt-1.5 font-display text-4xl font-medium text-cream md:text-5xl">
          {profile?.name.split(" ")[0] ?? "Friend"}<span className="text-bio">.</span>
        </h1>
      </motion.div>

      {/* weekly score band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
        className="panel mt-8 flex flex-col gap-7 rounded-3xl p-7 md:flex-row md:items-center md:justify-between md:p-8"
      >
        <div>
          <div className="caption text-bio">YOUR SENSORY ILLUSION SCORE THIS WEEK</div>
          <div className="mt-2 flex items-end gap-3">
            <span className="font-display text-6xl font-medium leading-none text-cream md:text-7xl">
              <CountUp to={ws} suffix="%" />
            </span>
            <span className="pb-2 text-[13px] text-bone">
              across {deliberations.length} deliberations<br />
              <span className="text-dim">the brain barely notices the difference</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {[
            { v: deliberations.length, l: "Deliberations" },
            { v: avg, l: "Avg Score", s: "%" },
            { v: compliance, l: "Compliant", s: "%" },
          ].map((m) => (
            <div key={m.l} className="rounded-2xl border border-bio/10 bg-ink-3/80 px-4 py-4 text-center md:px-6">
              <div className="font-display text-2xl text-bio md:text-3xl"><CountUp to={m.v} suffix={m.s ?? ""} /></div>
              <div className="caption mt-1.5 text-[8px] leading-relaxed text-dim">{m.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* quick actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {quickActions.map((a, i) => (
          <motion.button
            key={a.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 + i * 0.07 }}
            whileHover={{ y: -5 }}
            onClick={() => setView(a.go)}
            className="group relative overflow-hidden rounded-3xl border border-bio/10 bg-ink-3 p-6 text-left transition-colors hover:border-bio/35"
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-bio/5 blur-2xl transition-all group-hover:bg-bio/15" />
            <a.icon className="h-6 w-6 text-bio" strokeWidth={1.7} />
            <h3 className="mt-4 font-display text-xl text-cream">{a.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-bone">{a.body}</p>
            <ArrowRight className="mt-4 h-4 w-4 text-dim transition-all group-hover:translate-x-1 group-hover:text-bio" />
          </motion.button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* recent deliberations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}
          className="rounded-3xl border border-bio/10 bg-ink-3 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="caption text-dim">RECENT DELIBERATIONS</h2>
            <button onClick={() => setView("visualizer")} className="caption flex items-center gap-1.5 text-bio hover:underline">
              all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Sparkles className="h-6 w-6 text-dim" />
              <p className="text-[13.5px] text-bone">No verdicts yet — the Jury is waiting for its first case.</p>
              <button onClick={() => setView("deliberation")} className="caption rounded-full bg-bio px-5 py-2.5 text-ink">Start one now</button>
            </div>
          ) : (
            <ul className="divide-y divide-bio/5">
              {recent.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => setCurrentVerdict(d)}
                    className="group flex w-full items-center gap-4 py-3.5 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-bio/15 bg-bio/5 font-display text-[13px] text-bio">
                      {d.score}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] text-cream transition-colors group-hover:text-bio">{d.dish}</span>
                      <span className="caption mt-0.5 block text-[9px] text-dim">
                        #{d.number} · {new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {d.strategyLabel.split(" ")[0]}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 caption text-[9px] text-dim">
                      {d.overrides.length > 0 && (<><Thermometer className="h-3.5 w-3.5 text-amber" /> {d.overrides.length}</>)}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-dim transition-transform group-hover:translate-x-1 group-hover:text-bio" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.section>

        {/* compliance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.38 }}
          className="rounded-3xl border border-bio/10 bg-ink-3 p-6"
        >
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="caption text-dim">HEALTH COMPLIANCE · 7 DAYS</h2>
            <span className="font-display text-2xl text-bio">{compliance}%</span>
          </div>
          <p className="mb-3 text-[12px] text-dim">How faithfully the body stayed inside its constraints.</p>
          {last7.length > 0 ? (
            <LineChart
              data={last7.map((d) => ({
                label: new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                value: d.compliance,
                meta: `Illusion score ${d.score}% · ${d.overrides} thermal override${d.overrides === 1 ? "" : "s"}`,
              }))}
              height={186}
              yMin={40}
              yMax={105}
            />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-dim">Collecting biological data…</div>
          )}
        </motion.section>
      </div>

      {/* medical banner */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
        onClick={() => openSettings("medical")}
        className="group mt-6 flex w-full items-center justify-between rounded-3xl border border-dashed border-bio/20 bg-ink-2/60 px-6 py-5 text-left transition-colors hover:border-bio/45"
      >
        <div>
          <div className="text-[14.5px] font-medium text-cream">
            Active constraints: {profile?.conditions.length ? profile.conditions.length : 1} · safety graph armed
          </div>
          <div className="caption mt-1 text-dim">tap to review your medical profile, allergies and medications</div>
        </div>
        <ArrowRight className="h-4.5 w-4.5 text-dim transition-transform group-hover:translate-x-1 group-hover:text-bio" />
      </motion.button>
    </div>
  );
}
