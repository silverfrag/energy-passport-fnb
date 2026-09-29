import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import FameDrinkLogo from '@/components/FameDrinkLogo'
import AdminUnlockCard from '@/features/admin/AdminUnlockCard'
import AdminLogoutButton from '@/features/admin/AdminLogoutButton'
import { isEmailAdmin } from '@/lib/constants/admin'
import { cookies } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const hasAdminSessionCookie = cookieStore.get('ep_admin_session')?.value === 'true'

  // 1. Check if user email is recognized admin (e.g. nhathung121225@gmail.com)
  const isDirectEmailAdmin = isEmailAdmin(user?.email)

  // 2. Check if user is in admin_users table in database
  let isDbAdmin = false
  if (!isDirectEmailAdmin && !hasAdminSessionCookie && user) {
    try {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (adminUser) isDbAdmin = true
    } catch {
      // Supabase query error fallback
    }
  }

  const isAdmin = hasAdminSessionCookie || isDirectEmailAdmin || isDbAdmin

  // If not admin, show store PIN authorization card directly on page (no email/account required!)
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
        <AdminUnlockCard userEmail={user?.email} />
      </div>
    )
  }

  const navLinks = [
    { href: '/admin', label: '📊 Dashboard' },
    { href: '/admin/customers', label: '⭐ Khách Quen & Ưu Đãi' },
    { href: '/admin/products', label: '☕ Sản Phẩm (20k-40k)' },
    { href: '/admin/actions', label: '⏱️ Micro-actions' },
    { href: '/packaging', label: '🏷️ Bao Bì & In Tem QR' },
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
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="hidden sm:inline text-stone-400 text-[11px]">
            {user?.email ?? 'Quản lý cửa hàng (PIN 1212)'}
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
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap bg-white/5 text-stone-300 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <main className="w-full mx-auto max-w-6xl px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
