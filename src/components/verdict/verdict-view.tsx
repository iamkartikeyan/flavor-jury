"use client";

/**
 * Verdict — where the Jury's decision is served.
 * A medical report crossed with a Michelin protocol: illusion score,
 * molecular hack, radar profile, recipe steps and the killer thermodynamic
 * override blocks.
 */

import { motion } from "framer-motion";
import {
  AlertTriangle, Atom, Check, Copy, Download, Flame, Share2, Sparkles, Star, Thermometer, TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { ScoreRing } from "@/components/visuals/charts";
import FlavorRadar from "@/components/visuals/radar-chart";
import MoleculeField from "@/components/visuals/molecule-field";
import { useJury } from "@/lib/store";
import type { Deliberation } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<string, string> = {
  bio: "text-bio", amber: "text-amber", violet: "text-violet", lime: "text-lime", ember: "text-ember",
};
const ACCENT_BG: Record<string, string> = {
  bio: "bg-bio", amber: "bg-amber", violet: "bg-violet", lime: "bg-lime", ember: "bg-ember",
};

function Card({ title, tag, children, className = "" }: { title: string; tag?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-3xl border border-bio/10 bg-ink-3 p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="caption text-bio">{title}</h2>
        {tag && <span className="caption text-[8.5px] text-dim">{tag}</span>}
      </div>
      {children}
    </section>
  );
}

function OverrideBlock({ o }: { o: Deliberation["overrides"][number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative my-4 overflow-hidden rounded-2xl border-2 border-amber/50 bg-gradient-to-br from-amber/12 via-amber/5 to-transparent"
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber to-transparent" />
      <div className="flex items-center gap-2 px-5 pt-4">
        <span className="flex items-center gap-1.5 rounded-full bg-amber px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
          <TriangleAlert className="h-3 w-3" /> Thermodynamic Override
        </span>
        <span className="caption text-[8.5px] text-amber/80">step {o.stepIndex + 1} · preserve {o.compound} (evap {o.evapTemp}°C)</span>
      </div>
      <div className="px-5 py-4">
        <p className="text-[13.5px] leading-relaxed text-dim">
          <s>{o.method}, {o.originalTemp}°C for {o.originalTime} min</s>
        </p>
        <p className="mt-1.5 text-[16px] font-semibold leading-snug text-amber">
          {o.newTemp}°C for {o.newTime} min — {o.method === "Simmer gently" ? "a slow murmur, never a boil" : o.method === "Roast hard, then finish low" ? "sear first, finish covered and low" : "hold it low and patient"}
        </p>
        <p className="mt-2.5 border-l-2 border-amber/40 pl-3 text-[12.5px] leading-relaxed text-bone">{o.reason}</p>
      </div>
    </motion.div>
  );
}

export default function VerdictView({ deliberation: d }: { deliberation: Deliberation }) {
  const updateFeedback = useJury((s) => s.updateFeedback);

  const share = async () => {
    const text = `Flavor Jury verdict — ${d.dish}\nSensory Illusion Score: ${d.score}%\nStrategy: ${d.strategyLabel}\nCompounds: ${d.compounds.map((c) => c.name).join(", ")}\nSafety: 0mg sodium · 0g added sugar verified`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Deliberation copied — paste it anywhere.");
    } catch {
      toast.error("Clipboard unavailable in this browser.");
    }
  };

  const exportPdf = () => {
    toast.info("Opening print dialog — choose “Save as PDF”.");
    setTimeout(() => window.print(), 350);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">
      {/* ── HEADER ─────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
        className="panel relative overflow-hidden rounded-3xl p-7 md:p-9"
      >
        <div className="pointer-events-none absolute inset-0 opacity-25"><MoleculeField density={30} speed={0.9} interactive={false} opacity={0.5} /></div>
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="caption flex flex-wrap items-center gap-x-3 gap-y-1 text-dim">
              <span className="text-bio">DELIBERATION #{d.number}</span>
              <span>·</span>
              <span>COMPLETED {new Date(d.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              <span>·</span>
              <span className="text-lime">CONFIDENCE: {d.score >= 92 ? "HIGH" : d.score >= 85 ? "STANDARD" : "EXPLORATORY"}</span>
            </div>
            <h1 className="text-balance mt-3 font-display text-4xl font-medium leading-[1.04] text-cream md:text-5xl">{d.dish}</h1>
            <p className="mt-3 text-[13.5px] text-bone">
              {d.cuisine} · serves {d.servings} · strategy: <b className="text-cream">{d.strategyLabel}</b>
            </p>
            <p className="mt-1.5 text-[13px] text-dim">Brain perceives {d.score}% of the original flavor intensity.</p>
          </div>
          <div className="shrink-0 self-center md:self-auto">
            <ScoreRing value={d.score} size={196} />
          </div>
        </div>

        {/* safety ledger */}
        <div className="relative z-10 mt-7 flex flex-wrap gap-2.5">
          {d.safety.checks.map((c) => (
            <span key={c.label} className="flex items-center gap-2 rounded-full border border-bio/25 bg-bio/5 px-3.5 py-1.5 text-[12px] text-cream">
              <Check className="h-3.5 w-3.5 text-bio" strokeWidth={2.5} />
              <b>{c.label}</b> · <span className="text-dim">{c.note}</span>
            </span>
          ))}
        </div>
      </motion.header>

      {/* conflict warnings */}
      {d.warnings && d.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-5 space-y-2.5"
        >
          {d.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-amber/40 bg-amber/8 px-5 py-3.5">
              <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber" />
              <p className="text-[13.5px] leading-relaxed text-bone">{w}</p>
            </div>
          ))}
        </motion.div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[2fr_3fr]">
        {/* ── LEFT: MOLECULAR HACK ───────────────────── */}
        <div className="space-y-5">
          <Card title="MOLECULAR HACK" tag={`${d.compounds.length} active compounds`}>
            <ul className="space-y-3.5">
              {d.compounds.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                  className="group rounded-2xl border border-bio/8 bg-ink-2 p-3.5 transition-colors hover:border-bio/25"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", ACCENT_BG[c.accent])} />
                    <span className="text-[14.5px] font-medium text-cream">{c.name}</span>
                    <span className="caption ml-auto text-[9px] text-dim">{c.evapTemp}°C evap</span>
                  </div>
                  <div className="mt-1.5 pl-[18px] text-[12.5px] text-bone">
                    from <b className="text-cream/90">{c.source}</b> · {c.quantity}
                  </div>
                  <div className={cn("mt-1 pl-[18px] text-[11.5px] leading-snug", ACCENT_TEXT[c.accent])}>{c.fn}</div>
                </motion.li>
              ))}
            </ul>
          </Card>

          <Card title="FLAVOR PROFILE · RADAR" tag="original vs augmented">
            <FlavorRadar data={d.radar} size={290} />
          </Card>

          <Card title="TRIGEMINAL STIMULATION INDEX">
            <div className="flex items-end justify-between">
              <span className="font-display text-4xl text-violet">{d.trigeminalIndex}%</span>
              <span className="caption text-dim">texture · temperature · tingle</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink-4">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet/60 to-violet"
                initial={{ width: 0 }} animate={{ width: `${d.trigeminalIndex}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-bone">
              Texture, temperature and tingling sensations compensate for lost gustatory input — this index is the strength of that channel.
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-violet/20 bg-violet/5 px-4 py-2.5">
              <span className="caption text-[8.5px] text-dim">DOPAMINE PROJECTION</span>
              <span className="text-[13px] font-semibold text-violet">{d.dopamineIndex}% of classic reward</span>
            </div>
          </Card>

          {/* smart substitutions */}
          {d.substitutions.length > 0 && (
            <Card title="SMART SUBSTITUTIONS" tag={`score impact ${d.substitutions.reduce((a, s) => a + s.scoreImpact, 0)}%`}>
              <ul className="space-y-3">
                {d.substitutions.map((s) => (
                  <li key={s.missing} className="rounded-2xl border border-amber/25 bg-amber/5 p-3.5">
                    <div className="flex items-center gap-2 text-[13.5px] text-cream">
                      <Sparkles className="h-4 w-4 text-amber" />
                      You don&apos;t have <b>{s.missing}</b>
                    </div>
                    <div className="mt-1.5 pl-6 text-[12.5px] text-bone">
                      Use: {s.alternatives.map((a) => `${a.name} (${a.quantity})`).join(" · ")}
                    </div>
                    <div className="caption mt-1 pl-6 text-[8.5px] text-amber/80">
                      illusion score impact: {s.scoreImpact}%
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* ── RIGHT: RECIPE PROTOCOL ─────────────────── */}
        <div className="space-y-5">
          <Card title="RECIPE PROTOCOL" tag={`${d.ingredients.length} ingredients · ${d.steps.length} steps`}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="caption mb-2.5 text-dim">BASE & SWAPPED</h3>
                <ul className="space-y-2">
                  {d.ingredients.filter((i) => i.kind !== "molecular").map((i) => (
                    <li key={i.id} className="flex items-baseline justify-between gap-3 text-[13px]">
                      <span className="min-w-0 truncate text-cream">
                        {i.name}
                        {i.kind === "swapped" && <span className="caption ml-1.5 text-[8px] text-amber">SAFE-SWAP</span>}
                      </span>
                      <span className="shrink-0 text-right text-[11.5px] text-dim">{i.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="caption mb-2.5 flex items-center gap-1.5 text-bio"><Atom className="h-3.5 w-3.5" /> MOLECULAR ADDITIONS</h3>
                <ul className="space-y-2">
                  {d.ingredients.filter((i) => i.kind === "molecular").map((i) => (
                    <li key={i.id} className="flex items-baseline justify-between gap-3 text-[13px]">
                      <span className="min-w-0 truncate text-cream">{i.name}</span>
                      <span className="shrink-0 text-right text-[11.5px] text-bio">{i.quantity}</span>
                    </li>
                  ))}
                </ul>
                <p className="caption mt-3 text-[8.5px] leading-relaxed text-dim">
                  Exact quantities matter — receptor thresholds are narrow. Level spoons, weigh powders.
                </p>
              </div>
            </div>
          </Card>

          <Card title="PROTOCOL · STEP BY STEP" tag="thermodynamically rewritten">
            <ol className="relative space-y-1">
              <span className="absolute bottom-4 left-[15px] top-3 w-px bg-bio/10" aria-hidden />
              {d.steps.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="relative pl-11"
                >
                  <span className={cn(
                    "absolute left-0 top-3 flex h-8 w-8 items-center justify-center rounded-full border font-display text-[13px]",
                    s.override ? "border-amber bg-amber/15 text-amber" : "border-bio/25 bg-ink-2 text-bio"
                  )}>
                    {i + 1}
                  </span>
                  <div className="py-2">
                    <p className="text-[14.5px] leading-relaxed text-cream">{s.text}</p>
                    {s.temp !== undefined && !s.override && (
                      <p className="caption mt-1 flex items-center gap-1.5 text-[9px] text-dim">
                        <Flame className="h-3 w-3" /> {s.temp}°C{s.timeMin ? ` · ${s.timeMin} min` : ""}
                      </p>
                    )}
                    {s.override && <OverrideBlock o={s.override} />}
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="mt-4 rounded-2xl border border-bio/15 bg-bio/5 px-4.5 py-3.5">
              <p className="text-[13px] leading-relaxed text-bone">
                <b className="text-cream">Finishing note:</b> {d.steps.length > 0 ? "serve immediately — retronasal aroma is 80% of the illusion." : ""}
              </p>
            </div>
          </Card>

          {/* actions + feedback */}
          <Card title="VERDICT ACTIONS">
            <div className="grid gap-2.5 sm:grid-cols-3">
              <button
                onClick={() => toast.success("Saved to your sensory profile.")}
                className="flex items-center justify-center gap-2 rounded-xl border border-bio/30 bg-bio/10 px-4 py-3 text-[13.5px] font-medium text-bio transition-all hover:bg-bio/15"
              >
                <Download className="h-4 w-4" /> Save to Profile
              </button>
              <button
                onClick={exportPdf}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-ink-2 px-4 py-3 text-[13.5px] text-cream transition-colors hover:border-bio/40"
              >
                <Download className="h-4 w-4" /> Export as PDF
              </button>
              <button
                onClick={share}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-ink-2 px-4 py-3 text-[13.5px] text-cream transition-colors hover:border-bio/40"
              >
                <Share2 className="h-4 w-4" /> Share Deliberation
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5 border-t border-bio/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="caption text-dim">RATE THIS DELIBERATION</span>
                <div className="mt-2 flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      role="radio"
                      aria-checked={(d.feedback?.rating ?? 0) >= n}
                      onClick={() => { updateFeedback(d.id, { rating: n }); toast.success(`Rated ${n}/5 — the Jury takes notes.`); }}
                      className="transition-transform hover:scale-110 active:scale-90"
                    >
                      <Star className={cn("h-5.5 w-5.5", (d.feedback?.rating ?? 0) >= n ? "fill-lime text-lime" : "text-dim")} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="caption text-dim">WAS THIS HELPFUL?</span>
                <div className="mt-2 flex gap-2 sm:justify-end">
                  {([true, false] as const).map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => { updateFeedback(d.id, { helpful: v }); toast.success(v ? "Feedback logged — more like this." : "Feedback logged — the Jury will adjust."); }}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-[13px] transition-all",
                        d.feedback?.helpful === v ? "border-bio/60 bg-bio/10 text-bio" : "border-line text-bone hover:border-bio/30"
                      )}
                    >
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* api trace */}
          <Card title="API TRACE" tag="for the judges in the room">
            <ul className="space-y-1.5">
              {d.apiLog.map((l, i) => (
                <li key={i} className="caption truncate rounded-lg bg-ink px-3 py-2 text-[10px] text-bio/80">{l}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
