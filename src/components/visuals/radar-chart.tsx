"use client";

/**
 * FlavorRadar — 6-axis flavor signature.
 * Two overlapping polygons: the original (restricted) profile vs the
 * Jury's augmented profile. Hover a vertex for exact values.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import type { RadarData } from "@/lib/types";

const AXIS_LABEL: Record<string, string> = {
  umami: "Umami", sweet: "Sweet", sour: "Sour",
  bitter: "Bitter", salty: "Salty", trigeminal: "Trigeminal",
};

export default function FlavorRadar({ data, size = 300 }: { data: RadarData; size?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const cx = size / 2, cy = size / 2 + 4;
  const R = size / 2 - 40;
  const n = data.axes.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, v: number) => ({
    x: cx + Math.cos(angle(i)) * R * (v / 100),
    y: cy + Math.sin(angle(i)) * R * (v / 100),
  });

  const poly = (vals: number[]) => vals.map((v, i) => { const p = pt(i, v); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");

  return (
    <div className="relative mx-auto" style={{ width: size, height: size + 8 }}>
      <svg width={size} height={size} role="img" aria-label="Flavor profile radar comparing original and augmented profiles">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#0f9d68" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0f9d68" stopOpacity="0.07" />
          </radialGradient>
        </defs>

        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <polygon
            key={f}
            points={data.axes.map((_, i) => { const p = pt(i, f * 100); return `${p.x},${p.y}`; }).join(" ")}
            fill="none" stroke="rgba(14,122,82,0.14)" strokeWidth="1"
          />
        ))}
        {/* spokes */}
        {data.axes.map((_, i) => { const p = pt(i, 100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(14,122,82,0.14)" />; })}

        {/* original — dashed ember outline */}
        <motion.polygon
          points={poly(data.original)}
          fill="rgba(217,119,6,0.09)" stroke="#d97706" strokeWidth="1.6" strokeDasharray="5 4"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* augmented — bio green */}
        <motion.polygon
          points={poly(data.augmented)}
          fill="url(#radarFill)" stroke="#0f9d68" strokeWidth="2.2"
          initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${cy}px`, filter: "drop-shadow(0 4px 10px rgba(14,122,82,0.3))" }}
        />

        {/* vertices + hover targets */}
        {data.augmented.map((v, i) => {
          const p = pt(i, v);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={hover === i ? 5.5 : 3.4} fill="#ffffff" stroke="#0f9d68" strokeWidth="2" className="transition-all" />
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            </g>
          );
        })}

        {/* labels */}
        {data.axes.map((a, i) => {
          const p = pt(i, 118);
          return (
            <text
              key={a}
              x={p.x} y={p.y + 3}
              textAnchor={p.x > cx + 6 ? "start" : p.x < cx - 6 ? "end" : "middle"}
              className="fill-[#3f574a] caption"
              fontSize="9"
              fontFamily="var(--font-plex-mono), monospace"
              letterSpacing="1.5"
            >
              {AXIS_LABEL[a]?.toUpperCase() ?? a.toUpperCase()}
            </text>
          );
        })}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-bio/25 bg-ink-2/95 px-3 py-2 text-center shadow-xl"
          style={{ left: pt(hover, data.augmented[hover]).x, top: pt(hover, data.augmented[hover]).y - 12 }}
        >
          <div className="caption text-dim">{AXIS_LABEL[data.axes[hover]]}</div>
          <div className="text-[11px] text-bone">original <b className="text-amber">{data.original[hover]}</b> → augmented <b className="text-bio">{data.augmented[hover]}</b></div>
        </div>
      )}

      <div className="mt-1 flex items-center justify-center gap-5">
        <span className="flex items-center gap-1.5 text-[11px] text-bone"><span className="h-0 w-3 border-t-2 border-dashed border-amber" /> Original</span>
        <span className="flex items-center gap-1.5 text-[11px] text-bone"><span className="h-0 w-3 border-t-2 border-bio" /> Augmented</span>
      </div>
    </div>
  );
}
