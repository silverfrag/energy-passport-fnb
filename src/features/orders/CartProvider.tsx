'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Product } from '@/types'
import { getProductArt } from '@/lib/constants/product-art'
import { DEFAULT_SIZE, getSizePrice, type ProductSize } from '@/lib/constants/product-sizes'
import { CART_KEY, parseCart, quantityError, subtractOrderedItems, type CartItem } from './cart-model'
import { readStoredValue, useBrowserReady, useStoredValue, writeStoredValue } from './browser-storage'

interface CartContextValue {
  items: CartItem[]
  ready: boolean
  notice: string | null
  totalQuantity: number
  subtotal: number
  addItem: (product: Product, size: ProductSize) => string | null
  setQuantity: (productId: string, quantity: number, size?: ProductSize) => string | null
  removeItem: (productId: string, size?: ProductSize) => string | null
  removeOrdered: (items: { productId: string; quantity: number; size?: ProductSize }[]) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const currentItems = () => parseCart(readStoredValue(CART_KEY)).items
function save(items: CartItem[]): string | null {
  return writeStoredValue(CART_KEY, JSON.stringify({ version: 2, items })) ? null : 'Trình duyệt chưa cho phép lưu giỏ hàng. Hãy bật bộ nhớ trang web rồi thử lại.'
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
    addItem(product, size) {
      const price = getSizePrice(product.price, size)
      if (!product.active || price === null) return 'Món này hiện chưa nhận đặt online.'
      const items = currentItems()
      const existing = items.find((item) => item.productId === product.slug && item.size === size)
      const quantity = (existing?.quantity ?? 0) + 1
      const error = quantityError(items, product.slug, quantity, size)
      if (error) return error
      const item: CartItem = { productId: product.slug, size, name: product.name, unitPrice: price, imageUrl: getProductArt(product).src, quantity }
      return save(existing ? items.map((entry) => entry.productId === product.slug && entry.size === size ? item : entry) : [...items, item])
    },
    setQuantity(productId, quantity, size = DEFAULT_SIZE) {
      const items = currentItems()
      const error = quantityError(items, productId, quantity, size)
      return error ?? save(items.map((item) => item.productId === productId && item.size === size ? { ...item, quantity } : item))
    },
    removeItem(productId, size = DEFAULT_SIZE) { return save(currentItems().filter((item) => item.productId !== productId || item.size !== size)) },
    removeOrdered(ordered) { save(subtractOrderedItems(currentItems(), ordered)) },
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('Cart components must be wrapped in CartProvider')
  return cart
}
