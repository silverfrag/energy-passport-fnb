'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import type { PaymentSettings } from '@/lib/orders/types'
import { adminRequest, failureFrom } from './request'
import { FailureNotice, type AdminFailure } from './shared'

const FIELD_CLASS = 'w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:border-amber-400 outline-none'

export default function PaymentSettingsClient({ initialSettings, initialError }: {
  initialSettings: PaymentSettings | null; initialError: AdminFailure | null
}) {
  const [settings, setSettings] = useState(initialSettings)
  const [draft, setDraft] = useState(initialSettings)
  const [error, setError] = useState(initialError)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const lock = useRef(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings)

  async function refresh() {
    if (lock.current) return
    lock.current = true
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const fresh = await adminRequest<{ settings: PaymentSettings }>('/api/admin/payment-settings')
      setSettings(fresh.settings)
      setDraft(fresh.settings)
      setNeedsRefresh(false)
    } catch (cause) {
      const failure = failureFrom(cause)
      setError(failure)
      setNeedsRefresh(true)
      if (failure.status === 401) { setSettings(null); setDraft(null) }
    } finally { lock.current = false; setBusy(false) }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || lock.current || needsRefresh) return
    lock.current = true
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const result = await adminRequest<{ settings: PaymentSettings }>('/api/admin/payment-settings', 'PUT', { ...draft, deliveryFee: 0 })
      setSettings(result.settings)
      setDraft(result.settings)
      setNotice('Đã lưu cấu hình ngân hàng. Cấu hình mới áp dụng cho các đơn được tạo tiếp theo.')
    } catch (cause) {
      const failure = failureFrom(cause)
      setError(failure)
      if (failure.status === 401) { setSettings(null); setDraft(null) }
      if (failure.status === 0 || failure.status >= 500) setNeedsRefresh(true)
      if (failure.code === 'VERSION_CONFLICT') {
        setNeedsRefresh(true)
        try {
          const fresh = await adminRequest<{ settings: PaymentSettings }>('/api/admin/payment-settings')
          setSettings(fresh.settings)
          setDraft(fresh.settings)
          setNeedsRefresh(false)
          setError({ ...failure, message: 'Cấu hình đã thay đổi ở nơi khác. Đã tải bản mới; các chỉnh sửa vừa gửi chưa được lưu. Hãy kiểm tra và nhập lại nếu cần.' })
        } catch (refreshError) { setError(failureFrom(refreshError)) }
      }
    } finally { lock.current = false; setBusy(false) }
  }

  function updateField(name: 'bankName' | 'bankBin' | 'accountNumber' | 'accountName', value: string) {
    setDraft((current) => current ? { ...current, [name]: value } : null)
    setNotice(null)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/orders" className="text-sm text-stone-400 hover:text-white">← Quản lý đơn hàng</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-amber-300 font-bold">Fame Drink · Thanh toán</p>
          <h1 className="text-3xl text-white font-black">Tài khoản nhận chuyển khoản</h1>
          <p className="text-sm text-stone-400">Thiết lập ngân hàng của chủ quán để tạo QR thanh toán theo từng đơn.</p>
        </div>
        <button type="button" onClick={refresh} disabled={busy} className="btn btn-ghost text-sm">{busy ? 'Đang xử lý…' : dirty ? 'Bỏ sửa & tải lại' : 'Tải lại cấu hình'}</button>
      </div>
      <FailureNotice error={error} />
      {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}
      {needsRefresh && <p className="text-sm text-amber-200">Cần tải lại cấu hình để kiểm tra dữ liệu mới nhất trước khi lưu tiếp.</p>}

      {settings && draft && (
        <>
          <div className={'rounded-xl border p-4 text-sm ' + (settings.enabled ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/25 bg-amber-400/10 text-amber-100')}>
            Trạng thái đã lưu: <strong>{settings.enabled ? 'Đang mở nhận đơn online' : 'Đang tạm dừng nhận đơn online'}</strong>.
          </div>
          <form onSubmit={save} className="surface rounded-2xl border border-white/10 p-5 sm:p-6 space-y-5">
            <fieldset disabled={busy || needsRefresh} className="space-y-5 disabled:opacity-60">
              <legend className="sr-only">Thông tin ngân hàng nhận tiền</legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bank-name" className="block text-sm text-stone-200 font-semibold">Tên ngân hàng</label>
                  <input id="bank-name" autoComplete="off" value={draft.bankName} onChange={(event) => updateField('bankName', event.target.value)}
                    required={draft.enabled} maxLength={80} placeholder="Nhập tên ngân hàng" className={FIELD_CLASS} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bank-bin" className="block text-sm text-stone-200 font-semibold">Mã BIN ngân hàng</label>
                  <input id="bank-bin" autoComplete="off" inputMode="numeric" value={draft.bankBin} onChange={(event) => updateField('bankBin', event.target.value)}
                    required={draft.enabled} pattern="[0-9]{6}" maxLength={6} placeholder="6 chữ số" aria-describedby="bin-help" className={FIELD_CLASS} />
                  <p id="bin-help" className="text-xs text-stone-400">Mã BIN dùng để định tuyến QR đến đúng ngân hàng. Kiểm tra mã với ngân hàng trước khi mở nhận đơn.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bank-account" className="block text-sm text-stone-200 font-semibold">Số tài khoản</label>
                  <input id="bank-account" autoComplete="off" inputMode="numeric" value={draft.accountNumber} onChange={(event) => updateField('accountNumber', event.target.value.replace(/\s/g, ''))}
                    required={draft.enabled} pattern="[0-9]{6,19}" maxLength={19} placeholder="6–19 chữ số" className={FIELD_CLASS} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bank-holder" className="block text-sm text-stone-200 font-semibold">Tên chủ tài khoản</label>
                  <input id="bank-holder" autoComplete="off" value={draft.accountName} onChange={(event) => updateField('accountName', event.target.value)}
                    required={draft.enabled} maxLength={100} placeholder="Tên hiển thị tại ngân hàng" className={FIELD_CLASS} />
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-stone-300 space-y-2">
                <p>Giai đoạn demo: chỉ giao hàng, phí giao hàng <strong className="text-white">0₫</strong>.</p>
                <p className="text-xs text-stone-400">QR được tạo từ thông tin tài khoản, tổng tiền và mã đơn. Không cần tải ảnh QR lên dịch vụ bên ngoài.</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer text-sm text-white">
                <input type="checkbox" checked={draft.enabled} onChange={(event) => { setDraft({ ...draft, enabled: event.target.checked }); setNotice(null) }}
                  className="mt-1 h-4 w-4 accent-amber-400 shrink-0" />
                <span className="space-y-1"><span className="block font-bold">Mở nhận đơn online</span>
                  <span className="block text-xs text-stone-400">Chỉ bật khi thông tin tài khoản đã được kiểm tra. Tắt sẽ ngừng tạo đơn mới; các đơn đã có vẫn giữ thông tin thanh toán ban đầu.</span>
                </span>
              </label>
              <button type="submit" disabled={!dirty} className="btn btn-gold disabled:opacity-40 disabled:cursor-not-allowed">{busy ? 'Đang lưu…' : 'Lưu cấu hình'}</button>
            </fieldset>
          </form>
          <p className="text-xs text-stone-400 leading-relaxed">
            Đổi tài khoản nhận tiền không thay đổi hướng dẫn chuyển khoản của đơn đã tạo. Khi đối soát một đơn cũ, dùng thông tin ngân hàng hiển thị trong chi tiết đơn đó.
          </p>
        </>
      )}
    </div>
  )
}
