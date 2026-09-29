import { createClient } from '@/lib/supabase/server'
import type { ConsumptionLog } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { getProductImage } from '@/lib/constants/drink-assets'
import { 
  IconPassportCrest, 
  IconStampSeal, 
  IconClock, 
  IconCompass,
  IconArrowRight
} from '@/components/icons'

export const metadata: Metadata = {
  title: 'Lịch Sử Ký Danh — Energy Passport',
  description: 'Toàn bộ hồ sơ tiêu thụ đồ uống và hàm lượng caffeine của bạn.',
}

function groupByDate(logs: ConsumptionLog[]): Record<string, ConsumptionLog[]> {
  const groups: Record<string, ConsumptionLog[]> = {}
  for (const log of logs) {
    const date = new Date(log.consumed_at).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(log)
  }
  return groups
}

export default async function PassportHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center fade-in">
        <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
          <IconPassportCrest className="w-7 h-7 text-amber-400" color="#D4AF37" />
        </div>
        <h1 className="text-xl font-black mb-2 text-white">
          Chưa Có Hồ Sơ Ký Danh
        </h1>
        <p className="text-xs text-muted mb-6">
          Quét tem QR trên ly hoặc check-in để tạo Passport tạm thời trên thiết bị này.
        </p>
        <Link href="/check-in" className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-6">
          Bắt Đầu Ngay
        </Link>
      </div>
    )
  }

  const { data: logsRaw } = await supabase
    .from('consumption_logs')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('consumed_at', { ascending: false })
    .limit(100)

  const allLogs = (logsRaw ?? []) as ConsumptionLog[]
  const grouped = groupByDate(allLogs)
  const totalCaffeine = allLogs.reduce((sum, log) => sum + (log.caffeine_mg_snapshot ?? 0), 0)

  return (
    <div className="w-full mx-auto max-w-xl px-4 sm:px-6 py-8 fade-in space-y-6">
      <Link
        href="/passport"
        className="text-xs text-muted hover:text-white flex items-center gap-1 font-mono tracking-wider uppercase transition-colors"
      >
        ← Quay lại Passport
      </Link>

      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 font-mono">
            HISTORICAL LOG ARCHIVE
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Lịch Sử Thưởng Thức
          </h1>
        </div>
        <IconPassportCrest className="w-8 h-8 text-amber-400" color="#D4AF37" />
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-surface border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-muted font-mono">Tổng Caffeine Ghi Nhận</p>
          <p className="text-xl font-black text-amber-300 font-mono mt-1">~{totalCaffeine} mg</p>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-muted font-mono">Tổng Số Ly Đã Phục Vụ</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{allLogs.length} Ly</p>
        </div>
      </div>

      {allLogs.length === 0 ? (
        <div className="surface p-8 text-center rounded-2xl border border-white/10 space-y-3">
          <p className="font-bold text-white">Chưa có lịch sử tiêu thụ</p>
          <p className="text-xs text-muted">
            Quét mã QR trên cốc hoặc check-in để bắt đầu lưu trữ hồ sơ.
          </p>
          <div className="pt-2">
            <Link href="/check-in" className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2 px-5">
              Check-in Trạng Thái
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, dateLogs]) => {
            const dateCaffeine = dateLogs.reduce((s, l) => s + (l.caffeine_mg_snapshot ?? 0), 0)
            return (
              <div key={date} className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                    {date}
                  </h2>
                  {dateCaffeine > 0 && (
                    <span className="text-xs text-muted font-mono">
                      Tổng ngày: ~{dateCaffeine}mg
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {dateLogs.map((log) => {
                    const product = log.product
                    if (!product) return null
                    const imageUrl = product.image_url || getProductImage(product.slug, product.category)
                    const timeStr = new Date(log.consumed_at).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })

                    return (
                      <div key={log.id} className="surface flex items-center gap-3.5 p-3.5 rounded-xl border border-white/10 card-hover">
                        <div className="flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-white/10 bg-stone-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryBadge category={product.category} showEmoji={false} />
                            {log.caffeine_mg_snapshot !== null && (
                              <span className="text-[11px] font-mono text-muted">
                                ~{log.caffeine_mg_snapshot}mg
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2 text-right">
                          <div className="hidden sm:block">
                            <IconStampSeal className="w-8 h-8 text-amber-400/60" color="#D4AF37" dateText={timeStr} />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-muted">
                              <IconClock className="w-3 h-3 text-muted" />
                              <span>{timeStr}</span>
                            </div>
                            <span className="text-[9px] font-mono text-amber-400/80 uppercase block mt-0.5">
                              VERIFIED
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
