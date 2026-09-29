import React from 'react'
import Link from 'next/link'

interface FameDrinkLogoProps {
  variant?: 'full' | 'compact' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showLink?: boolean
}

export default function FameDrinkLogo({
  variant = 'full',
  size = 'md',
  className = '',
  showLink = false,
}: FameDrinkLogoProps) {
  // Size mappings
  const iconSizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
  }

  const titleSizes = {
    sm: 'text-xs tracking-[0.14em]',
    md: 'text-sm tracking-[0.16em]',
    lg: 'text-base tracking-[0.18em]',
    xl: 'text-xl tracking-[0.2em]',
  }

  const subSizes = {
    sm: 'text-[8px] tracking-[0.18em]',
    md: 'text-[9px] tracking-[0.2em]',
    lg: 'text-[10px] tracking-[0.22em]',
    xl: 'text-xs tracking-[0.25em]',
  }

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Monogram Seal Icon */}
      <div
        className={`${iconSizes[size]} rounded-2xl flex items-center justify-center font-black transition-all duration-300 relative shrink-0 shadow-lg border group-hover:scale-105`}
        style={{
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 60%, #0c0a09 100%)',
          borderColor: 'rgba(212,175,55,0.45)',
          boxShadow: '0 4px 20px -2px rgba(212,175,55,0.15)',
        }}
      >
        {/* Fine Inner Border */}
        <div className="absolute inset-0.5 rounded-[13px] border border-amber-400/20 pointer-events-none" />

        {/* FD Monogram with Stylized Typography */}
        <div className="relative flex items-center justify-center font-serif font-black">
          <span className="text-amber-400 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">F</span>
          <span className="text-amber-200/90 -ml-0.5 italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">D</span>
        </div>

        {/* Energy Pulse Spark */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
      </div>

      {/* Typography Brand Name */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black uppercase text-white leading-none font-sans group-hover:text-amber-300 transition-colors ${titleSizes[size]}`}
            >
              FAME DRINK
            </span>
          </div>
          {variant === 'full' && (
            <span
              className={`uppercase text-amber-300/80 font-mono font-medium mt-0.5 ${subSizes[size]}`}
            >
              Energy Passport · Specialty Drinks
            </span>
          )}
          {variant === 'compact' && (
            <span
              className={`uppercase text-amber-400/70 font-mono font-medium ${subSizes[size]}`}
            >
              Atelier
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (showLink) {
    return (
      <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
