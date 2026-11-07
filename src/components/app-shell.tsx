"use client";

/**
 * AppShell — single-route view orchestrator.
 * Public views (landing / onboarding) render full-bleed; app views render
 * inside the sidebar layout. Guards: app views require a biological profile.
 */

import { useEffect, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useJury } from "@/lib/store";
import Sidebar from "@/components/shared/sidebar";
import { JuryMark } from "@/components/visuals/logo";

import LandingPage from "@/components/landing/landing-page";
import OnboardingFlow from "@/components/onboarding/onboarding-flow";
import DashboardView from "@/components/dashboard/dashboard-view";
import DeliberationView from "@/components/deliberation/deliberation-view";
import VerdictView from "@/components/verdict/verdict-view";
import VisualizerView from "@/components/visualizer/visualizer-view";
import LogsView from "@/components/settings/logs-view";
import SettingsView from "@/components/settings/settings-view";

const emptySubscribe = () => () => {};

function BootScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink">
      <div className="animate-breathe"><JuryMark size={54} /></div>
      <p className="caption text-dim">Convening the Jury…</p>
    </div>
  );
}

const APP_VIEWS = new Set(["dashboard", "deliberation", "verdict", "visualizer", "logs", "settings"]);

export default function AppShell() {
  /* hydration gate: server snapshot = false, client snapshot = true */
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const view = useJury((s) => s.view);
  const profile = useJury((s) => s.profile);
  const currentVerdict = useJury((s) => s.currentVerdict);

  useEffect(() => {
    if (mounted && APP_VIEWS.has(view) && !profile) {
      useJury.setState({ view: "onboarding" });
    }
  }, [mounted, view, profile]);

  if (!mounted) return <BootScreen />;

  /* sensible fallback: verdict with no payload */
  const safeView = view === "verdict" && !currentVerdict ? "dashboard" : view;

  const isPublic = safeView === "landing" || safeView === "onboarding";

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {isPublic ? (
          <motion.div
            key={safeView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {safeView === "landing" ? <LandingPage /> : <OnboardingFlow />}
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen lg:pl-[248px]"
          >
            <Sidebar />
            <main className="min-h-[calc(100vh-57px)] lg:min-h-screen">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeView + (safeView === "settings" ? "" : "")}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  {safeView === "dashboard" && <DashboardView />}
                  {safeView === "deliberation" && <DeliberationView />}
                  {safeView === "verdict" && currentVerdict && <VerdictView deliberation={currentVerdict} />}
                  {safeView === "visualizer" && <VisualizerView />}
                  {safeView === "logs" && <LogsView />}
                  {safeView === "settings" && <SettingsView />}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
