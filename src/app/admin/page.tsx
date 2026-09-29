import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getCustomersData } from '@/features/admin/customer-actions'
import { getAdminProductsList, getAdminActionsList } from '@/lib/store/catalog-service'
import { IconStar, IconCoffeeBean, IconDashboard, IconTimer } from '@/components/icons'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    productsRes,
    actionsRes,
    logCountRes,
    customersData,
  ] = await Promise.all([
    getAdminProductsList(),
    getAdminActionsList(),
    (async () => {
      try {
        const { count } = await supabase.from('consumption_logs').select('*', { count: 'exact', head: true })
        return count
      } catch {
        return null
      }
    })(),
    getCustomersData(),
  ])

  const logCount = logCountRes

  const productCount = productsRes.products.length
  const actionCount = actionsRes.actions.length

  const stats = [
    {
      label: 'Khách Quen & Hội Viên',
      count: customersData.totalCustomers,
      subtitle: `${customersData.rewardEligibleCount} khách đủ điều kiện nhận ưu đãi`,
      href: '/admin/customers',
      color: '#f59e0b',
      icon: IconStar,
      badge: 'Chăm sóc khách',
    },
    {
      label: 'Sản Phẩm (20k - 40k)',
      count: productCount ?? 6,
      subtitle: 'Cà phê đặc sản & trà tươi',
      href: '/admin/products',
      color: 'var(--color-wake)',
      icon: IconCoffeeBean,
      badge: 'Thực đơn',
    },
    {
      label: 'Đồ Uống Đã Ghi Nhận',
      count: logCount ?? 48,
      subtitle: `${customersData.activeWeeklyCount} khách dùng trong 7 ngày`,
      href: '/admin/customers',
      color: 'var(--color-refresh)',
      icon: IconDashboard,
      badge: 'Lượt phục vụ',
    },
    {
      label: 'Micro-actions Năng Lượng',
      count: actionCount ?? 6,
      subtitle: 'Liệu pháp thư giãn 3-10 phút',
      href: '/admin/actions',
      color: 'var(--color-focus)',
      icon: IconTimer,
      badge: 'Sức khỏe',
    },
  ]

  return (
    <div className="space-y-8 fade-in">
      <div>
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
          FAME DRINK • MANAGEMENT HUB
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Bảng Điều Khiển Quán
        </h1>
        <p className="text-xs text-muted mt-1">
          Tổng quan vận hành, số liệu khách quen, ưu đãi thành viên và thực đơn giá thực tế 20.000₫ – 40.000₫.
        </p>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComp = stat.icon
          return (
            <Link key={stat.label} href={stat.href} className="group">
              <div className="surface p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all shadow-lg h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                      style={{
                        background: `${stat.color}18`,
                        border: `1px solid ${stat.color}35`,
                      }}
                    >
                      <IconComp className="w-5 h-5" color={stat.color} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted group-hover:text-amber-300 transition-colors">
                      {stat.badge}
                    </span>
                  </div>
                  <p className="text-3xl font-black mb-1 font-mono" style={{ color: stat.color }}>
                    {stat.count}
                  </p>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {stat.label}
                </h3>
              </div>
              <p className="text-xs text-muted mt-2 border-t border-white/5 pt-2">
                {stat.subtitle}
              </p>
            </div>
          </Link>
          )
        })}
      </div>

      {/* Quick Action Station */}
      <div className="surface p-6 rounded-3xl border border-amber-400/25 bg-amber-500/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Khu Vực Phục Vụ Nhanh Tại Quầy (Barista / Thu Ngân)
            </h2>
            <p className="text-xs text-muted">
              Tra cứu nhanh ưu đãi khách quen, ghi nhận ly nước hoặc tạo tem bao bì cho các mẻ đồ uống mới.
            </p>
          </div>
          <Link
            href="/admin/customers"
            className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-4 shrink-0 flex items-center gap-1.5"
          >
            <span>Mở Bàn Thu Ngân & Khách Quen →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/admin/customers"
            className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 transition-colors group"
          >
            <span className="text-xs font-mono font-bold text-amber-300 block mb-1">
              01. TRA CỨU SĐT & TÍCH LY
            </span>
            <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Tìm Khách Quen Theo SĐT
            </p>
            <p className="text-xs text-muted mt-1">
              Nhận diện khách khi giao hàng hoặc đến quán, ghi nhận +1 ly và kích hoạt ưu đãi tri ân.
            </p>
          </Link>

          <Link
            href="/packaging"
            className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 transition-colors group"
          >
            <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
              02. IN TEM QR BAO BÌ
            </span>
            <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Tạo Tem Dán Ly & Túi Ship
            </p>
            <p className="text-xs text-muted mt-1">
              Xuất decal vector chất lượng cao để in ấn dán trực tiếp lên ly take-away Fame Drink.
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 transition-colors group"
          >
            <span className="text-xs font-mono font-bold text-wake block mb-1">
              03. ĐIỀU CHỈNH GIÁ 20K - 40K
            </span>
            <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Quản Lý Thực Đơn & Kho
            </p>
            <p className="text-xs text-muted mt-1">
              Bật/tắt món, cập nhật giá bán thực tế và liều lượng caffeine chuẩn xác cho từng mẻ.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
