import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productCount },
    { count: actionCount },
    { count: logCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('micro_actions').select('*', { count: 'exact', head: true }),
    supabase.from('consumption_logs').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Sản phẩm', count: productCount ?? 0, href: '/admin/products', color: 'var(--color-wake)', emoji: '☕' },
    { label: 'Micro-actions', count: actionCount ?? 0, href: '/admin/actions', color: 'var(--color-focus)', emoji: '⏱️' },
    { label: 'Đồ uống đã ghi nhận', count: logCount ?? 0, href: '#', color: 'var(--color-refresh)', emoji: '📊' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--color-text)' }}>
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={stat.href === '#' ? 'cursor-default pointer-events-none' : ''}>
            <div className="surface p-5">
              <div className="text-2xl mb-3">{stat.emoji}</div>
              <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>
                {stat.count}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/products/new" className="btn btn-primary-wake">
          + Thêm sản phẩm mới
        </Link>
        <Link href="/admin/actions/new" className="btn btn-primary-focus">
          + Thêm micro-action mới
        </Link>
      </div>
    </div>
  )
}
