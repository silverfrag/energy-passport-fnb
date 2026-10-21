import { createClient } from '@/lib/supabase/server'
import { getLocalPassportLogs } from '@/lib/passport/store'
import type { ConsumptionLog } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductImage } from '@/lib/constants/drink-assets'

export const metadata: Metadata = {
  title: 'Lịch sử Passport',
  description: 'Những ly đồ uống bạn đã tự ghi nhận trong Passport.',
  robots: { index: false, follow: false },
}

export default async function PassportHistoryPage() {
  const localLogs = await getLocalPassportLogs()
  let dbLogs: ConsumptionLog[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('consumption_logs').select('*, product:products(*)')
        .eq('user_id', user.id).order('consumed_at', { ascending: false }).limit(100)
      dbLogs = (data ?? []) as ConsumptionLog[]
    }
  } catch {
    // Local history remains readable when Supabase is unavailable.
  }

  const byId = new Map([...dbLogs, ...localLogs].map((log) => [log.id, log]))
  const logs = Array.from(byId.values()).sort((a, b) => Date.parse(b.consumed_at) - Date.parse(a.consumed_at))
  const grouped: Record<string, ConsumptionLog[]> = {}
  for (const log of logs) {
    const day = new Date(log.consumed_at).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    })
    ;(grouped[day] ??= []).push(log)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-16 space-y-6">
      <Link href="/passport" className="text-sm text-muted hover:underline">← Về Passport</Link>
      <div className="space-y-3">
        <p className="text-xs font-bold text-[#ad431e] uppercase tracking-widest">Nhật ký cá nhân</p>
        <h1 className="text-3xl font-black">Những ly đã thử</h1>
        <p className="text-sm text-muted">{logs.length} lượt ghi nhận đang có trong Passport. Đây là nhật ký tự xác nhận, không phải lịch sử đơn hàng.</p>
      </div>
      {logs.length === 0 ? (
        <div className="surface rounded-2xl border border-[var(--color-border)] p-6 space-y-4">
          <h2 className="text-lg font-bold">Chưa có ghi nhận nào</h2>
          <p className="text-sm text-muted">Quét QR trên ly và bấm xác nhận khi bạn đang thưởng thức món. Không cần đăng nhập để xem nhật ký khách trên trình duyệt này.</p>
          <Link href="/menu" className="btn btn-gold btn-full">Xem menu</Link>
        </div>
      ) : Object.entries(grouped).map(([day, entries]) => (
        <section key={day} className="space-y-3">
          <h2 className="text-sm font-bold border-b border-[var(--color-border)] pb-2">{day}</h2>
          {entries.map((log) => {
            const product = log.product
            if (!product) return null
            return (
              <article key={log.id} className="surface flex gap-3 items-center p-3 rounded-2xl border border-[var(--color-border)]">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-[#f5eadb] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image_url || getProductImage(product.slug, product.category)} alt="" className="h-full w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={'/menu/' + product.slug} className="text-sm font-bold hover:underline">{product.name}</Link>
                  <p className="text-xs text-muted mt-1">Tự ghi nhận · {new Date(log.consumed_at).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })}</p>
                  {log.caffeine_mg_snapshot !== null && <p className="text-xs text-muted mt-1">Caffeine ước tính: khoảng {log.caffeine_mg_snapshot} mg</p>}
                </div>
              </article>
            )
          })}
        </section>
      ))}
      <p className="text-xs text-muted">Ước tính caffeine dùng để tham khảo và có thể khác theo cách pha. Lịch sử khách phụ thuộc dữ liệu còn lưu trong trình duyệt.</p>
    </div>
  )
}
