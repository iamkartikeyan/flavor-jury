"use client";

import Link from "next/link";

/**
 * JuryMark — the Flavor Jury seal.
 * Three bonded compound nodes inside an orbit — a molecular gavel.
 */
export function JuryMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="jmG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f9d68" />
          <stop offset="100%" stopColor="#84cc16" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21.5" fill="none" stroke="url(#jmG)" strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="3 4" />
      <ellipse cx="24" cy="24" rx="21" ry="9" fill="none" stroke="#0f9d68" strokeOpacity="0.4" strokeWidth="1" transform="rotate(-24 24 24)" />
      <line x1="17" y1="27" x2="24" y2="15" stroke="url(#jmG)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="15" x2="32" y2="24" stroke="url(#jmG)" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="27" x2="32" y2="24" stroke="url(#jmG)" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      <circle cx="17" cy="27" r="3.4" fill="url(#jmG)" />
      <circle cx="24" cy="15" r="4.4" fill="url(#jmG)" />
      <circle cx="32" cy="24" r="2.8" fill="url(#jmG)" opacity="0.9" />
    </svg>
  );
}

export function Logo({ compact = false, onClick }: { compact?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3"
      aria-label="Flavor Jury home"
    >
      <JuryMark size={34} className="transition-transform duration-500 group-hover:rotate-[30deg]" />
      {!compact && (
        <span className="flex flex-col items-start leading-none">
          <span className="font-display text-[19px] font-semibold tracking-tight text-cream">
            Flavor<span className="text-bio"> Jury</span>
          </span>
          <span className="caption mt-1 text-[8.5px] text-dim">Sensory Augmentation Engine</span>
        </span>
      )}
    </button>
  );
}

export function FooterLogoLink({ children }: { children: React.ReactNode }) {
  return <Link href="#" onClick={(e) => e.preventDefault()} className="text-bone transition-colors hover:text-bio">{children}</Link>;
}
