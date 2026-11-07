"use client";

/**
 * Bespoke data-visualisation kit.
 * Hand-drawn SVG — no chart library, no default aesthetics.
 * Every chart animates in, responds to hover, and matches the
 * biotech-editorial language.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── width observer ─────────────────────────────────────── */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(560);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((es) => {
      const cw = es[0].contentRect.width;
      if (cw > 0) setW(cw);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, w };
}

/* ── CountUp ────────────────────────────────────────────── */
export function CountUp({ to, duration = 1400, suffix = "", className = "" }: { to: number; duration?: number; suffix?: string; className?: string }) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span className={className}>{v}{suffix}</span>;
}

/* ── ScoreRing — the big verdict number ─────────────────── */
export function ScoreRing({ value, size = 190, stroke = 10, label = "Sensory Illusion Score" }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2 - 14;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f9d68" />
            <stop offset="100%" stopColor="#65a30d" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,122,82,0.12)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: "drop-shadow(0 6px 14px rgba(14,122,82,0.35))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-6xl leading-none text-cream">
          <CountUp to={value} suffix="%" />
        </span>
        <span className="caption mt-2 max-w-[120px] text-center text-dim normal-case tracking-[0.14em]">{label}</span>
      </div>
    </div>
  );
}

/* ── LineChart ──────────────────────────────────────────── */
export interface LinePoint { label: string; value: number; meta?: string }

export function LineChart({
  data, height = 180, color = "#0f9d68", area = true, yMin, yMax, format = (v: number) => `${v}%`, unitLabel,
}: {
  data: LinePoint[]; height?: number; color?: string; area?: boolean;
  yMin?: number; yMax?: number; format?: (v: number) => string; unitLabel?: string;
}) {
  const { ref, w } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const padL = 38, padR = 14, padT = 14, padB = 26;
  const iw = Math.max(80, w - padL - padR), ih = height - padT - padB;

  const lo = yMin ?? Math.max(0, Math.floor((Math.min(...data.map((d) => d.value)) - 6) / 10) * 10);
  const hi = yMax ?? Math.min(100, Math.ceil((Math.max(...data.map((d) => d.value)) + 6) / 10) * 10);

  const pts = useMemo(() => data.map((d, i) => ({
    x: padL + (iw * i) / Math.max(1, data.length - 1),
    y: padT + ih - ((d.value - lo) / Math.max(1, hi - lo)) * ih,
  })), [data, iw, ih, lo, hi, padL, padT]);

  if (data.length === 0) return <div ref={ref} className="flex h-40 items-center justify-center text-sm text-dim">No data yet</div>;

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${path} L${pts[pts.length - 1].x.toFixed(1)},${padT + ih} L${pts[0].x.toFixed(1)},${padT + ih} Z`;
  const gid = `lg-${color.replace("#", "")}-${height}`;

  return (
    <div ref={ref} className="relative w-full select-none" onMouseLeave={() => setHover(null)}>
      <svg width={w} height={height} role="img" aria-label={unitLabel ?? "line chart"}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[lo, (lo + hi) / 2, hi].map((v, i) => {
          const y = padT + ih - ((v - lo) / Math.max(1, hi - lo)) * ih;
          return (
            <g key={i}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="rgba(14,122,82,0.1)" strokeDasharray="3 5" />
              <text x={padL - 8} y={y + 3.5} textAnchor="end" className="fill-[#5d7163]" fontSize="9.5" fontFamily="var(--font-plex-mono), monospace">{format(v)}</text>
            </g>
          );
        })}
        {area && <motion.path d={areaPath} fill={`url(#${gid})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />}
        <motion.path
          d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 3px 8px ${color}44)` }}
        />
        {hover !== null && (
          <g>
            <line x1={pts[hover].x} x2={pts[hover].x} y1={padT} y2={padT + ih} stroke="rgba(14,122,82,0.35)" />
            <circle cx={pts[hover].x} cy={pts[hover].y} r="5.5" fill="#ffffff" stroke={color} strokeWidth="2.4" />
          </g>
        )}
        {data.map((d, i) =>
          i % Math.ceil(data.length / 7) === 0 || i === data.length - 1 ? (
            <text key={i} x={pts[i].x} y={height - 8} textAnchor="middle" className="fill-[#5d7163]" fontSize="9.5" fontFamily="var(--font-plex-mono), monospace">{d.label}</text>
          ) : null
        )}
        {/* hit areas */}
        {data.map((_, i) => (
          <rect
            key={i}
            x={pts[i].x - (iw / Math.max(1, data.length)) / 2}
            y={padT}
            width={iw / Math.max(1, data.length)}
            height={ih}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-bio/20 bg-ink-2/95 px-3 py-2 shadow-xl backdrop-blur"
          style={{ left: pts[hover].x, top: pts[hover].y - 10 }}
        >
          <div className="caption text-dim">{data[hover].label}</div>
          <div className="font-display text-lg leading-tight text-bio">{format(data[hover].value)}</div>
          {data[hover].meta && <div className="max-w-44 text-[11px] leading-snug text-bone">{data[hover].meta}</div>}
        </div>
      )}
    </div>
  );
}

/* ── Horizontal bars ────────────────────────────────────── */
export function HBars({ items, color = "#0f9d68", unit = "×" }: { items: { label: string; value: number }[]; color?: string; unit?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={it.label} className="group">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="truncate text-[13px] text-bone group-hover:text-cream">{it.label}</span>
            <span className="caption text-dim">{it.value}{unit}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ink-4">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${(it.value / max) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Stacked area ───────────────────────────────────────── */
export function StackedArea({
  labels, seriesA, seriesB, labelA = "Trigeminal", labelB = "Gustatory", height = 190,
}: {
  labels: string[]; seriesA: number[]; seriesB: number[]; labelA?: string; labelB?: string; height?: number;
}) {
  const { ref, w } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const padL = 34, padR = 12, padT = 12, padB = 24;
  const iw = Math.max(80, w - padL - padR), ih = height - padT - padB;
  const n = labels.length;
  const hi = 100;

  const px = (i: number) => padL + (iw * i) / Math.max(1, n - 1);
  const py = (v: number) => padT + ih - (Math.min(hi, v) / hi) * ih;

  const aPath = seriesA.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" ") + ` L${px(n - 1)},${py(0)} L${px(0)},${py(0)} Z`;
  const bPath = seriesA.map((_, i) => {
    const y = py(Math.min(hi, seriesA[i] + seriesB[i]));
    return `${i === 0 ? "M" : "L"}${px(i)},${y}`;
  }).join(" ") + ` L${px(n - 1)},${py(0)} L${px(0)},${py(0)} Z`;

  return (
    <div ref={ref} className="relative w-full select-none" onMouseLeave={() => setHover(null)}>
      <svg width={w} height={height} role="img" aria-label="trigeminal vs gustatory balance">
        <defs>
          <linearGradient id="saA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="saB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f9d68" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#0f9d68" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={py(v)} y2={py(v)} stroke="rgba(14,122,82,0.1)" strokeDasharray="3 5" />
            <text x={padL - 7} y={py(v) + 3.5} textAnchor="end" className="fill-[#5d7163]" fontSize="9.5" fontFamily="var(--font-plex-mono), monospace">{v}</text>
          </g>
        ))}
        <motion.path d={bPath} fill="url(#saB)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.35 }} />
        <motion.path d={aPath} fill="url(#saA)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.15 }} />
        <motion.path
          d={seriesB.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(Math.min(hi, seriesA[i] + seriesB[i]))}`).join(" ")}
          fill="none" stroke="#0f9d68" strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.4 }}
        />
        <motion.path d={seriesA.map((v, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(v)}`).join(" ")} fill="none" stroke="#8b5cf6" strokeWidth="1.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }} />
        {hover !== null && <line x1={px(hover)} x2={px(hover)} y1={padT} y2={padT + ih} stroke="rgba(20,37,27,0.2)" />}
        {labels.map((l, i) =>
          i % Math.ceil(n / 6) === 0 || i === n - 1 ? (
            <text key={i} x={px(i)} y={height - 6} textAnchor="middle" className="fill-[#5d7163]" fontSize="9.5" fontFamily="var(--font-plex-mono), monospace">{l}</text>
          ) : null
        )}
        {seriesA.map((_, i) => (
          <rect key={i} x={px(i) - (iw / Math.max(1, n)) / 2} y={padT} width={iw / Math.max(1, n)} height={ih} fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-bio/20 bg-ink-2/95 px-3 py-2 shadow-xl" style={{ left: px(hover), top: py(seriesA[hover]) - 8 }}>
          <div className="caption text-dim">{labels[hover]}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-bone"><span className="h-1.5 w-1.5 rounded-full bg-violet" /> {labelA}: <b className="text-cream">{seriesA[hover]}</b></div>
          <div className="flex items-center gap-1.5 text-[11px] text-bone"><span className="h-1.5 w-1.5 rounded-full bg-bio" /> {labelB}: <b className="text-cream">{seriesB[hover]}</b></div>
        </div>
      )}
      <div className="mt-2 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-[11px] text-bone"><span className="h-1.5 w-3 rounded-full bg-violet" /> {labelA}</span>
        <span className="flex items-center gap-1.5 text-[11px] text-bone"><span className="h-1.5 w-3 rounded-full bg-bio" /> {labelB}</span>
      </div>
    </div>
  );
}
