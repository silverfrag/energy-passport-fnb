import type { CreateOrderInput } from '@/lib/orders/types'
import { parseCart, type CartItem } from './cart-model'

export interface PendingOrder {
  version: 1
  input: CreateOrderInput
  items: CartItem[]
}

export function parsePendingOrder(raw: string | null): { pending: PendingOrder | null; invalid: boolean } {
  if (!raw) return { pending: null, invalid: false }
  try {
    const data = JSON.parse(raw)
    const input = data?.input
    const cart = parseCart(JSON.stringify({ version: 1, items: data.items }))
    if (data.version !== 1 || cart.notice || !cart.items.length || input?.fulfillment !== 'delivery'
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.idempotencyKey)
      || typeof input.customer?.name !== 'string' || typeof input.customer?.phone !== 'string' || typeof input.customer?.address !== 'string'
      || !Array.isArray(input.items) || input.items.length !== cart.items.length
      || input.items.some((item: { productId?: unknown; quantity?: unknown }, index: number) => item.productId !== cart.items[index].productId || item.quantity !== cart.items[index].quantity)
      || (input.note !== undefined && typeof input.note !== 'string')) throw new Error()
    return { pending: data as PendingOrder, invalid: false }
  } catch { return { pending: null, invalid: true } }
}
