import React from 'react'

export function IconWake({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function IconFocus({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  )
}

export function IconRefresh({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <path d="M12 12c-1.5 0-3-.5-4-1.5" strokeOpacity="0.6" />
    </svg>
  )
}

export function IconPassport({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="3" />
      <circle cx="12" cy="11" r="4" />
      <path d="M12 7v8M8 11h8" strokeWidth="1.2" strokeOpacity="0.7" />
      <path d="M8 18h8" strokeWidth="1.5" />
    </svg>
  )
}

export function IconScan({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <line x1="7" y1="12" x2="17" y2="12" strokeOpacity="0.8" />
    </svg>
  )
}

export function IconTimer({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M12 2v3M9 2h6" />
    </svg>
  )
}

export function IconCheck({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function IconArrowRight({ className = "w-4 h-4", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function IconCompass({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} fillOpacity="0.2" />
    </svg>
  )
}

export function IconCup({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3" />
    </svg>
  )
}

export function IconSparkles({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  )
}

export function IconCoffeeBean({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="7" ry="9" transform="rotate(-30 12 12)" />
      <path d="M10 5.5c2 3 0 7 2 11" strokeOpacity="0.8" />
    </svg>
  )
}

export function IconLeaf({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

export function IconDroplet({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

export function IconShield({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" />
    </svg>
  )
}

export function IconUser({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function IconClock({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function IconStampSeal({ className = "w-16 h-16", color = "#D4AF37", dateText = "VALIDATED" }: { className?: string; color?: string; dateText?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="54" stroke={color} strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="60" r="45" stroke={color} strokeWidth="0.8" strokeDasharray="1 2" opacity="0.6" />
      <path d="M25 60h70M25 72h70" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <text x="60" y="44" fill={color} fontSize="7" fontWeight="bold" letterSpacing="2.5" textAnchor="middle" fontFamily="monospace">
        ENERGY PASSPORT
      </text>
      <text x="60" y="56" fill={color} fontSize="6" fontWeight="bold" letterSpacing="1.5" textAnchor="middle" fontFamily="monospace">
        OFFICIAL CRAFT LOG
      </text>
      <text x="60" y="68" fill={color} fontSize="8" fontWeight="black" letterSpacing="2" textAnchor="middle" fontFamily="monospace">
        {dateText}
      </text>
      <text x="60" y="80" fill={color} fontSize="6" fontWeight="bold" letterSpacing="2" textAnchor="middle" fontFamily="monospace">
        FLAGSHIP ROASTERY
      </text>
      <circle cx="60" cy="94" r="3" fill={color} opacity="0.7" />
      <circle cx="48" cy="94" r="1.5" fill={color} opacity="0.5" />
      <circle cx="72" cy="94" r="1.5" fill={color} opacity="0.5" />
    </svg>
  )
}

export function IconPassportCrest({ className = "w-12 h-12", color = "#D4AF37" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="1.2" />
      {/* Laurel wreath leaves */}
      <path d="M18 36c-1-5 1-12 5-15 1 4 0 9-2 13M46 36c1-5-1-12-5-15-1 4 0 9 2 13" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      {/* Monogram EP */}
      <text x="32" y="38" fill={color} fontSize="17" fontWeight="900" fontFamily="serif" textAnchor="middle" letterSpacing="0.5">
        EP
      </text>
      <circle cx="32" cy="18" r="1.5" fill={color} />
      <circle cx="32" cy="46" r="1.5" fill={color} />
    </svg>
  )
}
