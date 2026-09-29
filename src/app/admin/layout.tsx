import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth?redirect=/admin')

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!adminUser) redirect('/')

  return (
    <div className="min-h-dvh" style={{ background: 'var(--color-bg)' }}>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-4">
          <span className="font-black text-sm" style={{ color: 'var(--color-text)' }}>
            ⚙️ Admin
          </span>
          <nav className="hidden sm:flex items-center gap-1">
            {[
              { href: '/admin', label: 'Dashboard' },
              { href: '/admin/products', label: 'Sản phẩm' },
              { href: '/admin/actions', label: 'Micro-actions' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs"
            style={{ color: 'var(--color-text-dim)' }}
          >
            ← Site
          </Link>
        </div>
      </header>

      <main className="w-full mx-auto max-w-6xl px-4 sm:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
