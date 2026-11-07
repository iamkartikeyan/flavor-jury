"use client";

import dynamic from "next/dynamic";

/**
 * Flavor Jury — The Bio-Adaptive Sensory Augmentation Engine.
 * Single-route application: every view is orchestrated client-side
 * by AppShell (landing → onboarding → dashboard → verdict…).
 */
const AppShell = dynamic(() => import("@/components/app-shell"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-bio/20 border-t-bio" />
      <p className="caption text-dim">Convening the Jury…</p>
    </div>
  ),
});

export default function Home() {
  return <AppShell />;
}
