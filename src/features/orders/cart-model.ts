import { DEFAULT_SIZE, isProductSize, type ProductSize } from '@/lib/constants/product-sizes'

export const CART_KEY = 'fame-cart-v1'
export const PENDING_ORDER_KEY = 'fame-pending-order-v1'
export const LAST_ORDER_KEY = 'fame-last-order-v1'
export const MAX_ITEM_QUANTITY = 20
export const MAX_TOTAL_QUANTITY = 50
export const MAX_DIFFERENT_ITEMS = 20

export interface CartItem {
  productId: string
  size: ProductSize
  name: string
  unitPrice: number
  imageUrl: string
  quantity: number
}

export function parseCart(raw: string | null): { items: CartItem[]; notice: string | null } {
  if (!raw) return { items: [], notice: null }
  try {
    const data = JSON.parse(raw)
    if ((data.version !== 1 && data.version !== 2) || !Array.isArray(data.items) || data.items.length > MAX_DIFFERENT_ITEMS) throw new Error()
    const seen = new Set<string>()
    let count = 0
    const items: CartItem[] = []
    for (const item of data.items) {
      const size = item?.size === undefined ? DEFAULT_SIZE : item.size
      const key = `${item?.productId}:${size}`
      if (!item || typeof item.productId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(item.productId) || !isProductSize(size) || seen.has(key)
        || typeof item.name !== 'string' || !item.name || item.name.length > 200
        || !Number.isSafeInteger(item.unitPrice) || item.unitPrice <= 0 || item.unitPrice > 10_000_000
        || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ITEM_QUANTITY
        || typeof item.imageUrl !== 'string' || !/^(\/|https?:\/\/)/.test(item.imageUrl)) throw new Error()
      seen.add(key)
      count += item.quantity
      items.push({ ...item, size })
    }
    if (count > MAX_TOTAL_QUANTITY) throw new Error()
    return { items, notice: null }
  } catch {
    return { items: [], notice: 'Giỏ hàng đã lưu không còn tương thích. Hãy chọn lại món từ menu.' }
  }
}

export function quantityError(items: CartItem[], productId: string, quantity: number, size: ProductSize = DEFAULT_SIZE): string | null {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) return 'Mỗi món tối đa 20 ly.'
  const existing = items.find((item) => item.productId === productId && item.size === size)
  if (!existing && items.length >= MAX_DIFFERENT_ITEMS) return 'Mỗi đơn tối đa 20 món khác nhau.'
  if (items.reduce((sum, item) => sum + item.quantity, 0) - (existing?.quantity ?? 0) + quantity > MAX_TOTAL_QUANTITY) return 'Mỗi đơn tối đa 50 ly. Nhắn Fame nếu bạn cần đặt nhiều hơn.'
  return null
}

export function subtractOrderedItems(items: CartItem[], ordered: { productId: string; quantity: number; size?: ProductSize }[]): CartItem[] {
  return items.flatMap((item) => {
    const quantity = item.quantity - (ordered.find((sent) => sent.productId === item.productId && (sent.size ?? DEFAULT_SIZE) === item.size)?.quantity ?? 0)
    return quantity > 0 ? [{ ...item, quantity }] : []
  })
}

export const formatMoney = (amount: number) => `${new Intl.NumberFormat('vi-VN').format(amount)}₫`
