"use client";

/**
 * Landing — Nav, Hero, and the three failure modes of current diets.
 */

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Scale, FileWarning, Flame, Trash2 } from "lucide-react";
import { useState } from "react";
import MoleculeField from "@/components/visuals/molecule-field";
import { Logo } from "@/components/visuals/logo";
import { useJury } from "@/lib/store";

export function Reveal({
  children, delay = 0, className = "", y = 26,
}: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="caption rounded-full border border-bio/25 px-3 py-1 text-bio">{n}</span>
      <span className="caption text-dim">{label}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-bio/25 to-transparent" />
    </div>
  );
}

/* ── Nav ────────────────────────────────────────────────── */
function Nav() {
  const setView = useJury((s) => s.setView);
  const profile = useJury((s) => s.profile);
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-bio/10 bg-ink/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Landing">
          <a href="#platform" className="text-[13.5px] text-bone transition-colors hover:text-cream">Platform</a>
          <a href="#science" className="text-[13.5px] text-bone transition-colors hover:text-cream">The Science</a>
          <a href="#research" className="text-[13.5px] text-bone transition-colors hover:text-cream">Research</a>
        </nav>
        <button
          onClick={() => { setView(profile ? "dashboard" : "onboarding"); }}
          className="group relative overflow-hidden rounded-full bg-bio px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            Enter the Jury Room
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
    </motion.header>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function Hero() {
  const setView = useJury((s) => s.setView);
  const profile = useJury((s) => s.profile);
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* molecular field */}
      <div className="absolute inset-0 opacity-80" aria-hidden>
        <MoleculeField density={72} speed={1.1} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(245,249,243,0.55)_62%,#f5f9f3_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
          className="caption flex items-center gap-2.5 text-bio"
        >
          <span className="inline-block h-1.5 w-1.5 animate-breathe rounded-full bg-bio" />
          The world&apos;s first Bio-Adaptive Sensory Augmentation Engine
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance font-display text-[13vw] font-medium leading-[0.98] tracking-tight text-cream sm:text-7xl lg:text-[92px]"
        >
          Judging the molecular
          <br />
          <span className="italic text-bio">fate</span> of your diet.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="text-pretty mt-7 max-w-2xl text-[17px] leading-relaxed text-bone"
        >
          We don&apos;t subtract ingredients — we hack the human sensory network.
          Flavor Jury builds <b className="text-cream">Cross-Modal Illusions</b>: volatile compounds,
          temperature physics and texture science that make a sodium-free, sugar-free plate
          taste 94% whole.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => setView(profile ? "dashboard" : "onboarding")}
            className="group relative overflow-hidden rounded-full bg-bio px-7 py-3.5 text-[15px] font-semibold text-ink shadow-[0_14px_36px_-12px_rgba(14,122,82,0.55)] transition-all hover:shadow-[0_18px_48px_-12px_rgba(14,122,82,0.65)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Enter the Jury Room
              <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
          <a
            href="#science"
            className="flex items-center gap-2.5 rounded-full border border-bio/30 bg-white/60 px-7 py-3.5 text-[15px] text-cream transition-colors hover:border-bio/60 hover:bg-bio/5"
          >
            <BookOpen className="h-4.5 w-4.5 text-bio" />
            Read the Science
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
          className="caption mt-9 flex items-center gap-2 text-dim"
        >
          <span className="h-px w-8 bg-line" />
          No credit card required · 24-hour hackathon prototype · FlavorDB + RecipeDB powered
        </motion.p>
      </div>

      {/* bottom fade ticker */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-bio/10 bg-white/60 backdrop-blur">
        <div className="caption mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-3 text-dim lg:justify-between lg:px-8">
          <span className="text-bio/80">GET /api/compound/synergy?target=umami</span>
          <span className="hidden sm:inline">GET /api/flavor_network/volatiles?temp&lt;100°C</span>
          <span className="hidden md:inline">POST /api/instructions/modify</span>
          <span className="hidden lg:inline text-cream/60">ILLUSION_SCORE = P(receptors fire | substitute) = 0.94</span>
        </div>
      </div>
    </section>
  );
}

/* ── Problem ────────────────────────────────────────────── */
const PROBLEMS = [
  {
    icon: Trash2,
    title: "The Subtraction Flaw",
    body: "Medical diets destroy the joy of eating by simply removing ingredients. Salt gone, sugar gone, pleasure gone. Food becomes compliance, not cuisine — and people quietly stop eating well.",
    stat: "40%",
    statNote: "diet-fatigue rate in restricted patients",
  },
  {
    icon: FileWarning,
    title: "The AI Hallucination Hazard",
    body: "Generative chatbots confidently suggest “Kala Namak” as a salt substitute — black salt is 37% sodium. For a hypertensive patient that suggestion isn't a bug, it's a danger. LLMs cannot be trusted with medical diets.",
    stat: "0",
    statNote: "safety graph in a vanilla LLM",
  },
  {
    icon: Flame,
    title: "The Thermodynamic Blindspot",
    body: "Every recipe app ignores chemistry: volatile flavour compounds evaporate at specific temperatures. Boil your umami-rich broth and the exact molecules meant to replace salt vanish before the first spoonful.",
    stat: "100°C",
    statNote: "where guanylates die in a rolling boil",
  },
];

function Problem() {
  return (
    <section id="platform" className="relative mx-auto max-w-7xl px-5 py-28 lg:px-8">
      <Reveal><SectionTag n="01" label="The invisible epidemic" /></Reveal>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <h2 className="text-balance font-display text-4xl font-medium leading-[1.05] text-cream md:text-5xl">
              Restriction is easy.
              <br />
              <span className="italic text-bone">Flavor is physics.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-bone">
              Hypertension, diabetes, chemotherapy-induced dysgeusia, aging palates —
              millions eat against their own biology. The industry answer is subtraction.
              Subtraction has a 40% failure rate, because it removes the thing the brain
              actually wants: the flavor event.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex items-end gap-5">
              <span className="font-display text-[88px] font-medium leading-none text-bio">40<span className="text-5xl">%</span></span>
              <span className="pb-3 max-w-[180px] text-[13px] leading-snug text-dim">
                of restricted patients abandon their medical diet within a year — diet fatigue is measurable, and it is mass
              </span>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <motion.article
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="group relative overflow-hidden rounded-3xl border border-bio/10 bg-ink-3 p-7 md:p-8"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-bio/5 blur-2xl transition-opacity group-hover:bg-bio/10" />
                <div className="flex items-start justify-between gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-bio/20 bg-bio/10">
                    <p.icon className="h-5.5 w-5.5 text-bio" strokeWidth={1.7} />
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl text-cream/85">{p.stat}</div>
                    <div className="caption mt-1 max-w-[150px] text-[9px] leading-relaxed text-dim">{p.statNote}</div>
                  </div>
                </div>
                <h3 className="mt-5 font-display text-2xl text-cream">{p.title}</h3>
                <p className="mt-3 max-w-xl leading-relaxed text-bone">{p.body}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingHero() {
  return (
    <>
      <Nav />
      <Hero />
      <Problem />
    </>
  );
}

export { SectionTag, Scale };
