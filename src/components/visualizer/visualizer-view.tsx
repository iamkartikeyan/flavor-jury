"use client";

/**
 * Visualizer — 30 days of biological telemetry in a bento grid.
 */

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useJury, avgScore, compoundTally } from "@/lib/store";
import { LineChart, HBars, StackedArea, CountUp } from "@/components/visuals/charts";

const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export default function VisualizerView() {
  const deliberations = useJury((s) => s.deliberations);
  const dailyStats = useJury((s) => s.dailyStats);
  const avg = avgScore(deliberations);
  const tally = compoundTally(deliberations).slice(0, 5);
  const totalOverrides = deliberations.reduce((a, d) => a + d.overrides.length, 0);

  const byDay = dailyStats;
  const first10 = byDay.slice(0, 10).reduce((a, d) => a + d.score, 0) / Math.max(1, byDay.slice(0, 10).length);
  const last10 = byDay.slice(-10).reduce((a, d) => a + d.score, 0) / Math.max(1, byDay.slice(-10).length);
  const trend = Math.round(last10 - first10);

  const scoreSeries = byDay.map((d) => ({
    label: fmtDay(d.date),
    value: d.score,
    meta: deliberations.find((x) => fmtDay(x.createdAt) === fmtDay(d.date))?.dish ?? "rest day",
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="caption text-bio">SENSORY VISUALIZER</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-cream md:text-5xl">Your flavor journey<span className="text-bio">.</span></h1>
        <p className="mt-3 max-w-xl text-bone">
          Thirty days of deliberations, compounds and thermal interventions — the biology of taste, made legible.
        </p>
      </motion.div>

      {/* bento */}
      <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* big chart — spans 2x2 */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          className="rounded-3xl border border-bio/10 bg-ink-3 p-6 md:col-span-2 md:row-span-2"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="caption text-dim">HISTORICAL SENSORY SCORES · 30 DAYS</h2>
              <p className="mt-1 text-[12px] text-dim">hover any point for the dish behind it</p>
            </div>
            <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] ${trend >= 0 ? "border-bio/30 bg-bio/8 text-bio" : "border-rose/30 bg-rose/8 text-rose"}`}>
              <TrendingUp className={`h-3.5 w-3.5 ${trend < 0 ? "rotate-180" : ""}`} />
              {trend >= 0 ? "+" : ""}{trend}% vs last month
            </span>
          </div>
          {scoreSeries.length > 0 ? (
            <LineChart data={scoreSeries} height={260} yMin={55} yMax={100} />
          ) : (
            <div className="flex h-60 items-center justify-center text-sm text-dim">No deliberations yet</div>
          )}
        </motion.section>

        {/* avg score */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
          className="flex flex-col justify-between rounded-3xl border border-bio/10 bg-gradient-to-br from-bio/12 to-ink-3 p-6"
        >
          <span className="caption text-dim">AVERAGE ILLUSION SCORE</span>
          <div>
            <span className="font-display text-6xl text-bio"><CountUp to={avg} suffix="%" /></span>
            <p className="mt-2 text-[12.5px] text-bone">across all {deliberations.length} deliberations</p>
          </div>
          <span className="caption text-[8.5px] text-dim">target ceiling: 97%</span>
        </motion.section>

        {/* top compounds */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}
          className="rounded-3xl border border-bio/10 bg-ink-3 p-6"
        >
          <h2 className="caption text-dim">MOST USED COMPOUNDS</h2>
          <div className="mt-4">
            {tally.length > 0 ? <HBars items={tally.map((t) => ({ label: t.name, value: t.count }))} /> : <p className="text-[13px] text-dim">No compound usage yet</p>}
          </div>
        </motion.section>

        {/* overrides */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
          className="rounded-3xl border border-amber/20 bg-ink-3 p-6"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="caption text-amber/90">THERMODYNAMIC OVERRIDES</h2>
            <span className="font-display text-2xl text-amber">{totalOverrides}</span>
          </div>
          <p className="mt-1 text-[12px] text-dim">temperatures rewritten to save volatiles</p>
          <div className="mt-3">
            {byDay.length > 0 ? (
              <LineChart
                data={byDay.map((d) => ({ label: fmtDay(d.date), value: d.overrides }))}
                height={150}
                color="#b45309"
                area={false}
                yMin={0}
                yMax={4}
                format={(v) => `${v}`}
                unitLabel="overrides per day"
              />
            ) : <p className="text-[13px] text-dim">No data</p>}
          </div>
        </motion.section>

        {/* trigeminal vs gustatory */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border border-bio/10 bg-ink-3 p-6 md:col-span-2"
        >
          <h2 className="caption text-dim">TRIGEMINAL vs GUSTATORY BALANCE</h2>
          <p className="mt-1 text-[12px] text-dim">how much of each experience came from nerve channels vs taste chemistry</p>
          <div className="mt-4">
            {byDay.length > 0 ? (
              <StackedArea
                labels={byDay.map((d) => fmtDay(d.date))}
                seriesA={byDay.map((d) => d.trigeminal)}
                seriesB={byDay.map((d) => Math.max(0, d.gustatory - d.trigeminal * 0.6))}
                height={210}
              />
            ) : <p className="text-[13px] text-dim">No data</p>}
          </div>
        </motion.section>

        {/* streak + totals */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.36 }}
          className="rounded-3xl border border-bio/10 bg-ink-3 p-6"
        >
          <span className="caption text-dim">DISCIPLINE STREAK</span>
          <div className="mt-3 font-display text-5xl text-lime">
            <CountUp to={Math.max(1, dailyStats.filter((d) => d.compliance >= 85).length)} suffix=" days" />
          </div>
          <p className="mt-2 text-[12.5px] text-bone">staying inside your safety graph</p>
        </motion.section>
      </div>
    </div>
  );
}
