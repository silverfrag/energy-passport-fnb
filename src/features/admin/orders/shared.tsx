import Link from 'next/link'
import type { Order, PaymentStatus, FulfillmentStatus } from '@/lib/orders/types'

export interface AdminFailure { status: number; code: string; message: string }
export interface OrdersPageData { orders: Order[]; total: number; hasMore: boolean }

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending_quote: 'Chưa có tổng thanh toán',
  awaiting_payment: 'Chờ chuyển khoản',
  payment_review: 'Khách báo đã chuyển · cần đối soát',
  paid: 'Đã xác nhận nhận tiền',
}
export const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  unconfirmed: 'Chưa xác nhận',
  confirmed: 'Đã xác nhận đơn',
  preparing: 'Đang pha chế',
  ready: 'Sẵn sàng nhận',
  out_for_delivery: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
}
export function money(value: number | null) {
  return value === null ? 'Chưa xác định' : new Intl.NumberFormat('vi-VN').format(value) + '₫'
}
export function dateTime(value: string) {
  return new Date(value).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const color = status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    : status === 'payment_review' ? 'border-amber-400/40 bg-amber-400/15 text-amber-200'
    : 'border-white/15 bg-white/5 text-stone-300'
  return <span className={'inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ' + color}>{PAYMENT_LABELS[status]}</span>
}
export function FulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  return <span className={'inline-flex rounded-lg border px-2.5 py-1 text-xs ' + (status === 'cancelled' ? 'border-red-400/30 text-red-300 bg-red-500/10' : 'border-white/15 text-stone-300 bg-white/5')}>
    {FULFILLMENT_LABELS[status]}
  </span>
}

export function FailureNotice({ error }: { error: AdminFailure | null }) {
  if (!error) return null
  return (
    <div role="alert" className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 space-y-2 text-sm text-amber-100">
      <p className="font-semibold">{error.message}</p>
      {error.status === 503 && <p className="text-amber-100/80 leading-relaxed">
        Cần hoàn tất cấu hình cơ sở dữ liệu đặt hàng và biến môi trường máy chủ, rồi tải lại trang. Hiện chưa thể xác nhận hoặc cập nhật đơn hàng.
      </p>}
      {error.status === 401 && <button type="button" onClick={() => window.location.reload()} className="underline font-bold">Đăng nhập lại quản trị</button>}
      {error.status === 404 && <Link href="/admin/orders" className="underline">Về danh sách đơn hàng</Link>}
    </div>
  )
}
