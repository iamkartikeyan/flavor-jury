"use client";

/**
 * Landing — Solution anatomy, the deliberation process, live verdict preview,
 * who it's for, the research wall, and the final call to the Jury Room.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Cpu, FlaskConical, Radar, Thermometer, Quote } from "lucide-react";
import SensoryFigure from "@/components/visuals/sensory-figure";
import { Logo } from "@/components/visuals/logo";
import LandingHero from "@/components/landing/landing-hero";
import { Reveal, SectionTag } from "@/components/landing/landing-hero";
import { useJury } from "@/lib/store";

/* ── Solution ───────────────────────────────────────────── */
const METRICS = [
  { value: "0mg", label: "Sodium / Sugar", note: "what we remove", color: "text-bio" },
  { value: "94%", label: "Sensory Illusion", note: "what the brain still perceives", color: "text-lime" },
  { value: "100%", label: "Dopamine Release", note: "the result at the table", color: "text-violet" },
];

function Solution() {
  return (
    <section id="science" className="relative mx-auto max-w-7xl px-5 py-28 lg:px-8">
      <Reveal><SectionTag n="02" label="Cross-modal sensory illusion" /></Reveal>
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <h2 className="text-balance font-display text-4xl font-medium leading-[1.05] text-cream md:text-5xl">
              If taste buds fail,
              <br />
              <span className="italic text-bio">we hack the brain.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg leading-relaxed text-bone">
              Perception is a prediction machine. Feed it glutamate synergies, retronasal
              aroma volatiles and trigeminal texture signals, and it reconstructs the
              missing taste on its own. That is the Cross-Modal Sensory Illusion — a
              94% flavour experience built from 0 mg of the restricted molecule.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className="mt-8 space-y-3.5 text-[15px] text-bone">
              {[
                ["Olfactory routing", "aroma volatiles carry the identity of the missing taste"],
                ["Trigeminal substitution", "texture, warmth and tingle replace lost intensity"],
                ["Dopamine closure", "the brain completes the pattern — satisfaction arrives"],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bio" />
                  <span><b className="text-cream">{t}</b> — {d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {METRICS.map((m, i) => (
              <Reveal key={m.label} delay={0.2 + i * 0.08}>
                <div className="rounded-2xl border border-bio/10 bg-ink-3 p-4 md:p-5">
                  <div className={`font-display text-3xl md:text-4xl ${m.color}`}>{m.value}</div>
                  <div className="caption mt-2 text-cream/80">{m.label}</div>
                  <div className="mt-1 text-[11px] leading-snug text-dim">{m.note}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.15} className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(14,122,82,0.08),transparent_65%)]" />
          <SensoryFigure />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Process ────────────────────────────────────────────── */
const PROCESS = [
  {
    icon: FlaskConical,
    role: "FlavorDB — The Chemist",
    body: "Maps the exact volatile compound profile of the missing taste: umami glutamates, citric acids, trigeminal stimulants. Every molecule carries its evaporation temperature.",
    code: "GET /api/compound/synergy?target=umami&restrict=sodium",
  },
  {
    icon: Cpu,
    role: "The Math Engine — Illusion Score",
    body: "Computes the probability that substitute compounds will trigger identical neural receptors, then verifies every candidate against the medical safety graph. Target: >90% illusion.",
    viz: true,
  },
  {
    icon: Thermometer,
    role: "RecipeDB — The Physicist",
    body: "Fetches the base protocol and executes Thermodynamic Instruction Rewriting. If the target compound dies above 100°C, the pan is never allowed to reach 100°C.",
    code: "OVERRIDE: 120°C → 85°C · reason: preserve guanylate volatiles",
  },
];

function ScoreMiniViz() {
  const bars = [78, 85, 88, 91, 93, 94];
  return (
    <div className="mt-4 flex h-16 items-end gap-1.5" aria-hidden>
      {bars.map((v, i) => (
        <motion.div
          key={i}
          className="relative flex-1 rounded-t-sm bg-gradient-to-t from-bio/25 to-bio"
          initial={{ height: 4 }}
          whileInView={{ height: `${(v / 100) * 64}px` }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {i === bars.length - 1 && (
            <span className="caption absolute -top-6 right-0 text-bio">{v}%</span>
          )}
        </motion.div>
      ))}
      <span className="caption absolute right-0 -bottom-6 text-dim">score optimisation loop</span>
    </div>
  );
}

function Process() {
  return (
    <section className="relative border-y border-bio/10 bg-ink-2/40">
      <div className="mx-auto max-w-5xl px-5 py-28 lg:px-8">
        <Reveal><SectionTag n="03" label="The jury's deliberation process" /></Reveal>
        <Reveal>
          <h2 className="text-balance max-w-2xl font-display text-4xl font-medium leading-[1.05] text-cream md:text-5xl">
            Three specialists argue.
            <br />
            <span className="italic text-bio">One verdict is served.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <span className="absolute bottom-8 left-[27px] top-2 hidden w-px bg-gradient-to-b from-bio/40 via-bio/15 to-transparent md:block" aria-hidden />
          <div className="space-y-12">
            {PROCESS.map((p, i) => (
              <Reveal key={p.role} delay={i * 0.06}>
                <div className="relative flex flex-col gap-5 md:flex-row md:gap-8">
                  <div className="flex shrink-0 items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-bio/25 bg-ink-3">
                      <p.icon className="h-6 w-6 text-bio" strokeWidth={1.6} />
                    </div>
                    <span className="caption hidden text-dim md:block">STEP {i + 1}</span>
                  </div>
                  <div className="flex-1 rounded-2xl border border-bio/10 bg-ink-3/70 p-6 md:p-7">
                    <h3 className="font-display text-xl text-cream md:text-2xl">{p.role}</h3>
                    <p className="mt-2.5 max-w-2xl leading-relaxed text-bone">{p.body}</p>
                    {p.code && (
                      <code className="caption mt-4 block truncate rounded-lg border border-line bg-ink px-3.5 py-2.5 text-[10.5px] text-bio/90">
                        {p.code}
                      </code>
                    )}
                    {p.viz && (
                      <div className="relative pb-8">
                        <ScoreMiniViz />
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Live demo preview (parallax) ───────────────────────── */
function DemoPreview() {
  const setView = useJury((s) => s.setView);
  const profile = useJury((s) => s.profile);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yLeft = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yRight = useTransform(scrollYProgress, [0, 1], [110, -70]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal><SectionTag n="04" label="See the verdict" /></Reveal>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <Reveal>
              <h2 className="text-balance font-display text-4xl font-medium leading-[1.05] text-cream md:text-5xl">
                A verdict you can
                <br />
                <span className="italic text-bio">actually cook.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md leading-relaxed text-bone">
                Every deliberation ends in a medical-grade plate: the molecular hack,
                the exact quantities, the rewritten temperatures — and a score that
                tells you how whole it will taste.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <button
                onClick={() => setView(profile ? "deliberation" : "onboarding")}
                className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-bio/30 px-6 py-3 text-[14.5px] text-bio transition-all hover:bg-bio/10"
              >
                Run your own deliberation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Reveal>
          </div>

          <motion.div style={{ y: yRight }} className="relative">
            <motion.div style={{ y: yLeft }} className="relative mx-auto max-w-lg rounded-3xl border border-bio/15 bg-ink-3 shadow-[0_40px_80px_-40px_rgba(20,37,27,0.35)]">
              <div className="flex items-center justify-between border-b border-bio/10 px-6 py-4">
                <div>
                  <div className="caption text-dim">DELIBERATION #2847 · CONFIDENCE HIGH</div>
                  <h3 className="mt-1 font-display text-2xl text-cream">Neuro-Augmented Tomato Bisque</h3>
                </div>
                <Radar className="h-5 w-5 text-bio" />
              </div>
              <div className="grid gap-6 p-6 sm:grid-cols-[auto_1fr]">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-bio/20 bg-bio/5 px-6 py-5">
                  <span className="font-display text-5xl text-bio">94<span className="text-2xl">%</span></span>
                  <span className="caption mt-1.5 text-center text-[8.5px] text-dim">Sensory Illusion Score</span>
                </div>
                <div>
                  <div className="caption mb-3 text-bio/90">MOLECULAR HACK</div>
                  <ul className="space-y-2.5 text-[13px]">
                    {[
                      ["Guanylates", "from Shiitake Powder · 2g"],
                      ["Glutamates", "from Roasted Tomato · 2g"],
                      ["Citric Acid", "from Lemon · ½ fruit"],
                    ].map(([n, d]) => (
                      <li key={n} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-bio" />
                        <span className="text-cream">{n}</span>
                        <span className="truncate text-dim">· {d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mx-6 mb-6 rounded-2xl border border-amber/35 bg-amber/5 p-4">
                <div className="caption flex items-center gap-2 text-amber">
                  <Thermometer className="h-3.5 w-3.5" /> Thermodynamic override
                </div>
                <div className="mt-2 text-[13px] leading-relaxed">
                  <s className="text-dim">Boil at 120°C for 10 minutes</s>
                  <span className="ml-2 font-semibold text-amber">Simmer at 85°C for 15 minutes</span>
                </div>
                <p className="mt-1.5 text-[11.5px] leading-snug text-dim">
                  Preserves guanylate volatiles — they evaporate above 100°C and never reach the olfactory bulb.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Target users ───────────────────────────────────────── */
const USERS = [
  {
    title: "Oncology Patients",
    body: "Chemotherapy-induced dysgeusia makes food taste like metal and cardboard. We route flavour around the broken taste buds — through trigeminal stimulation and aroma — and restore the joy of eating during treatment.",
    tag: "Dysgeusia · Taste loss",
  },
  {
    title: "Metabolic Restrictions",
    body: "Hypertension and diabetes demand bland plates — or do they? The Jury rebuilds saltiness from umami chemistry and sweetness from aroma esters, holding the line at 0 mg sodium and 0 g added sugar.",
    tag: "Hypertension · Diabetes",
  },
  {
    title: "Aging Population",
    body: "After 60, olfactory and gustatory senses fade together — and malnutrition follows quietly. Bio-adaptive meals keep elderly palates stimulated, interested and properly fed.",
    tag: "Aging palates",
  },
];

function Users() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
      <Reveal><SectionTag n="05" label="Who needs the jury" /></Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {USERS.map((u, i) => (
          <Reveal key={u.title} delay={i * 0.08}>
            <motion.article
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="flex h-full flex-col rounded-3xl border border-bio/10 bg-gradient-to-b from-ink-3 to-ink-2 p-7"
            >
              <span className="caption w-fit rounded-full border border-bio/20 px-3 py-1 text-[9px] text-bio">{u.tag}</span>
              <h3 className="mt-5 font-display text-2xl text-cream">{u.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-bone">{u.body}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-dim">
                <span className="h-px w-6 bg-bio/40" /> served by the same engine
              </span>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Research wall ──────────────────────────────────────── */
const PAPERS = [
  { venue: "CoSy Lab · IIIT Delhi", title: "Bagler, G. et al. — “Computational gastronomy: A data science approach to food.”" },
  { venue: "Nature · 2011", title: "Ahn, Y.-Y. et al. — “Flavor network and the principles of food pairing.”" },
  { venue: "Journal of Neuroscience", title: "Cross-modal sensory compensation in chemotherapy-induced dysgeusia patients." },
  { venue: "Chemical Senses Journal", title: "Trigeminal nerve stimulation as a substitute for gustatory loss." },
];

function Research() {
  return (
    <section id="research" className="border-y border-bio/10 bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
        <Reveal><SectionTag n="06" label="Backed by hard science" /></Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <h2 className="font-display text-4xl font-medium leading-[1.05] text-cream md:text-5xl">
              Not vibes.
              <br />
              <span className="italic text-bio">Peer review.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-bone">
              The engine stands on published work in computational gastronomy and
              multisensory perception. Every illusion is a hypothesis with a citation.
            </p>
          </Reveal>
          <div className="space-y-3">
            {PAPERS.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="group flex cursor-default items-center gap-5 rounded-2xl border border-bio/10 bg-ink-3 px-6 py-5 transition-colors hover:border-bio/30"
                >
                  <Quote className="h-5 w-5 shrink-0 text-bio/60" />
                  <div className="min-w-0 flex-1">
                    <div className="caption text-[9px] text-dim">{p.venue}</div>
                    <div className="mt-1 leading-snug text-cream">{p.title}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-dim transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bio" />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA + footer ─────────────────────────────────── */
function FinalCTA() {
  const setView = useJury((s) => s.setView);
  const profile = useJury((s) => s.profile);
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(14,122,82,0.1),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-5 py-32 text-center lg:px-8">
        <Reveal>
          <h2 className="text-balance font-display text-4xl font-medium leading-[1.06] text-cream md:text-6xl">
            From computational gastronomy
            <br />
            to <span className="italic text-bio">computational healing.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-bone">
            Join us in rewriting the biological experience of food — one verdict, one plate, one person at a time.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <button
            onClick={() => setView(profile ? "dashboard" : "onboarding")}
            className="group relative mt-10 overflow-hidden rounded-full bg-bio px-10 py-4.5 text-[16px] font-semibold text-ink shadow-[0_18px_48px_-14px_rgba(14,122,82,0.6)] transition-all hover:shadow-[0_22px_60px_-14px_rgba(14,122,82,0.7)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter the Jury Room
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-bio/10 bg-ink-2/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-9 md:flex-row lg:px-8">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <nav className="caption flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-dim" aria-label="Footer">
          {["Science", "Platform", "Research", "GitHub", "Contact"].map((l) => (
            <a key={l} href={l === "Science" ? "#science" : l === "Research" ? "#research" : "#platform"} className="transition-colors hover:text-bio">{l}</a>
          ))}
        </nav>
        <div className="caption text-dim">Built for Foodoscope ForkIT 2026</div>
      </div>
      <div className="border-t border-bio/5">
        <div className="caption mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-[9px] text-dim/70 lg:px-8">
          <span>© 2026 Flavor Jury · IIIT Delhi</span>
          <span>Prototype — not a medical device. Always consult your clinician.</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="relative">
      <LandingHero />
      <Solution />
      <Process />
      <DemoPreview />
      <Users />
      <Research />
      <FinalCTA />
      <Footer />
    </div>
  );
}
