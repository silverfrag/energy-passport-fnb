'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import type { Order, FulfillmentStatus } from '@/lib/orders/types'
import { adminRequest, failureFrom } from './request'
import { dateTime, money, PaymentBadge, FulfillmentBadge, FailureNotice, type AdminFailure } from './shared'

type Action = { action: 'confirm_payment' | 'cancel' } | { action: 'set_fulfillment'; status: FulfillmentStatus }

const NEXT_STATUS: Partial<Record<FulfillmentStatus, { status: FulfillmentStatus; label: string }>> = {
  confirmed: { status: 'preparing', label: 'Bắt đầu pha chế' },
  preparing: { status: 'out_for_delivery', label: 'Đã bàn giao — bắt đầu giao' },
  out_for_delivery: { status: 'completed', label: 'Đã giao xong — hoàn tất đơn' },
  ready: { status: 'completed', label: 'Khách đã nhận — hoàn tất đơn' },
}

export default function OrderDetailClient({ orderId, initialOrder, initialError }: {
  orderId: string; initialOrder: Order | null; initialError: AdminFailure | null
}) {
  const [order, setOrder] = useState(initialOrder)
  const [error, setError] = useState(initialError)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [checkedPayment, setCheckedPayment] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const requestLock = useRef(false)
  const endpoint = '/api/admin/orders/' + encodeURIComponent(orderId)

  async function refresh() {
    if (requestLock.current) return
    requestLock.current = true
    setBusy(true)
    setError(null)
    setNotice(null)
    setCheckedPayment(false)
    setShowCancel(false)
    try {
      const fresh = await adminRequest<{ order: Order }>(endpoint)
      setOrder(fresh.order)
      setNeedsRefresh(false)
    } catch (cause) {
      const failure = failureFrom(cause)
      setError(failure)
      setNeedsRefresh(true)
      if (failure.status === 401 || failure.status === 404) setOrder(null)
    } finally {
      requestLock.current = false
      setBusy(false)
    }
  }

  async function update(action: Action) {
    if (!order || requestLock.current || needsRefresh || (action.action === 'confirm_payment' && !checkedPayment)) return
    requestLock.current = true
    setBusy(true)
    setError(null)
    setNotice(null)
    setCheckedPayment(false)
    setShowCancel(false)
    try {
      const result = await adminRequest<{ order: Order }>(endpoint, 'PATCH', { ...action, version: order.version })
      setOrder(result.order)
      setNotice(action.action === 'confirm_payment' ? 'Máy chủ đã ghi nhận xác nhận nhận tiền và xác nhận đơn.' : 'Đã cập nhật trạng thái đơn.')
    } catch (cause) {
      const failure = failureFrom(cause)
      setError(failure)
      setNeedsRefresh(true)
      if (failure.status === 401) setOrder(null)
      if (failure.code === 'VERSION_CONFLICT') {
        try {
          const fresh = await adminRequest<{ order: Order }>(endpoint)
          setOrder(fresh.order)
          setNeedsRefresh(false)
          setError({ ...failure, message: 'Đơn vừa được cập nhật ở nơi khác. Đã tải trạng thái mới; hãy kiểm tra lại trước khi thao tác.' })
        } catch (refreshError) {
          setError(failureFrom(refreshError))
        }
      }
    } finally {
      requestLock.current = false
      setBusy(false)
    }
  }

  const closed = order?.fulfillmentStatus === 'completed' || order?.fulfillmentStatus === 'cancelled'
  const next = order?.fulfillmentStatus === 'preparing' && order.fulfillment === 'pickup'
    ? { status: 'ready' as FulfillmentStatus, label: 'Đã pha xong — sẵn sàng nhận' }
    : order ? NEXT_STATUS[order.fulfillmentStatus] : undefined
  const controlsDisabled = busy || needsRefresh

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="text-sm text-stone-400 hover:text-white">← Danh sách đơn hàng</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-amber-300 font-bold tracking-widest uppercase">Chi tiết đơn hàng</p>
          <h1 className="text-2xl sm:text-3xl text-white font-black font-mono mt-2 break-all">{order?.code || 'Đơn hàng'}</h1>
          {order && <p className="text-xs text-stone-400 mt-2">Tạo lúc {dateTime(order.createdAt)} · Cập nhật {dateTime(order.updatedAt)}</p>}
        </div>
        <button type="button" disabled={busy} onClick={refresh} className="btn btn-gold text-sm">{busy ? 'Đang xử lý…' : 'Tải lại đơn'}</button>
      </div>
      <FailureNotice error={error} />
      {notice && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</p>}
      {needsRefresh && order && <p className="text-sm text-amber-200">Các nút xử lý đang khóa. Tải lại đơn để kiểm tra kết quả mới nhất trước khi thao tác tiếp.</p>}

      {order && (
        <>
          <div className="flex flex-wrap gap-2"><PaymentBadge status={order.paymentStatus} /><FulfillmentBadge status={order.fulfillmentStatus} /></div>
          <div className="grid lg:grid-cols-2 gap-5">
            <section className="surface rounded-2xl border border-white/10 p-5 space-y-4">
              <h2 className="font-bold text-lg text-white">{order.fulfillment === 'delivery' ? 'Thông tin giao hàng' : 'Thông tin người nhận tại quầy'}</h2>
              <dl className="text-sm space-y-3">
                <div><dt className="text-stone-400">Khách hàng</dt><dd className="text-white font-semibold mt-1 break-words">{order.customer.name}</dd></div>
                <div><dt className="text-stone-400">Số điện thoại</dt><dd className="mt-1"><a href={'tel:' + order.customer.phone} className="text-amber-200 underline">{order.customer.phone}</a></dd></div>
                {order.customer.address && <div><dt className="text-stone-400">Địa chỉ</dt><dd className="text-white mt-1 whitespace-pre-wrap break-words">{order.customer.address}</dd></div>}
                {order.note && <div><dt className="text-stone-400">Ghi chú của khách</dt><dd className="text-white mt-1 whitespace-pre-wrap break-words">{order.note}</dd></div>}
              </dl>
            </section>
            <section className="surface rounded-2xl border border-white/10 p-5 space-y-4">
              <h2 className="font-bold text-lg text-white">Món đã đặt</h2>
              <ul className="space-y-3">
                {order.items.map((item) => <li key={item.productId} className="flex justify-between items-start gap-3 text-sm">
                  <div><p className="text-white font-semibold">{item.quantity} × {item.name}</p><p className="text-xs text-stone-400 mt-1">{money(item.unitPrice)}/ly</p></div>
                  <span className="text-white whitespace-nowrap">{money(item.lineTotal)}</span>
                </li>)}
              </ul>
              <dl className="space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between gap-3 text-stone-300"><dt>Tiền món</dt><dd>{money(order.subtotal)}</dd></div>
                <div className="flex justify-between gap-3 text-stone-300"><dt>Phí giao hàng</dt><dd>{order.deliveryFee === 0 ? '0₫ · Miễn phí' : money(order.deliveryFee)}</dd></div>
                <div className="flex justify-between gap-3 text-lg font-bold text-white"><dt>Tổng thanh toán</dt><dd>{money(order.total)}</dd></div>
              </dl>
            </section>
          </div>

          <section className="surface rounded-2xl border border-white/10 p-5 sm:p-6 space-y-5">
            <h2 className="text-lg font-bold text-white">Đối soát thanh toán</h2>
            {order.payment && (
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-stone-400">Ngân hàng / số tài khoản nhận</dt><dd className="text-white mt-1">{order.payment.bankName} · <span className="font-mono">{order.payment.accountNumber}</span></dd></div>
                <div><dt className="text-stone-400">Tên chủ tài khoản</dt><dd className="text-white mt-1">{order.payment.accountName}</dd></div>
                <div><dt className="text-stone-400">Số tiền cần nhận</dt><dd className="text-xl font-bold text-amber-200 mt-1">{money(order.payment.amount)}</dd></div>
                <div><dt className="text-stone-400">Nội dung chuyển khoản</dt><dd className="text-lg font-bold text-amber-200 font-mono mt-1 break-all">{order.payment.transferContent}</dd></div>
              </dl>
            )}

            {order.paymentStatus === 'paid' ? (
              <p className="text-sm text-emerald-300">Đã được quản trị xác nhận nhận đủ tiền{order.paidAt ? ' lúc ' + dateTime(order.paidAt) : ''}.</p>
            ) : closed ? <p className="text-sm text-stone-400">Đơn đã kết thúc. Không thể xác nhận nhận tiền.</p>
            : order.paymentStatus === 'pending_quote' || order.total === null ? (
              <p className="text-sm text-amber-200">Đơn này chưa có tổng thanh toán hợp lệ. Không xác nhận nhận tiền cho đơn này; hãy kiểm tra lại với người quản trị.</p>
            ) : (
              <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 space-y-4">
                <p className="text-sm text-amber-100 leading-relaxed">{order.paymentStatus === 'payment_review'
                  ? 'Khách đã báo chuyển khoản. Đây chưa phải xác nhận ngân hàng đã ghi có.'
                  : 'Đơn đang chờ chuyển khoản. Chỉ xác nhận sau khi thấy giao dịch ghi có thực tế.'}</p>
                <label className="flex items-start gap-3 text-sm text-white cursor-pointer">
                  <input type="checkbox" checked={checkedPayment} onChange={(event) => setCheckedPayment(event.target.checked)}
                    disabled={controlsDisabled} className="mt-1 w-4 h-4 accent-amber-400 shrink-0" />
                  <span>Đã kiểm tra và nhận đủ tiền: <strong>{money(order.total)}</strong> với nội dung <strong className="font-mono">{order.code}</strong> trong tài khoản ngân hàng.</span>
                </label>
                <button type="button" disabled={controlsDisabled || !checkedPayment} onClick={() => update({ action: 'confirm_payment' })}
                  className="btn btn-gold disabled:opacity-40 disabled:cursor-not-allowed">Xác nhận đã nhận đủ tiền</button>
              </div>
            )}
          </section>

          <section className="surface rounded-2xl border border-white/10 p-5 space-y-4">
            <h2 className="text-lg font-bold text-white">Tiến độ xử lý</h2>
            {closed ? <p className="text-sm text-stone-300">{order.fulfillmentStatus === 'completed' ? 'Đơn hàng đã hoàn tất.' : 'Đơn hàng đã hủy.'}</p>
            : order.paymentStatus !== 'paid' ? <p className="text-sm text-stone-400">Xác nhận đã nhận tiền trước khi bắt đầu pha chế và giao hàng.</p>
            : next ? <button type="button" disabled={controlsDisabled} onClick={() => update({ action: 'set_fulfillment', status: next.status })} className="btn btn-gold">{next.label}</button>
            : <p className="text-sm text-stone-400">Tải lại đơn để kiểm tra bước xử lý tiếp theo.</p>}
            {!closed && order.paymentStatus === 'paid' && <p className="text-xs text-stone-400">Đơn đã nhận tiền không thể hủy trong màn hình này. Nếu có vấn đề, đối soát và xử lý hoàn tiền trực tiếp với khách.</p>}
            {!closed && order.paymentStatus !== 'paid' && (
              showCancel ? <div className="border border-red-400/25 rounded-xl bg-red-400/5 p-4 space-y-3">
                <p className="text-sm text-red-100">Hủy đơn {order.code}? Hãy kiểm tra chưa nhận tiền và trao đổi với khách trước khi hủy. Thao tác này không hoàn tiền.</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={controlsDisabled} onClick={() => update({ action: 'cancel' })} className="btn btn-ghost border-red-400/40 text-red-200">Xác nhận hủy đơn</button>
                  <button type="button" disabled={busy} onClick={() => setShowCancel(false)} className="btn btn-ghost">Giữ đơn</button>
                </div>
              </div> : <button type="button" disabled={controlsDisabled} onClick={() => setShowCancel(true)} className="text-sm text-red-300 underline">Hủy đơn chưa thanh toán</button>
            )}
          </section>
        </>
      )}
    </div>
  )
}
