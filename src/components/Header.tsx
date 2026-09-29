'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { IconPassport, IconCompass, IconCup, IconScan } from '@/components/icons'
import FameDrinkLogo from '@/components/FameDrinkLogo'

const NAV_ITEMS = [
  { href: '/menu', label: 'Thực Đơn', icon: IconCup },
  { href: '/check-in', label: 'Check-in', icon: IconCompass },
  { href: '/passport', label: 'Passport', icon: IconPassport },
  { href: '/packaging', label: 'Bao Bì & QR', icon: IconScan },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll for hero transparency
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide header in admin
  if (pathname.startsWith('/admin')) return null

  const isHome = pathname === '/'

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        isHome && !scrolled
          ? 'bg-transparent border-b border-transparent'
          : 'glass-nav'
      }`}
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center group">
          <FameDrinkLogo size="md" variant="full" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-wake' : 'text-muted'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/menu"
            className="px-5 py-2 rounded-full text-xs font-bold tracking-wide btn-gold transition-all"
          >
            Xem Menu →
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-2 bg-[var(--color-bg)]/95 backdrop-blur-2xl">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-wake' : 'text-muted'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="pt-2">
            <Link
              href="/menu"
              className="btn btn-gold btn-full text-xs py-3"
              onClick={() => setMenuOpen(false)}
            >
              Xem Thực Đơn →
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
