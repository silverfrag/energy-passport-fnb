'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import CartLink from '@/features/orders/CartLink'

const NAV_ITEMS = [
  { href: '/menu', label: 'Menu đồ uống' },
  { href: '/check-in', label: 'Gợi ý chọn món' },
  { href: '/passport', label: 'Passport của bạn' },
]

export default function Header() {
  const pathname = usePathname()
  const [openPath, setOpenPath] = useState<string | null>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const menuOpen = openPath === pathname
  return (
    <header className="fd-header" onKeyDown={(event) => { if (event.key === 'Escape' && menuOpen) { setOpenPath(null); toggle.current?.focus() } }}>
      <div className="fd-header-inner">
        <Link href="/" aria-label="Fame Drink — trang chủ" className="fd-brand"><span className="fd-wordmark" aria-hidden="true">FAME<br />DRINK</span></Link>
        <nav aria-label="Điều hướng chính" className="fd-header-nav">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link>
          ))}
        </nav>
        <div className="fd-header-actions">
          <CartLink />
          <button ref={toggle} type="button" onClick={() => setOpenPath(menuOpen ? null : pathname)} aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" className="fd-mobile-toggle">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" d={menuOpen ? 'M6 6l12 12M6 18L18 6' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label="Điều hướng trên điện thoại" className="fd-mobile-nav">
        {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpenPath(null)} aria-current={pathname.startsWith(item.href) ? 'page' : undefined}>{item.label}</Link>)}
      </nav>}
    </header>
  )
}
