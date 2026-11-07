"use client";

/**
 * Flavor Jury — global state.
 * Single-source of truth for the biological profile, deliberation history,
 * app settings and view routing. Persisted to localStorage so the Jury
 * remembers you between sessions.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppSettings, DayStat, Deliberation, UserProfile, View } from "@/lib/types";
import { runDeliberation } from "@/lib/engine/engine";
import type { ConditionId, SpiceLevel } from "@/lib/types";

const DEFAULT_SETTINGS: AppSettings = {
  emailNotifications: true,
  recipeReminders: "weekly",
  healthTips: true,
  flavorDbKey: "fdb_live_9f3ce41b77a2d0e8",
  recipeDbKey: "rdb_live_2c88ba51fe049d13",
  cocktailDbKey: "cdb_live_71ad39c0b5f6e220",
};

const SEED_DISHES = [
  "Creamy Tomato Soup", "Butter Chicken", "Dal Tadka", "Margherita Pasta",
  "Grilled Salmon", "Mango Smoothie", "Hyderabadi Biryani", "Roasted Chickpea Bowl",
  "Khichdi", "Wok Fried Rice", "Morning Pancakes", "Chocolate Mousse",
];

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12 + (n % 5), 10 + n % 30, 0, 0);
  return d.toISOString();
}

function dateKey(d: Date | string): string {
  const x = typeof d === "string" ? new Date(d) : d;
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}

interface JuryState {
  view: View;
  profile: UserProfile | null;
  deliberations: Deliberation[];
  currentVerdict: Deliberation | null;
  settings: AppSettings;
  settingsTab: string;
  dailyStats: DayStat[];
  hasSeeded: boolean;
  seq: number;

  setView: (v: View) => void;
  openSettings: (tab: string) => void;
  saveProfile: (p: UserProfile) => void;
  completeOnboarding: (p: UserProfile) => void;
  addDeliberation: (d: Deliberation) => void;
  setCurrentVerdict: (d: Deliberation | null) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  updateFeedback: (id: string, fb: { rating?: number; helpful?: boolean }) => void;
  resetAll: () => void;
  hasProfile: () => boolean;
}

export const useJury = create<JuryState>()(
  persist(
    (set, get) => ({
      view: "landing",
      profile: null,
      deliberations: [],
      currentVerdict: null,
      settings: DEFAULT_SETTINGS,
      settingsTab: "personal",
      dailyStats: [],
      hasSeeded: false,
      seq: 1,

      setView: (v) => set({ view: v }),

      openSettings: (tab) => set({ settingsTab: tab, view: "settings" }),

      saveProfile: (p) => set({ profile: p }),

      completeOnboarding: (p) => {
        /* seed 30 days of biological history so the charts live immediately */
        const state = get();
        if (state.hasSeeded) {
          set({ profile: p, view: "dashboard" });
          return;
        }
        const conditions: ConditionId[] = p.conditions.length
          ? p.conditions.filter((c) => c !== "custom")
          : ["hypertension", "dysgeusia"];
        const pantry = p.pantry.length ? p.pantry : ["Olive Oil", "Garlic", "Onion", "Lemon", "Black Pepper", "Cumin", "Tomato", "Rice"];

        const deliberations: Deliberation[] = [];
        let seq = 2831;
        let dSeq = 1;
        const spiceCycle: SpiceLevel[] = ["medium", "hot", "mild", "extra_hot", "medium", "hot"];
        for (let i = 29; i >= 0; i--) {
          if (i % 13 === 4 || i % 17 === 9) continue; // rest days — realism
          const dish = SEED_DISHES[(i * 5 + 3) % SEED_DISHES.length];
          /* rotate spice so the trigeminal strategy — and therefore the
             compound tally — varies across the month */
          const res = runDeliberation(
            {
              dish,
              constraints: conditions,
              pantry,
              servings: 2,
              flexible: true,
              spice: spiceCycle[i % spiceCycle.length],
              textures: p.textures,
              cuisines: p.cuisines,
            },
            dSeq++
          );
          /* recency bias: the user is getting better at this — scores climb */
          const boost = Math.round((29 - i) * 0.22);
          const score = Math.min(97, res.deliberation.score + boost);
          deliberations.push({
            ...res.deliberation,
            score,
            dopamineIndex: Math.round(score * 0.7 + res.deliberation.trigeminalIndex * 0.3),
            id: `demo-${seq}`,
            number: seq++,
            createdAt: daysAgoISO(i),
          });
        }

        const stats: DayStat[] = [];
        for (let i = 29; i >= 0; i--) {
          const dayDelibs = deliberations.filter((d) => dateKey(d.createdAt) === dateKey(daysAgoISO(i)));
          const base = 100 - (i < 8 ? 2 : i < 18 ? 5 : 9) - ((i * 7) % 6);
          const compliance = Math.max(62, Math.min(100, base + (dayDelibs.length ? 4 : -2)));
          const last = dayDelibs[dayDelibs.length - 1];
          const prev = dayDelibs.length > 1 ? dayDelibs[dayDelibs.length - 2] : last;
          stats.push({
            date: dateKey(daysAgoISO(i)),
            compliance,
            score: (last ?? prev)?.score ?? Math.round(84 + (29 - i) * 0.3),
            overrides: dayDelibs.reduce((a, d) => a + d.overrides.length, 0) || (i % 3 === 0 ? 1 : 0),
            trigeminal: (last ?? prev)?.trigeminalIndex ?? 62,
            gustatory: (last ?? prev)?.score ?? 74,
          });
        }

        set({
          profile: p,
          deliberations,
          dailyStats: stats,
          hasSeeded: true,
          seq: 1,
          view: "dashboard",
        });
      },

      addDeliberation: (d) => {
        set((s) => ({
          deliberations: [d, ...s.deliberations],
          currentVerdict: d,
          view: "verdict",
          seq: s.seq + 1,
        }));
        /* fold today's result into daily stats */
        set((s) => {
          const key = dateKey(d.createdAt);
          const stats = [...s.dailyStats];
          const idx = stats.findIndex((x) => x.date === key);
          const entry: DayStat = {
            date: key,
            compliance: Math.min(100, 92 + Math.round(d.score / 25)),
            score: d.score,
            overrides: (idx >= 0 ? stats[idx].overrides : 0) + d.overrides.length,
            trigeminal: d.trigeminalIndex,
            gustatory: d.score,
          };
          if (idx >= 0) stats[idx] = entry; else stats.push(entry);
          return { dailyStats: stats };
        });
      },

      setCurrentVerdict: (d) => set({ currentVerdict: d, view: "verdict" }),

      updateSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),

      updateFeedback: (id, fb) =>
        set((s) => ({
          deliberations: s.deliberations.map((d) =>
            d.id === id
              ? { ...d, feedback: { rating: fb.rating ?? d.feedback?.rating ?? 0, helpful: fb.helpful ?? d.feedback?.helpful ?? null } }
              : d
          ),
          currentVerdict:
            s.currentVerdict && s.currentVerdict.id === id
              ? { ...s.currentVerdict, feedback: { rating: fb.rating ?? s.currentVerdict.feedback?.rating ?? 0, helpful: fb.helpful ?? s.currentVerdict.feedback?.helpful ?? null } }
              : s.currentVerdict,
        })),

      resetAll: () =>
        set({
          view: "landing",
          profile: null,
          deliberations: [],
          currentVerdict: null,
          dailyStats: [],
          hasSeeded: false,
          seq: 1,
          settings: DEFAULT_SETTINGS,
        }),

      hasProfile: () => Boolean(get().profile),
    }),
    {
      name: "flavor-jury-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profile: s.profile,
        deliberations: s.deliberations,
        settings: s.settings,
        dailyStats: s.dailyStats,
        hasSeeded: s.hasSeeded,
        seq: s.seq,
      }),
    }
  )
);

/* ── derived helpers ─────────────────────────────────────── */

export function avgScore(delibs: Deliberation[]): number {
  if (delibs.length === 0) return 0;
  return Math.round(delibs.reduce((a, d) => a + d.score, 0) / delibs.length);
}

export function weekScore(delibs: Deliberation[]): number {
  const now = Date.now();
  const week = delibs.filter((d) => now - new Date(d.createdAt).getTime() < 7 * 864e5);
  return avgScore(week.length ? week : delibs.slice(0, 3));
}

export function compoundTally(delibs: Deliberation[]): { name: string; count: number }[] {
  const m = new Map<string, number>();
  for (const d of delibs) {
    for (const c of d.compounds) m.set(c.name, (m.get(c.name) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
