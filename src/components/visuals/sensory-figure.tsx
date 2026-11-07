"use client";

/**
 * SensoryFigure — the Cross-Modal Illusion, drawn.
 * A stylised head profile: the tongue signal fades out while the olfactory
 * bulb, trigeminal nerve and dopamine centre light up in sequence.
 * Pure SVG + CSS animation. looped, decorative-but-informative.
 */

import { motion } from "framer-motion";

const PULSES = [
  { label: "Olfactory Bulb — aroma takes over", delay: 0.4 },
  { label: "Trigeminal Nerve — texture & temperature", delay: 1.2 },
  { label: "Dopamine Center — the illusion lands", delay: 2.0 },
];

export default function SensoryFigure() {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center">
      <svg viewBox="0 0 420 470" className="w-full max-w-[430px]" role="img" aria-label="Diagram of cross-modal sensory compensation: tongue fades, olfactory bulb, trigeminal nerve and dopamine centre activate">
        <defs>
          <radialGradient id="glowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0f9d68" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#0f9d68" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0f9d68" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowV" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowL" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#84cc16" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="skinLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9f2e4" />
            <stop offset="100%" stopColor="#f5f9f3" />
          </linearGradient>
        </defs>

        {/* head profile */}
        <motion.path
          d="M212 452
             C 196 430, 182 412, 178 392
             C 175 372, 162 360, 150 350
             C 141 343, 138 331, 144 320
             C 138 315, 136 307, 142 300
             C 131 291, 127 280, 136 266
             C 122 257, 119 244, 132 236
             C 123 218, 123 199, 134 182
             C 120 162, 127 130, 152 108
             C 180 80, 232 70, 274 88
             C 318 108, 342 150, 344 198
             C 346 244, 334 288, 320 328
             C 311 368, 313 412, 319 452"
          fill="url(#skinLine)" fillOpacity="0.9" stroke="#2f7a56" strokeWidth="1.6"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />

        {/* brain silhouette */}
        <motion.path
          d="M172 210 C 162 176, 186 138, 226 126 C 268 114, 306 132, 316 168 C 326 204, 310 232, 284 244 C 256 256, 226 254, 206 244 C 190 236, 176 226, 172 210 Z"
          fill="none" stroke="rgba(14,122,82,0.3)" strokeWidth="1.3" strokeDasharray="4 4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
        />

        {/* tongue — fading out */}
        <motion.g initial={{ opacity: 0.85 }} animate={{ opacity: [0.85, 0.14, 0.85] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.55, 1] }}>
          <path d="M141 322 C 148 314, 162 312, 172 318 C 180 323, 180 332, 172 338 C 160 346, 148 342, 141 336 Z"
            fill="rgba(220,38,38,0.12)" stroke="rgba(220,38,38,0.65)" strokeWidth="1.4" />
          <line x1="134" y1="346" x2="186" y2="306" stroke="rgba(220,38,38,0.7)" strokeWidth="1.6" strokeLinecap="round" />
        </motion.g>

        {/* olfactory bulb */}
        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.75, 1] }}
          transition={{ duration: 2.4, delay: 0.5, repeat: Infinity, repeatDelay: 0.8 }}
        >
          <circle cx="152" cy="212" r="34" fill="url(#glowG)" />
          <circle cx="152" cy="212" r="7" fill="#0f9d68" />
          <path d="M152 212 C 150 240, 142 256, 136 266" fill="none" stroke="#0f9d68" strokeWidth="1.4" strokeDasharray="3 4" className="flow-dash" />
        </motion.g>

        {/* trigeminal branches */}
        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ duration: 2.4, delay: 1.3, repeat: Infinity, repeatDelay: 0.8 }}
        >
          <path d="M158 224 C 140 200, 132 190, 134 182" fill="none" stroke="#8b5cf6" strokeWidth="1.7" strokeDasharray="5 4" className="flow-dash" />
          <path d="M158 228 C 146 250, 138 262, 136 266" fill="none" stroke="#8b5cf6" strokeWidth="1.7" strokeDasharray="5 4" className="flow-dash" />
          <path d="M162 234 C 158 252, 150 262, 144 268" fill="none" stroke="#8b5cf6" strokeWidth="1.4" strokeDasharray="5 4" className="flow-dash" />
          <circle cx="158" cy="226" r="5.5" fill="#8b5cf6" />
        </motion.g>

        {/* dopamine centre */}
        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ duration: 2.4, delay: 2.1, repeat: Infinity, repeatDelay: 0.8 }}
        >
          <circle cx="252" cy="196" r="40" fill="url(#glowL)" />
          <circle cx="252" cy="196" r="8.5" fill="#65a30d" />
          <path d="M226 206 C 208 210, 186 206, 162 228" fill="none" stroke="#65a30d" strokeWidth="1.3" strokeDasharray="3 4" className="flow-dash" />
        </motion.g>

        {/* sensory flow arcs from outside */}
        <motion.path
          d="M40 190 C 70 178, 100 180, 118 206" fill="none" stroke="#0f9d68" strokeWidth="1.6" strokeLinecap="round"
          strokeDasharray="2 6" className="flow-dash" opacity="0.8"
        />
        <motion.path
          d="M34 250 C 66 244, 96 250, 132 250" fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round"
          strokeDasharray="2 6" className="flow-dash" opacity="0.8"
        />
      </svg>

      {/* live legend */}
      <div className="mt-4 grid w-full gap-2">
        {PULSES.map((p, i) => (
          <motion.div
            key={p.label}
            className="flex items-center gap-3 text-[12.5px] text-bone"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.8, delay: p.delay, repeat: Infinity, repeatDelay: 0.4 }}
          >
            <span
              className="pulse-dot h-2 w-2 shrink-0 rounded-full"
              style={{ background: i === 0 ? "#0f9d68" : i === 1 ? "#8b5cf6" : "#65a30d" }}
            />
            {p.label}
          </motion.div>
        ))}
        <motion.div
          className="flex items-center gap-3 text-[12.5px] text-dim"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-rose/70 line-through" />
          Gustatory signal — faded, bypassed
        </motion.div>
      </div>
    </div>
  );
}
