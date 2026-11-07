"use client";

/**
 * New Deliberation — the core ritual.
 * Step 1 biological constraints → Step 2 the craving → Step 3 pantry nodes
 * → "Convene the Jury" → cinematic processing → verdict.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, Scale, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { CONDITIONS, PANTRY_STAPLES } from "@/lib/engine/compounds";
import { PROCESSING_STAGES, runDeliberation } from "@/lib/engine/engine";
import { useJury } from "@/lib/store";
import MoleculeField from "@/components/visuals/molecule-field";
import { cn } from "@/lib/utils";
import type { ConditionId } from "@/lib/types";

function usePrefilledProfile() {
  /* read once at mount — AppShell only mounts views after hydration */
  return useMemo(() => useJury.getState().profile, []);
}

const SUGGESTIONS = [
  "Creamy Tomato Soup", "Chocolate Mousse", "Butter Chicken", "Margherita Pasta",
  "Dal Tadka", "Grilled Salmon", "Mango Smoothie", "Hyderabadi Biryani",
  "Roasted Chickpea Bowl", "Khichdi",
];

const STEP_META = [
  { n: "STEP 1", title: "Select Your Biological Constraints", sub: "What restrictions should the Jury consider?" },
  { n: "STEP 2", title: "What Would You Like to Eat?", sub: "Tell the Jury your culinary desire — honestly." },
  { n: "STEP 3", title: "What Ingredients Do You Have?", sub: "Add the nodes available in your kitchen." },
];

function ProcessingOverlay() {
  const [stage, setStage] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    ref.current = window.setInterval(() => setStage((s) => Math.min(PROCESSING_STAGES.length - 1, s + 1)), 920);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#f6faf4]/97 backdrop-blur-xl"
      role="status" aria-live="polite"
    >
      <div className="absolute inset-0 opacity-60"><MoleculeField density={54} speed={2.6} interactive={false} /></div>
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="relative flex h-44 w-44 items-center justify-center">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(14,122,82,0.14)" strokeWidth="2" />
            <circle
              cx="50" cy="50" r="46" fill="none" stroke="#0e7a52" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              style={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - (stage + 1) / PROCESSING_STAGES.length), transition: "stroke-dashoffset 0.7s ease" }}
            />
          </svg>
          <div className="animate-breathe">
            <Scale className="h-12 w-12 text-bio" strokeWidth={1.3} />
          </div>
        </div>
        <div className="mt-10 h-14">
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32 }}
              className={cn("font-display text-xl md:text-2xl", stage === PROCESSING_STAGES.length - 1 ? "text-lime" : "text-cream")}
            >
              {PROCESSING_STAGES[stage]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="caption mt-6 flex items-center gap-2 text-dim">
          <span className="inline-block h-1.5 w-1.5 animate-breathe rounded-full bg-bio" />
          flavor-db · recipe-db · safety-graph · thermodynamics
        </div>
      </div>
    </motion.div>
  );
}

export default function DeliberationView() {
  const profile = usePrefilledProfile();
  const deliberations = useJury((s) => s.deliberations);
  const seq = useJury((s) => s.seq);
  const addDeliberation = useJury((s) => s.addDeliberation);

  const [step, setStep] = useState(0);
  const [constraints, setConstraints] = useState<ConditionId[]>(
    () => (profile?.conditions.length ? profile.conditions : profile ? ["dysgeusia"] : [])
  );
  const [customCondition, setCustomCondition] = useState(profile?.customCondition ?? "");
  const [dish, setDish] = useState("");
  const [servings, setServings] = useState(2);
  const [pantry, setPantry] = useState<string[]>(
    () => profile?.pantry.length ? profile.pantry : ["Olive Oil", "Garlic", "Lemon", "Black Pepper"]
  );

  const [flexible, setFlexible] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [constraintSearch, setConstraintSearch] = useState("");
  const [pantryDraft, setPantryDraft] = useState("");

  const filteredConditions = useMemo(() => {
    const q = constraintSearch.toLowerCase();
    if (!q) return CONDITIONS;
    return CONDITIONS.filter((c) => c.label.toLowerCase().includes(q) || c.short.toLowerCase().includes(q));
  }, [constraintSearch]);

  const toggleConstraint = (id: ConditionId) =>
    setConstraints((cs) => (cs.includes(id) ? cs.filter((c) => c !== id) : [...cs, id]));

  const convene = () => {
    if (!dish.trim()) { toast.error("The Jury needs a craving to judge."); return; }
    setProcessing(true);
    const maxNum = deliberations.reduce((a, d) => Math.max(a, d.number), 2830);
    const nextSeq = maxNum + 1;
    window.setTimeout(() => {
      const res = runDeliberation(
        {
          dish: dish.trim(),
          constraints,
          pantry,
          servings,
          flexible,
          spice: profile?.spice ?? "medium",
          textures: profile?.textures ?? [],
          cuisines: profile?.cuisines ?? [],
          customCondition,
        },
        nextSeq
      );
      const deliberation = {
        ...res.deliberation,
        id: `d-${Date.now()}`,
        number: nextSeq,
        warnings: res.warnings,
      };
      addDeliberation(deliberation);
      setProcessing(false);
      res.warnings.forEach((w) => toast.warning(w, { duration: 6000 }));
      toast.success("Jury deliberation complete — verdict served.");
    }, 5200);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <AnimatePresence>{processing && <ProcessingOverlay />}</AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="caption text-bio">NEW DELIBERATION</p>
        <h1 className="text-balance mt-2 font-display text-4xl font-medium text-cream md:text-5xl">
          Bring the Jury your craving<span className="text-bio">.</span>
        </h1>
        <div className="mt-5 flex items-center gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-bio" : "bg-ink-4")} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── STEP 1 ─────────────────────────────────────── */}
        {step === 0 && (
          <motion.section
            key="c0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <h2 className="font-display text-3xl text-cream">{STEP_META[0].title}</h2>
            <p className="mt-2 text-bone">{STEP_META[0].sub}</p>

            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-line bg-ink-3 px-4 focus-within:border-bio/50">
              <Search className="h-4 w-4 text-dim" />
              <input
                value={constraintSearch}
                onChange={(e) => setConstraintSearch(e.target.value)}
                placeholder="search conditions…"
                className="w-full bg-transparent py-3 text-[14px] text-cream outline-none placeholder:text-dim/60"
              />
            </div>

            <div className="mt-4 grid max-h-80 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
              {filteredConditions.map((c) => {
                const active = constraints.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      toggleConstraint(c.id);
                      if (c.id === "custom" && !active) setTimeout(() => document.getElementById("custom-cond-input")?.focus(), 60);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all",
                      active ? "border-bio/60 bg-bio/10" : "border-line bg-ink-3 hover:border-bio/30"
                    )}
                  >
                    <span>
                      <span className={cn("block text-[14px] font-medium", active ? "text-bio" : "text-cream")}>{c.label}</span>
                      <span className="caption mt-1 block text-[8.5px] text-dim">{c.short}</span>
                    </span>
                    <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", active ? "border-bio bg-bio text-ink" : "border-line")}>
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {constraints.includes("custom") && (
              <input
                id="custom-cond-input"
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                placeholder="describe the custom constraint…"
                className="mt-4 w-full rounded-xl border border-line bg-ink-3 px-4 py-3 text-[14px] text-cream outline-none placeholder:text-dim/60 focus:border-bio/50"
              />
            )}

            {constraints.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {constraints.map((id) => (
                  <span key={id} className="flex items-center gap-2 rounded-full border border-bio/40 bg-bio/10 px-3 py-1.5 text-[12.5px] text-cream">
                    {CONDITIONS.find((c) => c.id === id)?.label}
                    <button onClick={() => toggleConstraint(id)} aria-label="remove constraint" className="text-dim hover:text-rose"><X className="h-3.5 w-3.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ── STEP 2 ─────────────────────────────────────── */}
        {step === 1 && (
          <motion.section
            key="c1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <h2 className="font-display text-3xl text-cream">{STEP_META[1].title}</h2>
            <p className="mt-2 text-bone">{STEP_META[1].sub}</p>

            <textarea
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              rows={3}
              placeholder="e.g., Creamy Tomato Soup, Chocolate Mousse, Butter Chicken…"
              className="mt-6 w-full resize-none rounded-2xl border border-line bg-ink-3 px-5 py-4 text-[17px] text-cream outline-none transition-colors placeholder:text-dim/60 focus:border-bio/50"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setStep(2); } }}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setDish(s)}
                  className="rounded-full border border-line bg-ink-3 px-3.5 py-1.5 text-[12.5px] text-bone transition-all hover:border-bio/40 hover:text-bio"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <span className="caption text-dim">SERVING SIZE</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 4, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setServings(n)}
                    className={cn(
                      "rounded-xl border px-4.5 py-2.5 text-[13.5px] transition-all",
                      servings === n ? "border-bio/60 bg-bio/10 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
                    )}
                  >
                    {n === 6 ? "Family (6)" : `${n} person${n > 1 ? "s" : ""}`}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── STEP 3 ─────────────────────────────────────── */}
        {step === 2 && (
          <motion.section
            key="c2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <h2 className="font-display text-3xl text-cream">{STEP_META[2].title}</h2>
            <p className="mt-2 text-bone">{STEP_META[2].sub}</p>

            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-line bg-ink-3 px-4 focus-within:border-bio/50">
              <Plus className="h-4 w-4 text-dim" />
              <input
                value={pantryDraft}
                onChange={(e) => setPantryDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && pantryDraft.trim()) {
                    e.preventDefault();
                    if (!pantry.includes(pantryDraft.trim())) setPantry((p) => [...p, pantryDraft.trim()]);
                    setPantryDraft("");
                  }
                }}
                placeholder="type an ingredient and press Enter…"
                className="w-full bg-transparent py-3.5 text-[14px] text-cream outline-none placeholder:text-dim/60"
              />
            </div>

            {pantry.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {pantry.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 rounded-full border border-bio/40 bg-bio/10 px-3 py-1.5 text-[12.5px] text-cream">
                    {p}
                    <button onClick={() => setPantry((arr) => arr.filter((x) => x !== p))} aria-label={`remove ${p}`} className="text-dim hover:text-rose"><X className="h-3.5 w-3.5" /></button>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6">
              <span className="caption text-dim">QUICK-ADD</span>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PANTRY_STAPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPantry((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))}
                    className={cn(
                      "rounded-xl border px-2 py-2.5 text-[12px] transition-all",
                      pantry.includes(s) ? "border-bio/60 bg-bio/15 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* flexible toggle */}
            <button
              onClick={() => setFlexible((f) => !f)}
              aria-pressed={flexible}
              className={cn(
                "mt-7 flex w-full items-center justify-between rounded-2xl border p-4.5 text-left transition-all",
                flexible ? "border-bio/50 bg-bio/8" : "border-line bg-ink-3"
              )}
            >
              <span>
                <span className={cn("block text-[14.5px] font-medium", flexible ? "text-bio" : "text-cream")}>I&apos;m Flexible</span>
                <span className="mt-0.5 block text-[12px] text-dim">
                  missing molecular ingredients get auto-sourced with similar compounds — small score cost, zero cooking dead-ends
                </span>
              </span>
              <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", flexible ? "bg-bio" : "bg-ink-4")}>
                <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-ink shadow transition-all", flexible ? "left-[22px]" : "left-0.5")} />
              </span>
            </button>

            <motion.button
              whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
              onClick={convene}
              className="group relative mt-8 w-full overflow-hidden rounded-2xl bg-bio py-4.5 text-[16px] font-semibold text-ink shadow-[0_16px_40px_-14px_rgba(14,122,82,0.6)] transition-shadow hover:shadow-[0_20px_52px_-14px_rgba(14,122,82,0.7)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <Scale className="h-5 w-5" />
                Convene the Jury
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
            <p className="caption mt-3 flex items-center justify-center gap-2 text-dim">
              <Sparkles className="h-3 w-3 text-bio" /> ~5 seconds of real computation theatre
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* nav */}
      <div className="mt-10 flex items-center justify-between border-t border-bio/10 pt-5">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn("flex items-center gap-2 text-[13.5px] text-dim transition-colors hover:text-cream", step === 0 && "invisible")}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {step < 2 && (
          <button
            onClick={() => {
              if (step === 1 && !dish.trim()) { toast.error("Tell the Jury what you're craving."); return; }
              setStep((s) => Math.min(2, s + 1));
            }}
            className="group flex items-center gap-2.5 rounded-full bg-bio px-6 py-3 text-[14px] font-semibold text-ink transition-all hover:shadow-[0_12px_30px_-10px_rgba(14,122,82,0.55)] active:scale-95"
          >
            {step === 1 ? "Add pantry nodes" : "Next"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
