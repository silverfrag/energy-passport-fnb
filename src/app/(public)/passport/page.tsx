import { createClient } from '@/lib/supabase/server'
import type { ConsumptionLog } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { getProductImage } from '@/lib/constants/drink-assets'
import FameDrinkLogo from '@/components/FameDrinkLogo'
import PhoneBindCard from '@/features/passport/PhoneBindCard'
import { 
  IconPassportCrest, 
  IconStampSeal, 
  IconCompass, 
  IconArrowRight, 
  IconShield,
  IconClock,
  IconCup
} from '@/components/icons'
import { getLocalPassportLogs } from '@/lib/passport/store'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Sổ Ký Danh — Fame Drink Energy Passport',
  description: 'Nhật ký thưởng thức thức uống 7 ngày gần nhất và ước tính caffeine chuẩn xác tại Fame Drink.',
}

async function getPassportData() {
  const localLogs = await getLocalPassportLogs()
  let supabaseUser: any = null
  let dbLogs: ConsumptionLog[] = []
  let profile: { id: string; display_name: string | null; phone_number?: string | null } | null = null

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
          .limit(100),
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

  const cookieStore = await cookies()
  const guestId = cookieStore.get('ep_guest_uid')?.value || 'guest_fame'
  const userPhone = profile?.phone_number || cookieStore.get('ep_user_phone')?.value || null

  if (allLogs.length === 0 && !supabaseUser) {
    return {
      user: { id: guestId, is_anonymous: true },
      profile: null,
      todayLogs: [],
      past7DaysLogs: [],
      todayCaffeine: 0,
      weeklyCaffeine: 0,
      userPhone,
      isAnonymous: true,
      hasRecords: false,
    }
  }

  // 1. Filter Today's logs
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayLogs = allLogs.filter((l) => new Date(l.consumed_at) >= today)
  const todayCaffeine = todayLogs.reduce((sum, l) => sum + (l.caffeine_mg_snapshot ?? 0), 0)

  // 2. Filter Past 7 Days logs (Past 1 week only, per customer requirement)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const past7DaysLogs = allLogs.filter((l) => new Date(l.consumed_at) >= sevenDaysAgo)
  const weeklyCaffeine = past7DaysLogs.reduce((sum, l) => sum + (l.caffeine_mg_snapshot ?? 0), 0)

  return {
    user: supabaseUser || { id: guestId, is_anonymous: true },
    profile: profile as { id?: string; display_name?: string | null; phone_number?: string | null } | null,
    todayLogs,
    past7DaysLogs,
    todayCaffeine,
    weeklyCaffeine,
    userPhone,
    isAnonymous: supabaseUser?.is_anonymous ?? true,
    hasRecords: allLogs.length > 0,
  }
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
}

export default async function PassportPage() {
  const data = await getPassportData()
  const { user, profile, todayLogs, past7DaysLogs, todayCaffeine, userPhone, isAnonymous, hasRecords } = data

  // Empty state if never visited and not logged in
  if (!hasRecords && isAnonymous) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center fade-in space-y-6">
        <div className="flex justify-center">
          <FameDrinkLogo size="lg" variant="icon" />
        </div>
        <div>
          <h1 className="text-2xl font-black mb-2 text-white">
            Sổ Ký Danh Fame Drink
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Passport của bạn sẽ tự động kích hoạt khi bạn quét tem QR trên ly nước tại quán hoặc thực hiện lần check-in đầu tiên.
          </p>
        </div>

        {/* Embedded Phone Card */}
        <div className="text-left">
          <PhoneBindCard initialPhone={userPhone} />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/check-in" className="btn btn-gold btn-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider">
            <IconCompass className="w-4 h-4" />
            <span>Check-in Nhận Gợi Ý Đồ Uống</span>
          </Link>
          <Link href="/menu" className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider border border-white/10 py-3">
            Xem Thực Đơn 20k - 40k
          </Link>
        </div>
      </div>
    )
  }

  const passportSerial = `FD-${user.id.slice(0, 8).toUpperCase()}`
  // Older logs within the 7-day window that are not today
  const earlierInWeekLogs = past7DaysLogs.filter((l) => !todayLogs.some((tl) => tl.id === l.id))

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
                FAME DRINK • OFFICIAL PASSPORT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {profile?.display_name
                ? profile.display_name
                : isAnonymous
                ? 'Thẻ Khách Thân Thiết'
                : 'Thẻ Hội Viên'}
            </h1>
            <p className="text-[11px] font-mono text-amber-200/80 mt-0.5">
              MÃ SỐ: {passportSerial}
            </p>
          </div>

          <FameDrinkLogo size="md" variant="icon" />
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
            FAME SERVED
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
              Ly Dùng Trong 7 Ngày
            </p>
            <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {past7DaysLogs.length} Ly
            </p>
            <p className="text-[10px] text-stone-400 mt-1 font-mono">
              tuần này ({todayLogs.length} ly hôm nay)
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          ZERO-OTP PHONE BINDING CARD
          ============================================================ */}
      <PhoneBindCard initialPhone={userPhone} />

      {/* ============================================================
          GENERIC CUSTOMER LOYALTY PRIVILEGE TEASER (NO MECHANICAL "10 LY")
          ============================================================ */}
      <div className="surface p-4 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-black/40 to-transparent flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 text-base shrink-0 mt-0.5">
          ✨
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider font-mono">
            Ưu Đãi Khách Quen Fame Drink
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            Hệ thống tự động tích lũy đặc quyền thưởng thức & áp dụng các ưu đãi tri ân dành riêng cho bạn khi ghé quầy hoặc khi đặt giao hàng qua SĐT.
          </p>
        </div>
      </div>

      {/* ============================================================
          CLAIM PASS / BIND EMAIL CTA (IF ANONYMOUS WITH RECORDS)
          ============================================================ */}
      {isAnonymous && hasRecords && (
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
            Liên kết email để đồng bộ nhật ký năng lượng và mở quyền nhận diện tự động trên mọi thiết bị.
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
          7-DAY CONSUMPTION LOG ENTRIES (PAST 1 WEEK ONLY)
          ============================================================ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white font-mono flex items-center gap-2">
            <span>NHẬT KÝ THƯỞNG THỨC 7 NGÀY GẦN NHẤT</span>
          </span>
          <span className="text-[11px] text-muted font-mono">
            {past7DaysLogs.length} lần dùng
          </span>
        </div>

        {past7DaysLogs.length === 0 ? (
          <div className="surface p-8 text-center rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
              <IconCup className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xs text-stone-300">
              Trong 7 ngày qua bạn chưa ghi nhận ly đồ uống nào.
            </p>
            <p className="text-[11px] text-muted">
              Quét mã QR trên tem ly nước khi nhận món để tự động đóng dấu Visa Thưởng Thức.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Today's Stamped Logs */}
            {todayLogs.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono font-bold">
                  <span>HÔM NAY ({todayLogs.length} ly)</span>
                  <span>{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                {todayLogs.map((log) => (
                  <StampLogItem key={log.id} log={log} />
                ))}
              </div>
            )}

            {/* Earlier in the 7-day window */}
            {earlierInWeekLogs.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono font-bold">
                  <span>TRONG TUẦN NÀY ({earlierInWeekLogs.length} ly)</span>
                  <span>7 ngày qua</span>
                </div>
                {earlierInWeekLogs.map((log) => (
                  <StampLogItem key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col gap-3">
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
              className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-muted hover:text-white w-full border border-white/10 py-2.5"
            >
              Đăng Xuất Tài Khoản
            </button>
          </form>
        )}
      </div>

      <p className="text-[11px] text-muted text-center pt-2 font-mono">
        Nhật ký tự động tối ưu hiển thị 7 ngày để hỗ trợ cân bằng nhịp sinh học năng lượng.
      </p>
    </div>
  )
}

function StampLogItem({ log }: { log: ConsumptionLog }) {
  const product = log.product
  if (!product) return null

  const imageUrl = product.image_url || getProductImage(product.slug, product.category)
  const timeFormatted = formatTime(log.consumed_at)
  const dateFormatted = formatDate(log.consumed_at)

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
          <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
            {dateFormatted}
          </span>
          <span className="text-[9px] font-mono text-amber-400/90 tracking-wider uppercase block mt-0.5">
            VERIFIED ✓
          </span>
        </div>
      </div>
    </div>
  )
}
