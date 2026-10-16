'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import FameDrinkLogo from '@/components/FameDrinkLogo'
import CartLink from '@/features/orders/CartLink'

const NAV_ITEMS = [
  { href: '/menu', label: 'Menu đồ uống' },
  { href: '/check-in', label: 'Gợi ý chọn món' },
  { href: '/passport', label: 'Passport của bạn' },
]

export default function Header() {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const menuOpen = openPath === pathname
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8ddcf] bg-[#fffaf2]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" aria-label="Fame Drink — trang chủ" className="shrink-0"><span className="sm:hidden"><FameDrinkLogo size="md" variant="icon" /></span><span className="hidden sm:inline-flex"><FameDrinkLogo size="md" variant="full" /></span></Link>
        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? 'page' : undefined} className={`rounded-full px-4 py-3 text-sm font-semibold transition-colors ${pathname.startsWith(item.href) ? 'bg-[#f2e7d8] text-[#a63d1b]' : 'text-[#756457] hover:bg-[#f2e7d8] hover:text-[#35251c]'}`}>{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <CartLink className="!px-3 sm:!px-4" />
          <button type="button" onClick={() => setOpenPath(menuOpen ? null : pathname)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" className="inline-flex size-11 items-center justify-center rounded-full text-[#35251c] hover:bg-[#f2e7d8] lg:hidden">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" d={menuOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label="Điều hướng trên điện thoại" className="absolute inset-x-0 border-b border-[#e8ddcf] bg-[#fffaf2] p-4 shadow-lg lg:hidden">
        {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpenPath(null)} aria-current={pathname.startsWith(item.href) ? 'page' : undefined} className="block rounded-xl px-4 py-3 text-sm font-bold text-[#493326] hover:bg-[#f2e7d8]">{item.label}</Link>)}
      </nav>}
    </header>
  )
}
