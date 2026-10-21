'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Order, FulfillmentStatus, PaymentStatus } from '@/lib/orders/types'
import { formatMoney } from './cart-model'
import { orderAccessKey, readAccessToken, useBrowserReady, useStoredValue } from './browser-storage'
import { FANPAGE_URL, OrderApiError, orderRequest } from './order-api'

const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  unconfirmed: 'Chờ Fame xác nhận',
  confirmed: 'Đã xác nhận đơn',
  preparing: 'Đang chuẩn bị món',
  ready: 'Món đã sẵn sàng',
  out_for_delivery: 'Đang giao hàng',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy đơn',
}
const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending_quote: 'Chờ xác nhận số tiền',
  awaiting_payment: 'Chờ chuyển khoản',
  payment_review: 'Đang chờ đối soát',
  paid: 'Đã xác nhận nhận tiền',
}
const BUTTON_CLASS = 'inline-flex min-h-11 items-center justify-center rounded-full bg-[#b94720] px-5 py-3 text-sm font-bold text-white hover:bg-[#963716] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720] disabled:cursor-not-allowed disabled:opacity-50'

function TransferField({ label, value }: { label: string; value: string }) {
  const [notice, setNotice] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setNotice('Đã sao chép.')
    } catch {
      setNotice('Bạn có thể chọn và sao chép nội dung trong ô bên dưới.')
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs text-[#756457]">{label}
          <input readOnly value={value} aria-label={label} onFocus={(event) => event.target.select()} className="mt-1 block w-full min-w-0 border-0 bg-transparent text-sm font-bold text-[#35251c] outline-offset-2" />
        </label>
        <button type="button" onClick={copy} className="min-h-11 flex-shrink-0 rounded-lg px-2 text-xs font-semibold text-[#a63d1b] underline underline-offset-4">Sao chép</button>
      </div>
      <p role="status" className={notice ? 'mt-1 text-xs text-[#756457]' : 'sr-only'}>{notice}</p>
    </div>
  )
}

function PaymentQr({ payload, code }: { payload: string; code: string }) {
  const [image, setImage] = useState('')
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true
    import('qrcode').then((qr) => qr.toDataURL(payload, { width: 360, margin: 3, errorCorrectionLevel: 'M' }))
      .then((url) => { if (active) setImage(url) })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [payload])
  if (failed) return <p className="rounded-xl bg-[#fff6e9] p-4 text-sm text-[#81502d]">Chưa hiển thị được QR. Bạn có thể chuyển khoản bằng thông tin bên dưới.</p>
  if (!image) return <div className="mx-auto aspect-square w-full max-w-[280px] animate-pulse rounded-2xl bg-[#f4efe7]" role="status" aria-label="Đang tạo mã QR" />
  // The QR is generated in this browser; account/order details are not sent to an image service.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image} alt={`Mã QR chuyển khoản cho đơn ${code}`} width={360} height={360} className="mx-auto h-auto w-full max-w-[280px] rounded-2xl border border-[#e8ddcf] bg-white" />
}

export default function OrderStatusClient({ orderId }: { orderId: string }) {
  const ready = useBrowserReady()
  const raw = useStoredValue(orderAccessKey(orderId))
  const token = readAccessToken(raw)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)
  const [error, setError] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!token) return
    let active = true
    orderRequest<{ order: Order }>(`/api/orders/${encodeURIComponent(orderId)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((result) => { if (active) { setOrder(result.order); setError(''); setAccessDenied(false) } })
      .catch((cause) => {
        if (!active) return
        if (cause instanceof OrderApiError && (cause.status === 401 || cause.status === 404)) {
          setAccessDenied(true)
          setOrder(null)
          setError('Chưa thể xác thực quyền xem đơn trên trình duyệt này. Hãy mở lại bằng trình duyệt đã đặt món hoặc nhắn Fame.')
        } else setError(cause instanceof OrderApiError ? cause.message : 'Chưa tải được cập nhật. Vui lòng kiểm tra kết nối rồi thử lại.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [orderId, token, attempt])

  function refresh() { setLoading(true); setAttempt((value) => value + 1) }

  async function reportTransfer() {
    if (!token || !order || busy || order.paymentStatus !== 'awaiting_payment' || order.fulfillmentStatus === 'cancelled') return
    setBusy(true)
    setError('')
    try {
      const result = await orderRequest<{ order: Order }>(`/api/orders/${encodeURIComponent(orderId)}/payment-review`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      setOrder(result.order)
      setNotice('Đã gửi thông báo. Fame sẽ kiểm tra tiền vào tài khoản trước khi xác nhận thanh toán.')
    } catch (cause) {
      if (cause instanceof OrderApiError && cause.status === 409) {
        setError('Đơn vừa thay đổi. Đang tải trạng thái mới để bạn kiểm tra lại.')
        refresh()
      } else if (cause instanceof OrderApiError && (cause.status === 401 || cause.status === 404)) {
        setAccessDenied(true)
        setOrder(null)
        setError('Quyền xem đơn chưa hợp lệ. Hãy dùng trình duyệt đã đặt món hoặc nhắn Fame.')
      } else setError(cause instanceof OrderApiError ? cause.message : 'Chưa gửi được thông báo. Bạn có thể tải lại trạng thái rồi thử lại.')
    } finally { setBusy(false) }
  }

  if (!ready) return <div className="mx-auto max-w-6xl px-4 py-12 text-[#756457]" role="status">Đang mở thông tin theo dõi…</div>

  if (!token || accessDenied) return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-3xl border border-[#e8ddcf] bg-white p-7">
        <h1 className="text-2xl font-extrabold text-[#35251c]">Thông tin đơn được giữ riêng tư</h1>
        <p role="alert" className="mt-3 text-sm leading-relaxed text-[#756457]">{error || 'Hãy mở trang này trên trình duyệt bạn đã dùng để đặt món. Đường dẫn đơn hàng không chứa quyền xem thông tin người nhận.'}</p>
        <a href={FANPAGE_URL} target="_blank" rel="noopener noreferrer" className={`mt-6 ${BUTTON_CLASS}`}>Nhắn Fame để hỗ trợ ↗</a>
        {token && <button type="button" onClick={refresh} disabled={loading} className="mt-3 min-h-11 w-full text-sm font-bold text-[#71533e]">{loading ? 'Đang kiểm tra…' : 'Kiểm tra lại quyền xem'}</button>}
        <Link href="/menu" className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[#756457]">Về menu</Link>
      </div>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b94720]">Theo dõi đơn giao hàng</p>
          <h1 className="mt-2 break-all text-2xl font-extrabold tracking-tight text-[#35251c] sm:text-3xl">{order ? `Đơn ${order.code}` : 'Đơn hàng của bạn'}</h1>
        </div>
        <button type="button" onClick={refresh} disabled={loading || busy} className="inline-flex min-h-11 items-center rounded-full border border-[#d8c9b7] bg-white px-4 text-sm font-bold text-[#71533e] disabled:opacity-50">{loading ? 'Đang cập nhật…' : 'Cập nhật trạng thái ↻'}</button>
      </header>
      {error && <p role="alert" className="mb-5 rounded-xl border border-[#e7b6a6] bg-[#fff0eb] p-4 text-sm text-[#963716]">{error}{order && ' Thông tin bên dưới là lần cập nhật gần nhất.'}</p>}
      {notice && <p role="status" className="mb-5 rounded-xl bg-[#eef3e5] p-4 text-sm text-[#476438]">{notice}</p>}
      {!order ? <p role="status" className="py-8 text-sm text-[#756457]">{loading ? 'Đang tải đơn hàng…' : 'Chưa tải được đơn. Bấm cập nhật trạng thái để thử lại.'}</p> : (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <section className="rounded-3xl border border-[#e8ddcf] bg-white p-5 sm:p-6" aria-labelledby="order-status-heading">
              <h2 id="order-status-heading" className="text-lg font-bold text-[#35251c]">Trạng thái đơn</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div><dt className="text-xs text-[#756457]">Thanh toán</dt><dd className={`mt-1 font-bold ${order.paymentStatus === 'paid' ? 'text-[#476438]' : 'text-[#a4522c]'}`}>{PAYMENT_LABELS[order.paymentStatus]}</dd></div>
                <div><dt className="text-xs text-[#756457]">Giao hàng</dt><dd className="mt-1 font-bold text-[#35251c]">{FULFILLMENT_LABELS[order.fulfillmentStatus]}</dd></div>
              </dl>
              <p className="mt-4 text-xs text-[#756457]">Cập nhật: {new Date(order.updatedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
              {order.fulfillmentStatus === 'cancelled' && <p className="mt-4 rounded-xl bg-[#fff0eb] p-3 text-sm text-[#963716]">Đơn đã hủy. Vui lòng không chuyển khoản cho đơn này. Nếu đã chuyển, hãy nhắn Fame để đối soát.</p>}
            </section>

            <section className="rounded-3xl border border-[#e8ddcf] bg-white p-5 sm:p-6" aria-labelledby="order-summary-heading">
              <h2 id="order-summary-heading" className="text-lg font-bold text-[#35251c]">Món trong đơn</h2>
              <ul className="mt-3 divide-y divide-[#eee3d5]">
                {order.items.map((item) => <li key={`${item.productId}:${item.size ?? 'M'}`} className="flex justify-between gap-4 py-3 text-sm"><div><p className="font-semibold text-[#35251c]">{item.name}</p><p className="mt-1 text-xs text-[#756457]">Size {item.size ?? 'M'} · {item.quantity} ly × {formatMoney(item.unitPrice)}</p></div><span className="whitespace-nowrap font-semibold text-[#71533e]">{formatMoney(item.lineTotal)}</span></li>)}
              </ul>
              <dl className="mt-2 space-y-3 border-t border-[#e8ddcf] pt-4 text-sm">
                <div className="flex justify-between gap-4 text-[#756457]"><dt>Tiền món</dt><dd>{formatMoney(order.subtotal)}</dd></div>
                <div className="flex justify-between gap-4 text-[#756457]"><dt>Giao hàng{order.deliveryFee === 0 ? ' (demo)' : ''}</dt><dd>{order.deliveryFee === null ? 'Chờ xác nhận' : formatMoney(order.deliveryFee)}</dd></div>
                <div className="flex justify-between gap-4 text-lg font-extrabold text-[#35251c]"><dt>Tổng đơn</dt><dd>{order.total === null ? 'Chờ xác nhận' : formatMoney(order.total)}</dd></div>
              </dl>
            </section>

            <section className="rounded-3xl border border-[#e8ddcf] bg-white p-5 sm:p-6" aria-labelledby="recipient-heading">
              <h2 id="recipient-heading" className="text-lg font-bold text-[#35251c]">Thông tin giao hàng</h2>
              <p className="mt-3 text-sm font-semibold text-[#493326]">{order.customer.name} · {order.customer.phone}</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#756457]">{order.customer.address}</p>
              {order.note && <div className="mt-4 border-t border-[#eee3d5] pt-4"><p className="text-xs font-semibold text-[#756457]">Ghi chú</p><p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#493326]">{order.note}</p></div>}
            </section>
          </div>

          <div className="space-y-6">
            {order.paymentStatus === 'paid' ? (
              <section className="rounded-3xl border border-[#d4e1c6] bg-[#eef3e5] p-6">
                <h2 className="text-xl font-bold text-[#476438]">Fame đã xác nhận nhận tiền</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#476438]">Bạn không cần chuyển khoản thêm. Theo dõi phần trạng thái giao hàng để xem tiến độ món.</p>
              </section>
            ) : order.fulfillmentStatus !== 'cancelled' && order.payment ? (
              <section className="rounded-3xl border border-[#e8ddcf] bg-white p-5 sm:p-6" aria-labelledby="payment-heading">
                <h2 id="payment-heading" className="text-xl font-bold text-[#35251c]">Chuyển khoản cho đơn này</h2>
                <p className="mb-5 mt-2 text-sm leading-relaxed text-[#756457]">Quét QR bằng ứng dụng ngân hàng. Kiểm tra đúng người nhận, số tiền và nội dung trước khi xác nhận.</p>
                <PaymentQr key={order.payment.qrPayload} payload={order.payment.qrPayload} code={order.code} />
                <div className="mt-5 space-y-4 rounded-2xl bg-[#fffaf2] p-4">
                  <TransferField label="Ngân hàng" value={order.payment.bankName} />
                  <TransferField label="Chủ tài khoản" value={order.payment.accountName} />
                  <TransferField label="Số tài khoản" value={order.payment.accountNumber} />
                  <TransferField label="Số tiền (VND)" value={String(order.payment.amount)} />
                  <TransferField label="Nội dung chuyển khoản" value={order.payment.transferContent} />
                </div>
                {order.paymentStatus === 'payment_review' ? <p className="mt-5 rounded-xl bg-[#fff6e9] p-4 text-sm text-[#81502d]">Fame đã nhận thông báo và đang chờ đối soát. Không cần chuyển khoản lại.</p> : (
                  <button type="button" onClick={reportTransfer} disabled={busy || loading || order.paymentStatus !== 'awaiting_payment'} className={`mt-5 w-full ${BUTTON_CLASS}`}>{busy ? 'Đang gửi thông báo…' : 'Tôi đã chuyển khoản'}</button>
                )}
                <p className="mt-3 text-xs leading-relaxed text-[#756457]">Nút này chỉ thông báo cho Fame. Đơn được ghi nhận đã thanh toán khi Fame kiểm tra và xác nhận tiền vào tài khoản.</p>
              </section>
            ) : order.fulfillmentStatus !== 'cancelled' ? <p className="rounded-2xl border border-[#ead4bf] bg-[#fff6e9] p-5 text-sm text-[#81502d]">Vui lòng chờ Fame xác nhận số tiền. Chưa có yêu cầu chuyển khoản cho đơn này.</p> : null}

            <div className="rounded-3xl border border-[#e8ddcf] p-5 sm:p-6">
              <p className="text-sm font-bold text-[#35251c]">Cần hỗ trợ đơn hàng?</p>
              <p className="mt-2 text-sm text-[#756457]">Nhắn Fame và gửi mã đơn {order.code} để được kiểm tra.</p>
              <a href={FANPAGE_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-[#a63d1b]">Mở fanpage Fame ↗</a>
              <p className="mt-3 text-xs leading-relaxed text-[#756457]">Quyền xem chi tiết được lưu trên trình duyệt này. Chia sẻ đường dẫn không cấp quyền xem thông tin người nhận.</p>
            </div>
          </div>
        </div>
      )}
      <Link href="/menu" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-[#71533e]">← Về menu</Link>
    </div>
  )
}
