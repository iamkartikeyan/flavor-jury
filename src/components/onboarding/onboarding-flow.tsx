"use client";

/**
 * Onboarding — the biological intake.
 * Welcome → Basic info → Medical conditions → Taste preferences →
 * Kitchen staples → Completion. Every answer persists to the profile.
 */

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, Sparkles, UserRound, Activity, HeartPulse, Zap, Droplets, WheatOff, MilkOff, ShieldAlert, Leaf, CirclePlus } from "lucide-react";
import { toast } from "sonner";
import { Logo, JuryMark } from "@/components/visuals/logo";
import MoleculeField from "@/components/visuals/molecule-field";
import { useJury } from "@/lib/store";
import { CONDITIONS, CUISINE_OPTIONS, PANTRY_STAPLES, SPICE_LEVELS, TEXTURE_OPTIONS } from "@/lib/engine/compounds";
import type { ConditionId, SpiceLevel, UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

const CONDITION_ICON: Record<string, React.ElementType> = {
  hypertension: HeartPulse, diabetes: Activity, dysgeusia: Zap, kidney: Droplets,
  celiac: WheatOff, lactose: MilkOff, nut_allergy: ShieldAlert, low_fodmap: Leaf, custom: CirclePlus,
};

const STEP_TITLES = ["Your basics", "Biological constraints", "Taste signature", "Kitchen nodes"];

export default function OnboardingFlow() {
  const [step, setStep] = useState(-1); // -1 = welcome
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<UserProfile["gender"]>("");
  const [email, setEmail] = useState("");
  const [conditions, setConditions] = useState<ConditionId[]>([]);
  const [customCondition, setCustomCondition] = useState("");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [spice, setSpice] = useState<SpiceLevel>("medium");
  const [textures, setTextures] = useState<string[]>([]);
  const [pantry, setPantry] = useState<string[]>([]);
  const [pantryDraft, setPantryDraft] = useState("");

  const profile = useJury((s) => s.profile);
  const setView = useJury((s) => s.setView);
  const completeOnboarding = useJury((s) => s.completeOnboarding);

  const progress = useMemo(() => {
    if (step < 0) return 0;
    return (step / 4) * 100;
  }, [step]);

  const toggle = <T,>(arr: T[], v: T, set: (a: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const goScience = () => {
    setView("landing");
    setTimeout(() => document.getElementById("science")?.scrollIntoView({ behavior: "smooth" }), 420);
  };

  const finish = () => {
    if (!name.trim()) { toast.error("Tell the Jury your name first."); setStep(0); return; }
    if (!email.trim() || !email.includes("@")) { toast.error("A valid email keeps your verdicts safe."); setStep(0); return; }
    const p: UserProfile = {
      name: name.trim(), age: age ? Number(age) : null, gender, email: email.trim(),
      conditions: conditions.length ? conditions : ["dysgeusia"],
      customCondition, cuisines, spice, textures, pantry,
      medications: [], allergies: [], createdAt: new Date().toISOString(),
    };
    completeOnboarding(p);
    toast.success("Your biological profile is ready. The Jury awaits your first deliberation.");
  };

  const canNext = (s: number) => {
    if (s === 0) return name.trim().length > 1 && email.includes("@");
    return true;
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <MoleculeField density={40} speed={0.7} interactive={false} />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
        <Logo onClick={() => setStep(-1)} />
        {step >= 0 && (
          <div className="flex items-center gap-3">
            <span className="caption text-dim">{step < 4 ? `STEP ${step + 1} / 4 · ${STEP_TITLES[step]}` : "PROFILE COMPLETE"}</span>
          </div>
        )}
      </header>

      {step >= 0 && (
        <div className="relative z-10 mx-auto h-[3px] w-full max-w-6xl px-5 lg:px-8">
          <div className="h-full w-full overflow-hidden rounded-full bg-ink-3">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-bio to-lime"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-10 lg:px-8">
        <AnimatePresence mode="wait">

          {/* ── WELCOME ─────────────────────────────────── */}
          {step === -1 && (
            <motion.section
              key="welcome"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col items-center justify-center py-14 text-center"
            >
              <div className="animate-drift"><JuryMark size={72} /></div>
              <h1 className="text-balance mt-8 font-display text-4xl font-medium leading-tight text-cream md:text-6xl">
                Before the Jury can serve you,
                <br />
                <span className="italic text-bio">it must meet you.</span>
              </h1>
              <p className="text-pretty mt-5 max-w-xl text-[15.5px] leading-relaxed text-bone">
                Four quiet steps — your basics, your biological constraints, your taste
                signature and your kitchen. Then every verdict is tuned to your body.
              </p>
              <div className="mt-10 flex w-full max-w-md flex-col gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="group flex items-center justify-between rounded-2xl border border-bio/30 bg-bio/10 px-6 py-4.5 text-left transition-all hover:bg-bio/15 hover:shadow-[0_14px_36px_-16px_rgba(14,122,82,0.5)]"
                >
                  <span className="flex items-center gap-3.5">
                    <Sparkles className="h-5 w-5 text-bio" />
                    <span>
                      <span className="block text-[15px] font-semibold text-cream">Get Started</span>
                      <span className="block text-[12px] text-dim">build your biological profile — 2 minutes</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4.5 w-4.5 text-bio transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={goScience}
                  className="group flex items-center justify-between rounded-2xl border border-bio/15 bg-ink-3 px-6 py-4.5 text-left transition-colors hover:border-bio/30"
                >
                  <span className="flex items-center gap-3.5">
                    <Activity className="h-5 w-5 text-bone" />
                    <span>
                      <span className="block text-[15px] font-medium text-cream">Read the Science</span>
                      <span className="block text-[12px] text-dim">how cross-modal illusions are built</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4.5 w-4.5 text-dim transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => {
                    if (profile) { setView("dashboard"); toast.success(`Welcome back, ${profile.name.split(" ")[0]}.`); }
                    else toast.error("No biological profile found on this device — let's build one.");
                  }}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-ink-3 px-6 py-4.5 text-left transition-colors hover:border-bio/25"
                >
                  <span className="flex items-center gap-3.5">
                    <UserRound className="h-5 w-5 text-dim" />
                    <span>
                      <span className="block text-[15px] font-medium text-bone">I have an account</span>
                      <span className="block text-[12px] text-dim">resume a saved profile on this device</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4.5 w-4.5 text-dim transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.section>
          )}

          {/* ── STEP 1 · BASICS ─────────────────────────── */}
          {step === 0 && (
            <motion.section
              key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col justify-center py-12"
            >
              <h2 className="font-display text-4xl text-cream md:text-5xl">Who is sitting at the table?</h2>
              <p className="mt-3 max-w-lg text-bone">The Jury addresses you by name and calibrates portion physics by age.</p>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="caption text-dim">FULL NAME *</span>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Meera Krishnan"
                    className="mt-2 w-full rounded-xl border border-line bg-ink-3 px-4 py-3.5 text-cream outline-none transition-colors placeholder:text-dim/60 focus:border-bio/50"
                  />
                </label>
                <label className="block">
                  <span className="caption text-dim">EMAIL *</span>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-line bg-ink-3 px-4 py-3.5 text-cream outline-none transition-colors placeholder:text-dim/60 focus:border-bio/50"
                  />
                </label>
                <label className="block">
                  <span className="caption text-dim">AGE</span>
                  <input
                    type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} placeholder="42"
                    className="mt-2 w-full rounded-xl border border-line bg-ink-3 px-4 py-3.5 text-cream outline-none transition-colors placeholder:text-dim/60 focus:border-bio/50"
                  />
                </label>
                <div>
                  <span className="caption text-dim">GENDER</span>
                  <div className="mt-2 flex gap-2">
                    {(["female", "male", "other"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={cn(
                          "flex-1 rounded-xl border px-3 py-3.5 text-[13.5px] capitalize transition-all",
                          gender === g ? "border-bio/60 bg-bio/10 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── STEP 2 · CONDITIONS ─────────────────────── */}
          {step === 1 && (
            <motion.section
              key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col justify-center py-12"
            >
              <h2 className="font-display text-4xl text-cream md:text-5xl">Your biological constraints</h2>
              <p className="mt-3 max-w-2xl text-bone">
                Select everything that applies — the Jury treats each one as a hard safety
                boundary, never a suggestion. Saved once, enforced forever.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CONDITIONS.map((c) => {
                  const Icon = CONDITION_ICON[c.id] ?? CirclePlus;
                  const active = conditions.includes(c.id);
                  return (
                    <motion.button
                      key={c.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggle(conditions, c.id, setConditions)}
                      aria-pressed={active}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
                        active ? "border-bio/60 bg-bio/10 shadow-[0_10px_28px_-16px_rgba(14,122,82,0.4)]" : "border-line bg-ink-3 hover:border-bio/30"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <Icon className={cn("h-5 w-5", active ? "text-bio" : "text-dim group-hover:text-bone")} strokeWidth={1.8} />
                        {active && <Check className="h-4 w-4 text-bio" />}
                      </div>
                      <div className="mt-3 text-[14px] font-medium leading-snug text-cream">{c.label}</div>
                      <div className={cn("caption mt-1.5 text-[8.5px]", active ? "text-bio" : "text-dim")}>{c.short}</div>
                      {active && c.id === "custom" && (
                        <input
                          value={customCondition}
                          onChange={(e) => setCustomCondition(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="describe your condition…"
                          className="mt-3 w-full rounded-lg border border-line bg-ink px-3 py-2 text-[12.5px] text-cream outline-none placeholder:text-dim/60 focus:border-bio/50"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <p className="caption mt-6 text-dim">
                {conditions.length === 0 ? "No constraints selected — we'll run a default dysgeusia-aware profile." : `${conditions.length} constraint${conditions.length > 1 ? "s" : ""} locked into the safety graph.`}
              </p>
            </motion.section>
          )}

          {/* ── STEP 3 · TASTE ──────────────────────────── */}
          {step === 2 && (
            <motion.section
              key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col justify-center py-12"
            >
              <h2 className="font-display text-4xl text-cream md:text-5xl">Your taste signature</h2>
              <p className="mt-3 max-w-2xl text-bone">This is the hedonic map — what cuisines you love, how much nerve-fire you enjoy, and which textures make you close your eyes.</p>

              <div className="mt-9 space-y-8">
                <div>
                  <span className="caption text-dim">FAVORITE CUISINES</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CUISINE_OPTIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => toggle(cuisines, c, setCuisines)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[13px] transition-all",
                          cuisines.includes(c) ? "border-bio/60 bg-bio/10 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="caption text-dim">SPICE TOLERANCE — trigeminal dial</span>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SPICE_LEVELS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSpice(s.id)}
                        className={cn(
                          "rounded-xl border px-3 py-3.5 text-left transition-all",
                          spice === s.id ? "border-bio/60 bg-bio/10" : "border-line bg-ink-3 hover:border-bio/30"
                        )}
                      >
                        <span className={cn("block text-[14px] font-medium", spice === s.id ? "text-bio" : "text-cream")}>{s.label}</span>
                        <span className="block text-[11px] text-dim">{s.note}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="caption text-dim">TEXTURE PREFERENCES</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TEXTURE_OPTIONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => toggle(textures, t, setTextures)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-[13px] transition-all",
                          textures.includes(t) ? "border-bio/60 bg-bio/10 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── STEP 4 · PANTRY ─────────────────────────── */}
          {step === 3 && (
            <motion.section
              key="s3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col justify-center py-12"
            >
              <h2 className="font-display text-4xl text-cream md:text-5xl">Your kitchen nodes</h2>
              <p className="mt-3 max-w-2xl text-bone">
                The Jury sources molecular substitutes from what you actually own. Tap the
                staples below or type your own — press Enter to add.
              </p>

              <div className="mt-8 max-w-xl">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-ink-3 px-4 py-1.5 focus-within:border-bio/50">
                  <Plus className="h-4 w-4 text-dim" />
                  <input
                    value={pantryDraft}
                    onChange={(e) => setPantryDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && pantryDraft.trim()) {
                        e.preventDefault();
                        if (!pantry.includes(pantryDraft.trim())) setPantry([...pantry, pantryDraft.trim()]);
                        setPantryDraft("");
                      }
                    }}
                    placeholder="add ingredient — e.g. Shiitake Powder"
                    className="w-full bg-transparent py-2.5 text-[14px] text-cream outline-none placeholder:text-dim/60"
                  />
                </div>
                {pantry.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pantry.map((p) => (
                      <span key={p} className="group flex items-center gap-1.5 rounded-full border border-bio/40 bg-bio/10 px-3 py-1.5 text-[12.5px] text-cream">
                        {p}
                        <button onClick={() => setPantry(pantry.filter((x) => x !== p))} aria-label={`remove ${p}`} className="text-dim transition-colors hover:text-rose">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <span className="caption text-dim">QUICK-ADD STAPLES</span>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                  {PANTRY_STAPLES.map((s) => {
                    const active = pantry.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggle(pantry, s, setPantry)}
                        className={cn(
                          "rounded-xl border px-2 py-2.5 text-[12px] transition-all",
                          active ? "border-bio/60 bg-bio/15 text-bio" : "border-line bg-ink-3 text-bone hover:border-bio/30"
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {/* ── COMPLETION ──────────────────────────────── */}
          {step === 4 && (
            <motion.section
              key="s4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col items-center justify-center py-16 text-center"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                className="flex h-20 w-20 items-center justify-center rounded-full border border-bio/40 bg-bio/10"
              >
                <Check className="h-9 w-9 text-bio" strokeWidth={2.2} />
              </motion.div>
              <h2 className="text-balance mt-8 font-display text-4xl text-cream md:text-5xl">
                Your biological profile is ready.
              </h2>
              <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-bone">
                The Jury awaits your first deliberation. Every verdict from here is tuned to
                your body, your kitchen and your pleasure.
              </p>
              <button
                onClick={finish}
                className="group mt-9 flex items-center gap-2.5 rounded-full bg-bio px-8 py-3.5 text-[15px] font-semibold text-ink shadow-[0_14px_36px_-12px_rgba(14,122,82,0.55)] transition-all hover:shadow-[0_18px_48px_-12px_rgba(14,122,82,0.65)] active:scale-95"
              >
                Go to Dashboard
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* footer controls */}
        {step >= 0 && step < 4 && (
          <div className="mt-auto flex items-center justify-between border-t border-bio/10 pt-5">
            <button
              onClick={() => setStep(step - 1)}
              className={cn("flex items-center gap-2 text-[13.5px] text-dim transition-colors hover:text-cream", step === 0 && "invisible")}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={() => {
                if (!canNext(step)) { toast.error(step === 0 ? "Name and a valid email are required." : "Complete this step first."); return; }
                setStep(step + 1);
              }}
              className="group flex items-center gap-2.5 rounded-full bg-bio px-6 py-3 text-[14px] font-semibold text-ink transition-all hover:shadow-[0_12px_30px_-10px_rgba(14,122,82,0.55)] active:scale-95"
            >
              {step === 3 ? "Convene my profile" : "Next"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
