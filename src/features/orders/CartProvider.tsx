'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Product } from '@/types'
import { CART_KEY, parseCart, quantityError, subtractOrderedItems, type CartItem } from './cart-model'
import { readStoredValue, useBrowserReady, useStoredValue, writeStoredValue } from './browser-storage'

interface CartContextValue {
  items: CartItem[]
  ready: boolean
  notice: string | null
  totalQuantity: number
  subtotal: number
  addItem: (product: Product) => string | null
  setQuantity: (productId: string, quantity: number) => string | null
  removeItem: (productId: string) => string | null
  removeOrdered: (items: { productId: string; quantity: number }[]) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const currentItems = () => parseCart(readStoredValue(CART_KEY)).items
function save(items: CartItem[]): string | null {
  return writeStoredValue(CART_KEY, JSON.stringify({ version: 1, items })) ? null : 'Trình duyệt chưa cho phép lưu giỏ hàng. Hãy bật bộ nhớ trang web rồi thử lại.'
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const raw = useStoredValue(CART_KEY)
  const ready = useBrowserReady()
  const cart = useMemo(() => parseCart(raw), [raw])
  const value: CartContextValue = {
    ...cart,
    ready,
    totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cart.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    addItem(product) {
      if (!product.active || product.price === null || !Number.isSafeInteger(product.price) || product.price <= 0) return 'Món này hiện chưa nhận đặt online.'
      const items = currentItems()
      const existing = items.find((item) => item.productId === product.slug)
      const quantity = (existing?.quantity ?? 0) + 1
      const error = quantityError(items, product.slug, quantity)
      if (error) return error
      const item: CartItem = { productId: product.slug, name: product.name, unitPrice: product.price, imageUrl: product.image_url || `/images/drinks/${product.slug}.jpg`, quantity }
      return save(existing ? items.map((entry) => entry.productId === product.slug ? item : entry) : [...items, item])
    },
    setQuantity(productId, quantity) {
      const items = currentItems()
      const error = quantityError(items, productId, quantity)
      return error ?? save(items.map((item) => item.productId === productId ? { ...item, quantity } : item))
    },
    removeItem(productId) { return save(currentItems().filter((item) => item.productId !== productId)) },
    removeOrdered(ordered) { save(subtractOrderedItems(currentItems(), ordered)) },
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('Cart components must be wrapped in CartProvider')
  return cart
}
