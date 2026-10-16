import { createClient } from '@/lib/supabase/server'
import type { ConsumptionLog } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProductImage } from '@/lib/constants/drink-assets'
import PhoneBindCard from '@/features/passport/PhoneBindCard'
import { IconCup } from '@/components/icons'
import { getLocalPassportLogs } from '@/lib/passport/store'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Passport — Nhật ký đồ uống',
  description: 'Nhật ký những ly đồ uống bạn tự ghi nhận tại Fame Drink. Passport là tính năng tùy chọn.',
}

async function getPassportData() {
  const localLogs = await getLocalPassportLogs()
  let dbLogs: ConsumptionLog[] = []
  let isAnonymous = true
  let phone: string | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAnonymous = user.is_anonymous ?? true
      const [{ data: logs }, { data: profile }] = await Promise.all([
        supabase.from('consumption_logs').select('*, product:products(*)')
          .eq('user_id', user.id).order('consumed_at', { ascending: false }).limit(100),
        supabase.from('profiles').select('phone_number').eq('id', user.id).maybeSingle(),
      ])
      dbLogs = (logs ?? []) as ConsumptionLog[]
      phone = (profile as { phone_number?: string | null } | null)?.phone_number ?? null
    }
  } catch {
    // Guest cookie history remains available when the database is unavailable.
  }

  const cookieStore = await cookies()
  phone = phone || cookieStore.get('ep_user_phone')?.value || null
  const byId = new Map([...dbLogs, ...localLogs].map((log) => [log.id, log]))
  const logs = Array.from(byId.values()).sort((a, b) => Date.parse(b.consumed_at) - Date.parse(a.consumed_at))
  return { logs, isAnonymous, phone, now: new Date() }
}

function localDay(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}

export default async function PassportPage() {
  const { logs, isAnonymous, phone, now } = await getPassportData()
  const today = localDay(now)
  const todayLogs = logs.filter((log) => localDay(new Date(log.consumed_at)) === today)
  const recentLogs = logs.filter((log) => Date.parse(log.consumed_at) >= now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const estimatedCaffeine = todayLogs.reduce((sum, log) => sum + (log.caffeine_mg_snapshot ?? 0), 0)
  const hasCaffeineEstimate = todayLogs.some((log) => log.caffeine_mg_snapshot !== null)

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-16 space-y-6">
      <Link href="/menu" className="text-sm text-muted hover:underline">← Về menu</Link>
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ad431e]">Fame Drink · Tùy chọn</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Passport của bạn</h1>
        <p className="text-sm text-muted leading-relaxed">Lưu lại những ly bạn đã thử. Quét QR trên ly và xác nhận để thêm một dòng vào nhật ký.</p>
      </div>

      {logs.length === 0 ? (
        <section className="surface rounded-3xl border border-[var(--color-border)] p-7 space-y-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#fff0e4] text-[#ad431e] flex items-center justify-center">
            <IconCup className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Chưa có ly nào trong nhật ký</h2>
          <p className="text-sm text-muted leading-relaxed">Sau khi nhận đồ uống, dùng camera điện thoại quét QR trên ly nếu có. Xem menu hoặc đặt hàng không tự ghi nhận một ly.</p>
          <Link href="/menu" className="btn btn-gold btn-full">Chọn món trong menu</Link>
        </section>
      ) : (
        <>
          <section className="surface rounded-3xl border border-[var(--color-border)] p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted">Đã ghi nhận hôm nay</p>
                <p className="text-3xl font-black mt-2">{todayLogs.length} <span className="text-lg">ly</span></p>
              </div>
              <div>
                <p className="text-sm text-muted">Trong 7 ngày gần đây</p>
                <p className="text-3xl font-black mt-2">{recentLogs.length} <span className="text-lg">ly</span></p>
              </div>
            </div>
            {hasCaffeineEstimate && <p className="text-xs text-muted border-t border-[var(--color-border)] pt-4">
              Caffeine tham khảo hôm nay: khoảng {estimatedCaffeine} mg từ các ly có dữ liệu. Lượng thực tế thay đổi theo cách pha.
            </p>}
          </section>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold text-lg">Nhật ký 7 ngày gần đây</h2>
              <Link href="/passport/history" className="text-sm text-[#ad431e] font-semibold hover:underline">Xem lịch sử →</Link>
            </div>
            {recentLogs.length === 0 ? <p className="text-sm text-muted">Bạn chưa ghi nhận ly nào trong 7 ngày gần đây.</p> :
              recentLogs.map((log) => <LogItem key={log.id} log={log} />)}
          </section>
          <Link href="/menu" className="btn btn-gold btn-full">Khám phá món tiếp theo</Link>
        </>
      )}

      <div className="rounded-2xl border border-[var(--color-border)] p-4 text-xs text-muted leading-relaxed space-y-2">
        <p>Dấu trong Passport là ghi nhận do bạn xác nhận, không phải bằng chứng mua hàng hoặc điểm đổi quà.</p>
        <p>{isAnonymous ? 'Nhật ký khách được lưu trong trình duyệt này; xóa dữ liệu trình duyệt có thể làm mất lịch sử.' : 'Bạn đang đăng nhập Passport. Một số ghi nhận có thể đang được lưu trong trình duyệt này.'}</p>
      </div>

      <PhoneBindCard initialPhone={phone} />
      <div className="flex flex-wrap gap-4 text-sm text-muted">
        <Link href="/check-in" className="hover:underline">Gợi ý món theo khẩu vị</Link>
        {isAnonymous ? <Link href="/auth" className="hover:underline">Đăng nhập Passport</Link> : (
          <form action="/auth/signout" method="post"><button type="submit" className="hover:underline">Đăng xuất</button></form>
        )}
      </div>
    </div>
  )
}

function LogItem({ log }: { log: ConsumptionLog }) {
  const product = log.product
  if (!product) return null
  return (
    <article className="surface flex items-center gap-3 rounded-2xl border border-[var(--color-border)] p-3 sm:p-4">
      <div className="w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-[#f5eadb]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image_url || getProductImage(product.slug, product.category)} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <Link href={'/menu/' + product.slug} className="font-bold text-sm hover:underline">{product.name}</Link>
        <p className="text-xs text-muted mt-1">{new Date(log.consumed_at).toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit',
        })}</p>
      </div>
      <span className="text-[10px] font-semibold text-[#745344] shrink-0">Tự ghi nhận</span>
    </article>
  )
}
