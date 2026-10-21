import 'server-only'
import { randomBytes, randomUUID } from 'node:crypto'
import { orderDatabase } from './db'
import { hash, orderAccessToken, safeEqual } from './crypto'
import { OrderError, unavailable } from './errors'
import { createBankQr } from './qr'
import { MAX_ORDER_TOTAL, validOrderId } from './validation'
import { planAdminUpdate } from './state'
import type { AdminOrderAction, BankAccount, CreateOrderInput, Order, OrderItem, OrderRecord, PaymentSettings } from './types'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import { DEFAULT_SIZE, getSizePrice } from '@/lib/constants/product-sizes'

const SETTINGS_ID = 'primary'
type SettingsRecord = { id: string; enabled: boolean; bank_bin: string; bank_name: string; account_number: string; account_name: string; delivery_fee: number | null; version: number }
type CatalogProduct = { id: string; slug: string; name: string; price: number | null; active: boolean }

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const { data, error } = await orderDatabase().from('online_payment_settings').select('*').eq('id', SETTINGS_ID).maybeSingle()
  if (error || !data) unavailable()
  const row = data as SettingsRecord
  return { enabled: row.enabled, bankBin: row.bank_bin, bankName: row.bank_name, accountNumber: row.account_number, accountName: row.account_name, deliveryFee: 0, version: row.version }
}

export async function savePaymentSettings(settings: PaymentSettings): Promise<PaymentSettings> {
  const { data, error } = await orderDatabase().from('online_payment_settings').update({
    enabled: settings.enabled, bank_bin: settings.bankBin, bank_name: settings.bankName,
    account_number: settings.accountNumber, account_name: settings.accountName,
    delivery_fee: settings.deliveryFee, version: settings.version + 1, updated_at: new Date().toISOString(),
  }).eq('id', SETTINGS_ID).eq('version', settings.version).select('id').maybeSingle()
  if (error) unavailable()
  if (!data) throw new OrderError(409, 'VERSION_CONFLICT', 'Cấu hình vừa thay đổi. Vui lòng tải lại trước khi lưu.')
  return { ...settings, version: settings.version + 1 }
}

export function publicOrder(row: OrderRecord): Order {
  const payment = row.total !== null && row.total > 0 && row.fulfillment_status !== 'cancelled' && row.payment_status !== 'paid'
    ? { ...row.bank_snapshot, amount: row.total, transferContent: row.code, qrPayload: createBankQr(row.bank_snapshot, row.total, row.code) }
    : null
  return { id: row.id, code: row.code, fulfillment: row.fulfillment,
    customer: { name: row.customer_name, phone: row.customer_phone, address: row.customer_address },
    note: row.note, items: row.items.map(item => ({ ...item, size: item.size ?? DEFAULT_SIZE })), subtotal: row.subtotal, deliveryFee: row.delivery_fee, total: row.total,
    paymentStatus: row.payment_status, fulfillmentStatus: row.fulfillment_status,
    version: row.version, createdAt: row.created_at, updatedAt: row.updated_at, paidAt: row.paid_at, payment }
}

export async function findOrder(id: string): Promise<OrderRecord> {
  if (!validOrderId(id)) throw new OrderError(404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng.')
  const { data, error } = await orderDatabase().from('online_orders').select('*').eq('id', id).maybeSingle()
  if (error) unavailable()
  if (!data) throw new OrderError(404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng.')
  return data as OrderRecord
}

export async function customerOrder(id: string, authorization: string | null): Promise<OrderRecord> {
  const token = authorization?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1]
  if (!token) throw new OrderError(404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng hoặc liên kết theo dõi không hợp lệ.')
  const order = await findOrder(id)
  if (!safeEqual(hash(token), order.access_token_hash)) throw new OrderError(404, 'ORDER_NOT_FOUND', 'Không tìm thấy đơn hàng hoặc liên kết theo dõi không hợp lệ.')
  return order
}

export async function createOrder(input: CreateOrderInput): Promise<{ order: Order; accessToken: string; replayed: boolean }> {
  const db = orderDatabase()
  const fingerprint = hash(JSON.stringify(input))
  const token = orderAccessToken(input.idempotencyKey)
  const replay = async () => {
    const { data, error } = await db.from('online_orders').select('*').eq('idempotency_key', input.idempotencyKey).maybeSingle()
    if (error) unavailable()
    if (!data) return null
    const existing = data as OrderRecord
    if (!safeEqual(existing.request_hash, fingerprint) || !safeEqual(existing.access_token_hash, hash(token))) throw new OrderError(409, 'IDEMPOTENCY_CONFLICT', 'Mã gửi đơn đã được dùng cho một giỏ hàng khác. Vui lòng kiểm tra đơn đã gửi.')
    return { order: publicOrder(existing), accessToken: token, replayed: true }
  }
  const existing = await replay()
  if (existing) return existing
  const settings = await getPaymentSettings()
  if (!settings.enabled) throw new OrderError(503, 'ORDERING_DISABLED', 'Cửa hàng chưa mở nhận đơn online. Bạn chưa được yêu cầu chuyển khoản.')
  // Read trusted database prices. Never use totals, names, availability, or prices supplied by a browser.
  const { data, error } = await db.from('products').select('id,slug,name,price,active').eq('active', true)
  if (error && error.code !== 'PGRST205' && error.code !== '42P01') unavailable()
  // The bundled 32-product server catalog is the demo's source until the products table is provisioned.
  // An existing empty table deliberately means no products; network failures never enable stale ordering.
  const products: CatalogProduct[] = error ? STANDARD_PRODUCTS.filter(p => p.active) : (data || []) as CatalogProduct[]
  const resolvedIds = new Set<string>()
  const items: OrderItem[] = input.items.map(item => {
    const product = products.find(p => p.id === item.productId || p.slug === item.productId)
    const size = item.size ?? DEFAULT_SIZE
    const price = product ? getSizePrice(product.price === null ? null : Number(product.price), size) : null
    if (!product || price === null) throw new OrderError(409, 'ITEM_UNAVAILABLE', 'Một món trong giỏ hiện không nhận đặt hoặc chưa có giá hợp lệ. Vui lòng chọn lại từ menu.')
    const key = `${product.id}:${size}`
    if (resolvedIds.has(key)) throw new OrderError(400, 'DUPLICATE_PRODUCT', 'Một món cùng kích cỡ xuất hiện nhiều lần trong giỏ.')
    resolvedIds.add(key)
    return { productId: product.id, slug: product.slug, name: product.name, size, unitPrice: price, quantity: item.quantity, lineTotal: price * item.quantity }
  })
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const deliveryFee = 0
  const total = subtotal
  if (subtotal > MAX_ORDER_TOTAL || (total !== null && total > MAX_ORDER_TOTAL)) throw new OrderError(400, 'TOTAL_TOO_LARGE', 'Tổng đơn vượt giới hạn cho phép.')
  const bank: BankAccount = { bankBin: settings.bankBin, bankName: settings.bankName, accountNumber: settings.accountNumber, accountName: settings.accountName }
  const now = new Date().toISOString()
  const row: OrderRecord = {
    id: randomUUID(), code: `FD${randomBytes(6).toString('hex').toUpperCase()}`,
    idempotency_key: input.idempotencyKey, request_hash: fingerprint, access_token_hash: hash(token),
    fulfillment: input.fulfillment, customer_name: input.customer.name, customer_phone: input.customer.phone,
    customer_address: input.fulfillment === 'delivery' ? input.customer.address || null : null, note: input.note || null,
    items, subtotal, delivery_fee: deliveryFee, total, bank_snapshot: bank,
    payment_status: total === null ? 'pending_quote' : 'awaiting_payment', fulfillment_status: 'unconfirmed',
    version: 1, created_at: now, updated_at: now, paid_at: null,
  }
  // Validate bank snapshot before creating an order with unrenderable transfer instructions.
  createBankQr(bank, total || subtotal, row.code)
  const { error: insertError } = await db.from('online_orders').insert(row)
  if (insertError?.code === '23505') { const duplicate = await replay(); if (duplicate) return duplicate }
  if (insertError) unavailable()
  return { order: publicOrder(row), accessToken: token, replayed: false }
}

async function compareAndUpdate(order: OrderRecord, patch: Partial<OrderRecord>): Promise<Order> {
  const { data, error } = await orderDatabase().from('online_orders').update(patch).eq('id', order.id).eq('version', order.version).select('*').maybeSingle()
  if (error) unavailable()
  if (!data) throw new OrderError(409, 'VERSION_CONFLICT', 'Đơn hàng vừa được cập nhật. Vui lòng tải lại trước khi thao tác.')
  return publicOrder(data as OrderRecord)
}

export async function markPaymentReview(order: OrderRecord): Promise<Order> {
  if (order.fulfillment_status === 'cancelled') throw new OrderError(409, 'ORDER_CLOSED', 'Đơn này đã bị hủy.')
  if (order.payment_status === 'paid' || order.payment_status === 'payment_review') return publicOrder(order)
  if (order.payment_status !== 'awaiting_payment' || order.total === null) throw new OrderError(409, 'QUOTE_REQUIRED', 'Vui lòng chờ cửa hàng xác nhận phí giao hàng trước khi chuyển khoản.')
  return compareAndUpdate(order, { payment_status: 'payment_review', version: order.version + 1, updated_at: new Date().toISOString() })
}

export async function updateAdminOrder(id: string, action: AdminOrderAction): Promise<Order> {
  const order = await findOrder(id)
  return compareAndUpdate(order, planAdminUpdate(order, action))
}

export async function listOrders(offset = 0, limit = 30): Promise<{ orders: Order[]; total: number; hasMore: boolean }> {
  const { data, error, count } = await orderDatabase().from('online_orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + limit - 1)
  if (error) unavailable()
  return { orders: (data as OrderRecord[]).map(publicOrder), total: count || 0, hasMore: offset + limit < (count || 0) }
}
