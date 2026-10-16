import type { AdminOrderAction, OrderRecord, FulfillmentStatus } from './types'
import { OrderError } from './errors'
import { isRecord, MAX_ORDER_TOTAL, validateFee, validateVersion } from './validation'

export function parseAdminAction(value: unknown): AdminOrderAction {
  if (!isRecord(value)) throw new OrderError(400, 'INVALID_INPUT', 'Thao tác chưa hợp lệ.')
  const version = validateVersion(value.version)
  if (value.action === 'quote_delivery') return { version, action: value.action, deliveryFee: validateFee(value.deliveryFee) }
  if (value.action === 'confirm_payment' || value.action === 'cancel') return { version, action: value.action }
  if (value.action === 'set_fulfillment' && ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed'].includes(String(value.status))) return { version, action: value.action, status: value.status as FulfillmentStatus }
  throw new OrderError(400, 'INVALID_INPUT', 'Thao tác chưa hợp lệ.')
}

export function planAdminUpdate(order: OrderRecord, action: AdminOrderAction, now = new Date().toISOString()): Partial<OrderRecord> {
  if (action.version !== order.version) throw new OrderError(409, 'VERSION_CONFLICT', 'Đơn hàng vừa được cập nhật. Vui lòng tải lại trước khi thao tác.')
  if (order.fulfillment_status === 'cancelled' || order.fulfillment_status === 'completed') throw new OrderError(409, 'ORDER_CLOSED', 'Đơn hàng đã kết thúc, không thể thay đổi trạng thái.')
  const patch: Partial<OrderRecord> = { version: order.version + 1, updated_at: now }
  if (action.action === 'quote_delivery') {
    if (order.fulfillment !== 'delivery' || order.payment_status !== 'pending_quote') throw new OrderError(409, 'QUOTE_NOT_ALLOWED', 'Chỉ báo phí cho đơn giao hàng đang chờ báo phí. Không đổi số tiền sau khi đã phát hành hướng dẫn chuyển khoản.')
    const fee = validateFee(action.deliveryFee)
    if (order.subtotal + fee > MAX_ORDER_TOTAL) throw new OrderError(400, 'TOTAL_TOO_LARGE', 'Tổng đơn vượt giới hạn cho phép.')
    return { ...patch, delivery_fee: fee, total: order.subtotal + fee, payment_status: 'awaiting_payment' }
  }
  if (action.action === 'confirm_payment') {
    if (order.payment_status === 'paid' || order.payment_status === 'pending_quote' || order.total === null || order.total <= 0) throw new OrderError(409, 'PAYMENT_NOT_CONFIRMABLE', 'Đơn này chưa thể xác nhận thanh toán hoặc đã được xác nhận.')
    return { ...patch, payment_status: 'paid', paid_at: now, fulfillment_status: 'confirmed' }
  }
  if (action.action === 'cancel') {
    if (order.payment_status === 'paid') throw new OrderError(409, 'REFUND_REQUIRES_REVIEW', 'Đơn đã nhận tiền. Cần đối soát và xử lý hoàn tiền trực tiếp trước; hệ thống này không tự hoàn tiền.')
    return { ...patch, fulfillment_status: 'cancelled' }
  }
  if (order.payment_status !== 'paid') throw new OrderError(409, 'PAYMENT_REQUIRED', 'Cần xác nhận đã nhận tiền trước khi chuẩn bị đơn.')
  const next: Partial<Record<FulfillmentStatus, FulfillmentStatus>> = {
    confirmed: 'preparing',
    preparing: order.fulfillment === 'pickup' ? 'ready' : 'out_for_delivery',
    ready: 'completed',
    out_for_delivery: 'completed',
  }
  if (next[order.fulfillment_status] !== action.status) throw new OrderError(409, 'INVALID_TRANSITION', 'Không thể chuyển sang trạng thái này từ trạng thái hiện tại.')
  return { ...patch, fulfillment_status: action.status }
}
