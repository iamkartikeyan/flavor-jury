"use client";

import { useJury } from "@/lib/store";
import { Logo } from "@/components/visuals/logo";
import {
  LayoutDashboard, FlaskConical, UserRoundCog, Thermometer,
  ChartNoAxesCombined, Settings, LogOut, X, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { View } from "@/lib/types";

const NAV: { view: View; label: string; icon: React.ElementType; primary?: boolean }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "deliberation", label: "New Deliberation", icon: FlaskConical, primary: true },
  { view: "settings", label: "My Sensory Profiles", icon: UserRoundCog },
  { view: "logs", label: "Thermodynamic Logs", icon: Thermometer },
  { view: "visualizer", label: "Visualizer", icon: ChartNoAxesCombined },
  { view: "settings", label: "Settings", icon: Settings },
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "FJ";
}

function NavList({ current, onNavigate }: { current: View; onNavigate: (v: View) => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {NAV.map((item, idx) => {
        const Icon = item.icon;
        /* "My Sensory Profiles" opens settings on the medical tab */
        const active = item.label === "My Sensory Profiles"
          ? false
          : current === item.view && item.label === "Settings" ? false : current === item.view;
        return (
          <button
            key={idx}
            onClick={() => onNavigate(item.view)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] transition-all duration-300",
              active
                ? "bg-bio/10 text-bio"
                : "text-bone hover:bg-ink-3 hover:text-cream",
              item.primary && "font-medium"
            )}
          >
            {item.primary && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-bio/40 px-1.5 py-px text-[8px] font-mono uppercase tracking-widest text-bio/90">
                core
              </span>
            )}
            <Icon className={cn("h-[17px] w-[17px] transition-colors", active ? "text-bio" : "text-dim group-hover:text-bone")} strokeWidth={1.8} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function ProfileChip({ onExit }: { onExit: () => void }) {
  const profile = useJury((s) => s.profile);
  if (!profile) return null;
  return (
    <div className="mt-auto rounded-2xl border border-bio/10 bg-ink-3 p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-bio to-lime font-display text-[13px] font-bold text-ink">
          {initials(profile.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-medium text-cream">{profile.name}</div>
          <div className="caption text-[8.5px] text-bio">Founder Access · ForkIT</div>
        </div>
      </div>
      <button
        onClick={onExit}
        className="caption mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line px-2 py-1.5 text-[9px] text-dim transition-colors hover:border-rose/40 hover:text-rose"
      >
        <LogOut className="h-3 w-3" /> Reset session
      </button>
    </div>
  );
}

export default function Sidebar() {
  const view = useJury((s) => s.view);
  const setView = useJury((s) => s.setView);
  const openSettings = useJury((s) => s.openSettings);
  const resetAll = useJury((s) => s.resetAll);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (v: View) => {
    if (v === "settings" && view !== "settings") openSettings("personal");
    else setView(v);
    setMobileOpen(false);
  };
  const goMedical = () => { openSettings("medical"); setMobileOpen(false); };

  return (
    <>
      {/* mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-bio/10 bg-ink/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo onClick={() => setView("dashboard")} />
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-line p-2 text-bone"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col border-r border-bio/10 bg-ink-2 p-5">
            <div className="flex items-center justify-between">
              <Logo onClick={() => { setView("dashboard"); setMobileOpen(false); }} />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-dim hover:text-cream"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-7"><NavList current={view} onNavigate={go} /></div>
            <button onClick={goMedical} className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] text-bone hover:bg-ink-3 hover:text-cream">
              <UserRoundCog className="h-[17px] w-[17px] text-dim" strokeWidth={1.8} /> Edit medical profile
            </button>
            <div className="mt-6"><ProfileChip onExit={resetAll} /></div>
          </aside>
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[248px] flex-col border-r border-bio/10 bg-ink-2/60 p-5 backdrop-blur-xl lg:flex">
        <Logo onClick={() => setView("dashboard")} />
        <div className="mt-8 flex flex-1 flex-col">
          <NavList current={view} onNavigate={go} />
          <button onClick={goMedical} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] text-bone hover:bg-ink-3 hover:text-cream">
            <UserRoundCog className="h-[17px] w-[17px] text-dim" strokeWidth={1.8} /> Edit medical profile
          </button>
          <ProfileChip onExit={resetAll} />
        </div>
      </aside>
    </>
  );
}
