"use client";

/**
 * Thermodynamic Logs — every temperature the Jury has ever rewritten.
 */

import { motion } from "framer-motion";
import { ArrowRight, Thermometer } from "lucide-react";
import { useJury } from "@/lib/store";
import type { OverrideRecord } from "@/lib/types";

export default function LogsView() {
  const deliberations = useJury((s) => s.deliberations);
  const setCurrentVerdict = useJury((s) => s.setCurrentVerdict);

  const logs: { delib: (typeof deliberations)[number]; record: OverrideRecord }[] = [];
  for (const d of deliberations) {
    for (const o of d.overrides) logs.push({ delib: d, record: o });
  }
  logs.sort((a, b) => new Date(b.delib.createdAt).getTime() - new Date(a.delib.createdAt).getTime());

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="caption text-amber">THERMODYNAMIC LOGS</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-cream md:text-5xl">The physics ledger<span className="text-amber">.</span></h1>
        <p className="mt-3 max-w-xl text-bone">
          Every time the Jury rewrote a temperature to keep volatile compounds alive. {logs.length} interventions on record.
        </p>
      </motion.div>

      {logs.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-bio/20 bg-ink-2/50 py-16 text-center">
          <Thermometer className="h-7 w-7 text-dim" />
          <p className="text-[14px] text-bone">No thermal interventions yet — your first deliberation will populate this ledger.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {logs.slice(0, 40).map(({ delib, record }, i) => (
            <motion.button
              key={record.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(0.4, i * 0.04) }}
              onClick={() => setCurrentVerdict(delib)}
              className="group grid w-full grid-cols-1 items-center gap-3 rounded-2xl border border-bio/10 bg-ink-3 px-5 py-4 text-left transition-colors hover:border-amber/40 sm:grid-cols-[auto_1fr_auto]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber/30 bg-amber/10">
                  <Thermometer className="h-4.5 w-4.5 text-amber" />
                </span>
                <span className="font-mono text-[13px] text-cream sm:hidden">{record.originalTemp}°C → {record.newTemp}°C</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] text-cream transition-colors group-hover:text-bio">{delib.dish}</span>
                <span className="caption mt-0.5 block text-[9px] text-dim">
                  #{delib.number} · {new Date(delib.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · preserving {record.compound} (evap {record.evapTemp}°C)
                </span>
              </span>
              <span className="hidden items-center gap-2.5 font-mono text-[13px] sm:flex">
                <s className="text-dim">{record.originalTemp}°C</s>
                <ArrowRight className="h-3.5 w-3.5 text-amber" />
                <b className="text-amber">{record.newTemp}°C</b>
                <span className="text-dim">· {record.originalTime}→{record.newTime} min</span>
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
