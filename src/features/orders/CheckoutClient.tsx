'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ProductSize } from '@/lib/constants/product-sizes'
import type { Order } from '@/lib/orders/types'
import { useCart } from './CartProvider'
import { LAST_ORDER_KEY, PENDING_ORDER_KEY, formatMoney } from './cart-model'
import { orderAccessKey, readStoredValue, removeStoredValue, useStoredValue, writeStoredValue } from './browser-storage'
import { parsePendingOrder, type PendingOrder } from './checkout-draft'
import { FANPAGE_URL, OrderApiError, orderRequest, type OrderConfig } from './order-api'

const INPUT_CLASS = 'fd-input'
const BUTTON_CLASS = 'fd-checkout-submit'

export default function CheckoutClient() {
  const cart = useCart()
  const router = useRouter()
  const pendingRaw = useStoredValue(PENDING_ORDER_KEY)
  const { pending, invalid: invalidPending } = useMemo(() => parsePendingOrder(pendingRaw), [pendingRaw])
  const lastOrderRaw = useStoredValue(LAST_ORDER_KEY)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [note, setNote] = useState('')
  const [config, setConfig] = useState<OrderConfig | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configAttempt, setConfigAttempt] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [conflict, setConflict] = useState(false)
  const inFlight = useRef(false)

  useEffect(() => {
    let active = true
    orderRequest<OrderConfig>('/api/orders/config')
      .then((result) => { if (active) setConfig(result) })
      .catch(() => { if (active) setConfig(null) })
      .finally(() => { if (active) setConfigLoading(false) })
    return () => { active = false }
  }, [configAttempt])

  const displayItems = pending?.items ?? cart.items
  const subtotal = displayItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const quantity = displayItems.reduce((sum, item) => sum + item.quantity, 0)
  const available = Boolean(config?.orderingAvailable && config.deliveryAvailable && config.deliveryFee === 0)
  const locked = busy || Boolean(pending) || invalidPending
  const displayedCustomer = pending?.input.customer ?? customer
  const displayedNote = pending?.input.note ?? note
  let lastOrderId: string | null = null
  try {
    const last = JSON.parse(lastOrderRaw || 'null')
    if (last?.version === 1 && /^[0-9a-f-]{36}$/i.test(last.id)) lastOrderId = last.id
  } catch { /* No recent order stored. */ }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current || invalidPending || conflict || (!available && !pending)) return
    setError('')
    let draft = parsePendingOrder(readStoredValue(PENDING_ORDER_KEY)).pending
    if (!draft) {
      const phone = customer.phone.trim().replace(/[\s().-]/g, '').replace(/^\+84/, '0')
      if (!/^0[35789]\d{8}$/.test(phone)) { setError('Vui lòng nhập số di động Việt Nam hợp lệ, ví dụ 0912345678.'); return }
      if (!customer.name.trim() || customer.address.trim().length < 8) { setError('Hãy nhập tên và địa chỉ giao hàng đầy đủ.'); return }
      if (!cart.items.length) { setError('Giỏ hàng chưa có món.'); return }
      draft = {
        version: 1,
        input: {
          idempotencyKey: crypto.randomUUID(),
          fulfillment: 'delivery',
          customer: { name: customer.name.trim(), phone, address: customer.address.trim() },
          note: note.trim(),
          items: cart.items.map((item) => ({ productId: item.productId, size: item.size, quantity: item.quantity })),
        },
        items: cart.items,
      } satisfies PendingOrder
      if (!writeStoredValue(PENDING_ORDER_KEY, JSON.stringify(draft))) {
        setError('Trình duyệt chưa cho phép lưu thông tin theo dõi đơn. Hãy bật bộ nhớ trang web hoặc nhắn Fame để đặt món. Chưa gửi đơn.')
        return
      }
    }
    inFlight.current = true
    setBusy(true)
    try {
      const result = await orderRequest<{ order: Order; accessToken: string }>('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft.input),
      })
      if (!result.order?.id || !/^[A-Za-z0-9_-]{43}$/.test(result.accessToken)) throw new Error('Incomplete order response')
      if (!writeStoredValue(orderAccessKey(result.order.id), JSON.stringify({ version: 1, accessToken: result.accessToken }))) {
        setError(`Đơn ${result.order.code} đã được ghi nhận, nhưng trình duyệt chưa lưu được quyền theo dõi. Bật bộ nhớ trang web rồi bấm kiểm tra lại; không cần gửi một đơn mới.`)
        return
      }
      writeStoredValue(LAST_ORDER_KEY, JSON.stringify({ version: 1, id: result.order.id, code: result.order.code }))
      cart.removeOrdered(draft.input.items)
      removeStoredValue(PENDING_ORDER_KEY)
      router.push(`/orders/${result.order.id}`)
    } catch (cause) {
      if (cause instanceof OrderApiError) {
        if (cause.status === 400 || cause.code === 'ITEM_UNAVAILABLE' || cause.code === 'ORDERING_DISABLED') {
          removeStoredValue(PENDING_ORDER_KEY)
          setCustomer({ name: draft.input.customer.name, phone: draft.input.customer.phone, address: draft.input.customer.address || '' })
          setNote(draft.input.note || '')
        }
        if (cause.code === 'IDEMPOTENCY_CONFLICT') setConflict(true)
        setError(cause.code === 'IDEMPOTENCY_CONFLICT'
          ? 'Thông tin gửi đơn không khớp bản đã lưu. Hãy xem đơn gần nhất hoặc nhắn Fame kiểm tra trước khi đặt lại.'
          : cause.message)
      } else {
        setError('Chưa nhận được kết quả gửi đơn. Thông tin được giữ nguyên; bấm “Kiểm tra đơn đã gửi” để thử lại an toàn, tránh tạo đơn trùng.')
      }
    } finally { inFlight.current = false; setBusy(false) }
  }

  function changeQuantity(productId: string, next: number, size: ProductSize) {
    setError(cart.setQuantity(productId, next, size) || '')
  }

  if (!cart.ready) return <div className="mx-auto max-w-6xl px-4 py-12 text-[#756457]" role="status">Đang mở giỏ hàng…</div>

  return (
    <div className="fd-checkout">
      <Link href="/menu" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#756457] hover:text-[#b94720]">← Chọn thêm món</Link>
      <header className="mb-7 mt-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b94720]">Giao hàng tận nơi</p>
        <h1 className="fd-checkout-title mt-2">Giỏ hàng của bạn</h1>
        <p className="mt-3 text-sm text-[#756457]">Phí giao hàng 0₫ đang áp dụng cho bản demo. Fame xác nhận chuyển khoản thủ công.</p>
        <ol className="fd-checkout-steps" aria-label="Các bước đặt hàng"><li><span><b>01</b> Giỏ hàng & địa chỉ</span></li><li><span><b>02</b> Chuyển khoản</span></li><li><span><b>03</b> Fame xác nhận</span></li></ol>
      </header>

      {lastOrderId && <Link href={`/orders/${lastOrderId}`} className="mb-5 inline-flex min-h-11 items-center rounded-full border border-[#d8c9b7] bg-white px-4 text-sm font-semibold text-[#71533e]">Xem đơn gần nhất →</Link>}
      {cart.notice && <p role="status" className="mb-5 rounded-xl bg-[#fff0df] p-4 text-sm text-[#81502d]">{cart.notice}</p>}
      {invalidPending && <p role="alert" className="mb-5 rounded-xl border border-[#d49c76] bg-[#fff0df] p-4 text-sm text-[#81502d]">Có thông tin gửi đơn cũ chưa đọc được. Hãy xem đơn gần nhất hoặc nhắn Fame kiểm tra trước khi gửi đơn mới.</p>}
      {pending && <p role="status" className="mb-5 rounded-xl border border-[#d7c9b9] bg-white p-4 text-sm text-[#71533e]">Đang giữ nguyên yêu cầu đã gửi. Nút kiểm tra bên dưới dùng lại cùng mã đơn để tránh đặt trùng, kể cả sau khi tải lại trang.</p>}

      {!displayItems.length && !invalidPending ? (
        <div className="fd-checkout-empty">
          <span className="fd-empty-symbol" aria-hidden="true">✳</span><h2 className="text-xl font-bold text-[#35251c]">Một ly ngon đang chờ bạn.</h2>
          <p className="mt-2 text-sm text-[#756457]">Ghé menu để chọn cà phê, matcha hoặc trà trái cây nhé.</p>
          <Link href="/menu" className={`mt-6 ${BUTTON_CLASS}`}>Xem menu</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="fd-checkout-form">
          <section className="fd-cart-panel" aria-labelledby="cart-items-heading">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="cart-items-heading" className="text-xl font-bold text-[#35251c]">Món đã chọn</h2>
              <span className="text-sm text-[#756457]">{quantity} ly</span>
            </div>
            <ul className="divide-y divide-[#eee3d5]">
              {displayItems.map((item) => (
                <li key={`${item.productId}:${item.size}`} className="fd-cart-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" width={80} height={80} className="fd-cart-thumbnail" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/menu/${item.productId}`} className="text-sm font-bold leading-snug text-[#35251c] hover:text-[#b94720]">{item.name}</Link>
                    <p className="mt-1 text-xs text-[#756457]">Size {item.size} · {formatMoney(item.unitPrice)} / ly</p><p className="fd-cart-line-total">{formatMoney(item.unitPrice * item.quantity)}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full border border-[#d8c9b7]">
                        <button type="button" disabled={locked || item.quantity <= 1} onClick={() => changeQuantity(item.productId, item.quantity - 1, item.size)} aria-label={`Giảm số lượng ${item.name}, size ${item.size}`} className="h-11 w-11 rounded-full text-lg text-[#71533e] disabled:opacity-30">−</button>
                        <span aria-label={`${item.quantity} ly`} className="min-w-6 text-center text-sm font-bold text-[#35251c]">{item.quantity}</span>
                        <button type="button" disabled={locked || item.quantity >= 20 || quantity >= 50} onClick={() => changeQuantity(item.productId, item.quantity + 1, item.size)} aria-label={`Tăng số lượng ${item.name}, size ${item.size}`} className="h-11 w-11 rounded-full text-lg text-[#71533e] disabled:opacity-30">+</button>
                      </div>
                      <button type="button" disabled={locked} onClick={() => setError(cart.removeItem(item.productId, item.size) || '')} aria-label={`Xóa ${item.name}, size ${item.size} khỏi giỏ`} className="min-h-10 px-2 text-xs font-semibold text-[#a63d1b] underline underline-offset-4 disabled:opacity-40">Xóa</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-3 border-t border-[#e8ddcf] pt-5 text-sm">
              <div className="flex justify-between gap-4 text-[#756457]"><dt>Tiền món tạm tính</dt><dd>{formatMoney(subtotal)}</dd></div>
              <div className="flex justify-between gap-4 text-[#756457]"><dt>Giao hàng <span className="text-xs">(demo)</span></dt><dd>0₫</dd></div>
              <div className="flex justify-between gap-4 text-lg font-extrabold text-[#35251c]"><dt>Tổng tạm tính</dt><dd>{formatMoney(subtotal)}</dd></div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-[#756457]">Giá được kiểm tra lại khi gửi đơn. Bạn sẽ thấy số tiền chính xác trước khi chuyển khoản.</p>
          </section>

          <section className="fd-delivery-panel" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="text-xl font-bold text-[#35251c]">Giao đến địa chỉ của bạn</h2>
            <fieldset disabled={locked} className="mt-5 space-y-4">
              <legend className="sr-only">Thông tin người nhận</legend>
              <label className="block text-sm font-semibold text-[#493326]">Tên người nhận <span className="text-[#a63d1b]">*</span>
                <input name="name" autoComplete="name" required maxLength={100} value={displayedCustomer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} className={INPUT_CLASS} />
              </label>
              <label className="block text-sm font-semibold text-[#493326]">Số điện thoại <span className="text-[#a63d1b]">*</span>
                <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={24} value={displayedCustomer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} className={INPUT_CLASS} placeholder="0912345678" />
              </label>
              <label className="block text-sm font-semibold text-[#493326]">Địa chỉ giao hàng <span className="text-[#a63d1b]">*</span>
                <textarea name="address" autoComplete="street-address" required minLength={8} maxLength={400} rows={3} value={displayedCustomer.address || ''} onChange={(event) => setCustomer({ ...customer, address: event.target.value })} className={INPUT_CLASS} placeholder="Số nhà, tên đường, phường/xã, tỉnh/thành phố" />
              </label>
              <label className="block text-sm font-semibold text-[#493326]">Ghi chú <span className="font-normal text-[#756457]">(không bắt buộc)</span>
                <textarea name="note" maxLength={500} rows={3} value={displayedNote} onChange={(event) => setNote(event.target.value)} className={INPUT_CLASS} placeholder="Yêu cầu riêng cho món hoặc hướng dẫn giao hàng" />
              </label>
            </fieldset>

            {configLoading ? <p role="status" className="mt-5 text-sm text-[#756457]">Đang kiểm tra khả năng nhận đơn…</p> : !available ? (
              <div className="mt-5 rounded-xl border border-[#ead4bf] bg-[#fff6e9] p-4 text-sm text-[#81502d]">
                <p>{config?.message || 'Đặt món online chưa sẵn sàng. Bạn vẫn có thể chọn món và nhắn Fame qua fanpage.'}</p>
                <p className="mt-1">Chưa yêu cầu chuyển khoản.</p>
                <button type="button" onClick={() => { setConfigLoading(true); setConfigAttempt((value) => value + 1) }} className="mt-2 min-h-10 font-bold underline underline-offset-4">Kiểm tra lại</button>
              </div>
            ) : null}
            {error && <p role="alert" className="mt-5 rounded-xl border border-[#e7b6a6] bg-[#fff0eb] p-4 text-sm text-[#963716]">{error}</p>}
            <button type="submit" disabled={busy || invalidPending || conflict || (!available && !pending) || (!displayItems.length && !pending)} className={`mt-5 w-full ${BUTTON_CLASS}`}>
              {busy ? 'Đang kiểm tra đơn…' : pending ? 'Kiểm tra đơn đã gửi' : 'Gửi đơn & xem mã chuyển khoản'}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-[#756457]">Fame xác nhận sau khi kiểm tra tiền vào tài khoản. Thông tin đang gửi và quyền xem đơn được lưu trên trình duyệt này.</p>
            <a href={FANPAGE_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#d8c9b7] px-4 text-sm font-bold text-[#71533e] hover:border-[#b94720]">Nhắn Fame trên Facebook ↗</a>
          </section>
        </form>
      )}
    </div>
  )
}
