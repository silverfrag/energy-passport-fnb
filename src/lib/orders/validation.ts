import type { CreateOrderInput, PaymentSettings } from './types'
import { OrderError } from './errors'
import { DEFAULT_SIZE, isProductSize } from '@/lib/constants/product-sizes'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const MAX_ORDER_TOTAL = 10_000_000

function invalid(message: string): never { throw new OrderError(400, 'INVALID_INPUT', message) }
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function text(value: unknown, max: number, required = true): string {
  if (typeof value !== 'string') { if (!required && value == null) return ''; return invalid('Thông tin nhập chưa hợp lệ.') }
  const result = value.trim()
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result)) invalid('Thông tin nhập thiếu hoặc vượt quá độ dài cho phép.')
  return result
}
export function validOrderId(value: string): boolean { return UUID.test(value) }
export function parseCreateOrder(value: unknown): CreateOrderInput {
  if (!isRecord(value) || !isRecord(value.customer)) invalid('Thông tin đơn hàng chưa hợp lệ.')
  const key = text(value.idempotencyKey, 36)
  if (!UUID.test(key)) invalid('Mã gửi đơn chưa hợp lệ. Vui lòng tải lại trang.')
  if (value.fulfillment !== 'delivery') invalid('Fame Drink chỉ nhận đơn giao hàng trong bản demo này.')
  const phone = text(value.customer.phone, 24).replace(/[\s().-]/g, '').replace(/^\+84/, '0')
  if (!/^0[35789]\d{8}$/.test(phone)) invalid('Vui lòng nhập số di động Việt Nam hợp lệ.')
  const name = text(value.customer.name, 100)
  const address = text(value.customer.address, 400)
  if (address.length < 8) invalid('Vui lòng nhập địa chỉ giao hàng đầy đủ.')
  const note = text(value.note, 500, false)
  if (!Array.isArray(value.items) || !value.items.length || value.items.length > 20) invalid('Mỗi đơn cần từ 1 đến 20 món khác nhau.')
  let count = 0
  const seen = new Set<string>()
  const items = value.items.map((item: unknown) => {
    if (!isRecord(item)) invalid('Món trong giỏ hàng chưa hợp lệ.')
    const productId = text(item.productId, 100)
    const size = item.size === undefined ? DEFAULT_SIZE : item.size
    if (!isProductSize(size)) invalid('Kích cỡ món chưa hợp lệ.')
    const key = `${productId}:${size}`
    if (!/^[a-zA-Z0-9_-]+$/.test(productId) || seen.has(key)) invalid('Danh sách món bị trùng hoặc không hợp lệ.')
    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) invalid('Số lượng mỗi món phải từ 1 đến 20 ly.')
    seen.add(key)
    count += item.quantity
    return { productId, quantity: item.quantity, ...(item.size === undefined ? {} : { size }) }
  })
  if (count > 50) invalid('Mỗi đơn tối đa 50 ly. Vui lòng liên hệ cửa hàng cho đơn lớn hơn.')
  return { idempotencyKey: key.toLowerCase(), fulfillment: value.fulfillment, customer: { name, phone, ...(address && value.fulfillment === 'delivery' ? { address } : {}) }, ...(note ? { note } : {}), items }
}

export function validateFee(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 1_000_000) invalid('Phí giao hàng phải là số nguyên từ 0 đến 1.000.000 đồng.')
  return value
}
export function validateVersion(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) invalid('Phiên bản dữ liệu chưa hợp lệ. Vui lòng tải lại.')
  return value
}
export function parsePaymentSettings(value: unknown): PaymentSettings {
  if (!isRecord(value) || typeof value.enabled !== 'boolean') invalid('Cấu hình thanh toán chưa hợp lệ.')
  const bankBin = text(value.bankBin, 6, value.enabled)
  const bankName = text(value.bankName, 80, value.enabled)
  const accountNumber = text(value.accountNumber, 19, value.enabled).replace(/\s/g, '')
  const accountName = text(value.accountName, 100, value.enabled)
  if ((bankBin && !/^\d{6}$/.test(bankBin)) || (accountNumber && !/^\d{6,19}$/.test(accountNumber))) invalid('Mã BIN ngân hàng gồm 6 số; số tài khoản gồm 6–19 số.')
  // Demo business policy is delivery only, with a zero delivery fee regardless of browser input.
  return { enabled: value.enabled, bankBin, bankName, accountNumber, accountName, deliveryFee: 0, version: validateVersion(value.version) }
}
