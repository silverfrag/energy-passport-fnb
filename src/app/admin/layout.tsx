import Link from 'next/link'
import FameDrinkLogo from '@/components/FameDrinkLogo'
import AdminUnlockCard from '@/features/admin/AdminUnlockCard'
import AdminLogoutButton from '@/features/admin/AdminLogoutButton'
import { 
  IconDashboard, 
  IconStar, 
  IconCoffeeBean, 
  IconTimer, 
  IconTag 
} from '@/components/icons'
import { cookies } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('ep_admin_session')?.value === 'true'

  // If not admin, show store PIN authorization card directly on page (no email/account required!)
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
        <AdminUnlockCard />
      </div>
    )
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: IconDashboard },
    { href: '/admin/customers', label: 'Khách Quen & Ưu Đãi', icon: IconStar },
    { href: '/admin/products', label: 'Sản Phẩm (20k-40k)', icon: IconCoffeeBean },
    { href: '/admin/actions', label: 'Micro-actions', icon: IconTimer },
    { href: '/packaging', label: 'Bao Bì & In Tem QR', icon: IconTag },
  ]

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between"
        style={{
          background: 'rgba(15, 14, 12, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <FameDrinkLogo size="sm" variant="compact" />
            <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
              QUẢN TRỊ VIÊN
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const IconComp = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors inline-flex items-center gap-1.5"
                >
                  <IconComp className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="hidden sm:inline text-amber-300/80 text-[11px] font-bold">
            Chủ quán & Quản lý (PIN 1212)
          </span>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors"
          >
            ← Ra Website
          </Link>
          <AdminLogoutButton />
        </div>
      </header>

      {/* Subnav for Mobile */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto bg-stone-900 border-b border-white/10">
        {navLinks.map((item) => {
          const IconComp = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-white/5 text-stone-300 hover:text-white inline-flex items-center gap-1.5"
            >
              <IconComp className="w-3.5 h-3.5 text-amber-400" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      <main className="w-full mx-auto max-w-6xl px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
