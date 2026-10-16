'use client'

import Link from 'next/link'
import { useState } from 'react'
import { adminRequest, failureFrom } from './request'
import { dateTime, money, PaymentBadge, FulfillmentBadge, FailureNotice, type AdminFailure, type OrdersPageData } from './shared'

export default function OrdersClient({ initialData, initialError }: { initialData: OrdersPageData | null; initialError: AdminFailure | null }) {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(initialError)
  const [offset, setOffset] = useState(0)
  const [busy, setBusy] = useState(false)

  async function load(nextOffset = offset) {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      const fresh = await adminRequest<OrdersPageData>('/api/admin/orders?offset=' + nextOffset + '&limit=30')
      setData(fresh)
      setOffset(nextOffset)
    } catch (cause) {
      setError(failureFrom(cause))
      setData(null)
    } finally { setBusy(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-300">Fame Drink · Quản trị</p>
          <h1 className="text-3xl font-black text-white">Đơn hàng online</h1>
          <p className="text-sm text-stone-400">Đối soát chuyển khoản, chuẩn bị món và cập nhật giao hàng.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => load()} disabled={busy} className="btn btn-gold text-sm">{busy ? 'Đang tải…' : 'Tải lại danh sách'}</button>
          <Link href="/admin/payment-settings" className="btn btn-ghost text-sm">Cấu hình ngân hàng</Link>
        </div>
      </div>
      <FailureNotice error={error} />
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-stone-300">
        Khách bấm “Đã chuyển khoản” chỉ đưa đơn vào chờ đối soát. Chỉ xác nhận đã nhận tiền sau khi kiểm tra giao dịch trong tài khoản ngân hàng.
      </div>
      {data && (
        <>
          <p className="text-sm text-stone-400">{data.total} đơn · Mới nhất trước{data.orders.length > 0 ? ' · Hiển thị ' + (offset + 1) + '–' + (offset + data.orders.length) : ''}</p>
          {data.orders.length === 0 ? (
            <div className="surface rounded-2xl border border-white/10 p-8 text-center space-y-2">
              <h2 className="font-bold text-xl text-white">Chưa có đơn hàng</h2>
              <p className="text-sm text-stone-400">Đơn mới sẽ xuất hiện ở đây sau khi khách gửi đơn thành công.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.orders.map((order) => (
                <article key={order.id} className="surface rounded-2xl border border-white/10 p-4 sm:p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link href={'/admin/orders/' + order.id} className="text-base font-bold font-mono text-amber-200 hover:underline">{order.code}</Link>
                      <p className="text-xs text-stone-400 mt-1">{dateTime(order.createdAt)}</p>
                    </div>
                    <p className="text-lg font-black text-white">{money(order.total)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2"><PaymentBadge status={order.paymentStatus} /><FulfillmentBadge status={order.fulfillmentStatus} /></div>
                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-3">
                    <div className="text-sm space-y-1 min-w-0">
                      <p className="text-white font-semibold break-words">{order.customer.name} <span className="text-stone-400 font-normal">· {order.customer.phone}</span></p>
                      <p className="text-stone-400">{order.fulfillment === 'delivery' ? 'Giao hàng' : 'Nhận tại quầy'} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} ly</p>
                    </div>
                    <Link href={'/admin/orders/' + order.id} className="btn btn-ghost text-sm">Xử lý đơn →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <button type="button" disabled={busy || offset === 0} onClick={() => load(Math.max(0, offset - 30))} className="btn btn-ghost text-sm disabled:opacity-40">← Trang trước</button>
            <span className="text-xs text-stone-400">Trang {Math.floor(offset / 30) + 1}</span>
            <button type="button" disabled={busy || !data.hasMore} onClick={() => load(offset + 30)} className="btn btn-ghost text-sm disabled:opacity-40">Trang sau →</button>
          </div>
        </>
      )}
    </div>
  )
}
