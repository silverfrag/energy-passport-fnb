import { createClient } from '@/lib/supabase/server'
import type { ConsumptionLog } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { getProductImage } from '@/lib/constants/drink-assets'
import { 
  IconPassportCrest, 
  IconStampSeal, 
  IconCompass, 
  IconArrowRight, 
  IconShield,
  IconClock
} from '@/components/icons'

export const metadata: Metadata = {
  title: 'Sổ Ký Danh — Energy Passport',
  description: 'Lịch sử tiêu thụ thức uống và liều lượng caffeine ước tính chuẩn xác của bạn.',
}

import { getLocalPassportLogs } from '@/lib/passport/store'
import { cookies } from 'next/headers'

async function getPassportData() {
  const localLogs = await getLocalPassportLogs()
  let supabaseUser: any = null
  let dbLogs: ConsumptionLog[] = []
  let profile: { id: string; display_name: string | null } | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      supabaseUser = user
      const [{ data: dbLogsRaw }, { data: profileRaw }] = await Promise.all([
        supabase
          .from('consumption_logs')
          .select('*, product:products(*)')
          .eq('user_id', user.id)
          .order('consumed_at', { ascending: false })
          .limit(50),
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
      ])
      if (dbLogsRaw) dbLogs = dbLogsRaw as unknown as ConsumptionLog[]
      if (profileRaw) profile = profileRaw as any
    }
  } catch {
    // Supabase unavailable or table not created
  }

  // Merge logs (dbLogs + localLogs, deduplicate by id or product_slug + timestamp)
  const allLogsMap = new Map<string, ConsumptionLog>()
  for (const log of [...dbLogs, ...localLogs]) {
    const key = log.id || `${log.product_id}_${log.consumed_at}`
    if (!allLogsMap.has(key)) {
      allLogsMap.set(key, log)
    }
  }

  const allLogs = Array.from(allLogsMap.values()).sort(
    (a, b) => new Date(b.consumed_at).getTime() - new Date(a.consumed_at).getTime()
  )

  if (allLogs.length === 0 && !supabaseUser) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayLogs = allLogs.filter((l) => new Date(l.consumed_at) >= today)
  const todayCaffeine = todayLogs.reduce((sum, l) => sum + (l.caffeine_mg_snapshot ?? 0), 0)

  const cookieStore = await cookies()
  const guestId = cookieStore.get('ep_guest_uid')?.value || 'guest_atelier'

  return {
    user: supabaseUser || { id: guestId, is_anonymous: true },
    profile: profile as { id?: string; display_name?: string | null } | null,
    todayLogs,
    recentLogs: allLogs.slice(0, 20),
    todayCaffeine,
    isAnonymous: supabaseUser?.is_anonymous ?? true,
  }
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function PassportPage() {
  const data = await getPassportData()

  // No session state
  if (!data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-6">
          <IconPassportCrest className="w-8 h-8 text-amber-400" color="#D4AF37" />
        </div>
        <h1 className="text-2xl font-black mb-3 text-white">
          Sổ Ký Danh Energy Passport
        </h1>
        <p className="text-sm mb-8 text-muted leading-relaxed">
          Passport của bạn sẽ được tự động kích hoạt khi bạn quét mã QR trên ly nước hoặc thực hiện lần check-in đầu tiên.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/check-in" className="btn btn-gold btn-full flex items-center justify-center gap-2">
            <IconCompass className="w-4 h-4" />
            <span>Check-in Nhận Gợi Ý Đồ Uống</span>
          </Link>
          <Link href="/menu" className="btn btn-ghost btn-full text-sm">
            Xem Thực Đơn Tinh Tuyển
          </Link>
        </div>
      </div>
    )
  }

  const { user, profile, todayLogs, recentLogs, todayCaffeine, isAnonymous } = data
  const passportSerial = `EP-${user.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="w-full mx-auto max-w-xl px-4 sm:px-6 py-8 fade-in space-y-6">
      {/* ============================================================
          PHYSICAL LUXURY PASSPORT CARD HEADER
          ============================================================ */}
      <div className="passport-card p-6 sm:p-7 rounded-2xl relative shadow-2xl space-y-5">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-amber-400/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-300 font-mono">
                OFFICIAL ENERGY PASSPORT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {profile?.display_name
                ? profile.display_name
                : isAnonymous
                ? 'Thẻ Khách Vãng Lai'
                : 'Thẻ Hội Viên'}
            </h1>
            <p className="text-[11px] font-mono text-amber-200/80 mt-0.5">
              MÃ SỐ: {passportSerial}
            </p>
          </div>

          <IconPassportCrest className="w-10 h-10 text-amber-400" color="#D4AF37" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <IconShield className="w-3.5 h-3.5 text-amber-400" color="#D4AF37" />
            <span>
              {isAnonymous ? 'Lưu trữ trên thiết bị này' : 'Tài khoản đã xác thực'}
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-300/80 uppercase">
            ATELIER SERVED
          </span>
        </div>

        {/* Daily Caffeine Apothecary Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-black/40 border border-amber-400/20">
            <p className="text-[10px] text-muted uppercase font-mono tracking-wider">
              Caffeine Hôm Nay
            </p>
            <p className="text-2xl font-black text-amber-300 font-mono mt-0.5">
              {todayCaffeine > 0 ? `~${todayCaffeine} mg` : '0 mg'}
            </p>
            <p className="text-[10px] text-stone-400 mt-1 font-mono">
              / 400 mg ngưỡng tối ưu
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-amber-400/20">
            <p className="text-[10px] text-muted uppercase font-mono tracking-wider">
              Đồ Uống Đã Dùng
            </p>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {todayLogs.length} Ly
            </p>
            <p className="text-[10px] text-stone-400 mt-1 font-mono">
              đã đóng dấu xác nhận
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          CLAIM PASS / BIND EMAIL CTA (IF ANONYMOUS WITH RECORDS)
          ============================================================ */}
      {isAnonymous && recentLogs.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-200">
              Bảo Lưu Passport Lâu Dài
            </h3>
            <span className="text-[10px] font-mono text-amber-300/80 px-2 py-0.5 rounded-full border border-amber-400/30 bg-black/40">
              KHUYÊN DÙNG
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Liên kết email để bảo vệ nhật ký năng lượng và mở quyền tích lũy huy hiệu khi đổi thiết bị.
          </p>
          <div className="pt-1">
            <Link
              href="/auth"
              className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
            >
              <span>Liên Kết Email Ngay</span>
              <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ============================================================
          CONSUMPTION LOG ENTRIES (VISA STAMP SEALS)
          ============================================================ */}
      {recentLogs.length === 0 ? (
        <div className="surface p-8 text-center rounded-2xl border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
            <IconPassportCrest className="w-6 h-6" color="#D4AF37" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Chưa Có Con Dấu Nào
            </h3>
            <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
              Mỗi ly nước phục vụ tại quầy đều có tem QR độc bản. Quét mã trên ly để nhận con dấu Visa Thưởng Thức đầu tiên.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/check-in" className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-5">
              Check-in Trạng Thái
            </Link>
            <Link href="/menu" className="btn btn-ghost text-xs font-bold uppercase tracking-wider py-2.5 px-5 border border-white/10">
              Khám Phá Menu
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today's Stamped Logs */}
          {todayLogs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 font-mono">
                  CON DẤU HÔM NAY ({todayLogs.length})
                </span>
                <span className="text-xs text-muted font-mono">
                  {new Date().toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="space-y-2.5">
                {todayLogs.map((log) => (
                  <StampLogItem key={log.id} log={log} />
                ))}
              </div>
            </div>
          )}

          {/* Recent History Link */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted font-mono">
                DẤU ẤN TRƯỚC ĐÓ
              </span>
              <Link
                href="/passport/history"
                className="text-xs text-amber-300 hover:underline font-mono inline-flex items-center gap-1"
              >
                <span>Xem toàn bộ lịch sử</span>
                <IconArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentLogs.slice(0, 5).map((log) => (
                <StampLogItem key={log.id} log={log} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 flex flex-col gap-3">
        <Link
          href="/check-in"
          className="btn btn-gold btn-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-3"
        >
          <IconCompass className="w-4 h-4" />
          <span>Check-in Cảm Xúc & Nhu Cầu</span>
        </Link>
        {!isAnonymous && (
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-muted hover:text-white w-full border border-white/10"
            >
              Đăng Xuất Tài Khoản
            </button>
          </form>
        )}
      </div>

      <p className="text-[11px] text-muted text-center pt-2 font-mono">
        Hàm lượng caffeine được chuẩn hóa theo mẻ chiết xuất và nguyên liệu đặc sản.
      </p>
    </div>
  )
}

function StampLogItem({ log }: { log: ConsumptionLog }) {
  const product = log.product
  if (!product) return null

  const imageUrl = product.image_url || getProductImage(product.slug, product.category)
  const timeFormatted = formatTime(log.consumed_at)

  return (
    <div className="surface p-4 rounded-xl border border-white/10 card-hover flex items-center gap-4 relative overflow-hidden group">
      {/* Beverage Thumbnail with fine ring */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-amber-400/30 bg-stone-900 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Drink Detail */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <CategoryBadge category={product.category} showEmoji={false} />
          {log.caffeine_mg_snapshot !== null && (
            <span className="text-[11px] font-mono text-amber-200/90">
              ~{log.caffeine_mg_snapshot}mg
            </span>
          )}
        </div>
      </div>

      {/* Stamp Seal Simulation */}
      <div className="flex-shrink-0 flex items-center gap-2 text-right">
        <div className="hidden sm:block">
          <IconStampSeal className="w-11 h-11 text-amber-400/80" color="#D4AF37" dateText={timeFormatted} />
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-muted">
            <IconClock className="w-3 h-3 text-muted" />
            <span>{timeFormatted}</span>
          </div>
          <span className="text-[9px] font-mono text-amber-400/90 tracking-wider uppercase block mt-0.5">
            VERIFIED
          </span>
        </div>
      </div>
    </div>
  )
}
