'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { useCart } from './CartProvider'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, ready } = useCart()
  const [message, setMessage] = useState('')
  const unavailable = !product.active || product.price === null || product.price <= 0

  function add() {
    const error = addItem(product)
    setMessage(error || `Đã thêm ${product.name} vào giỏ.`)
  }

  return (
    <div>
      <button type="button" onClick={add} disabled={!ready || unavailable} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#b94720] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#963716] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm">
        {unavailable ? 'Chưa nhận đặt' : 'Thêm vào giỏ'} {!unavailable && <span aria-hidden="true">+</span>}
      </button>
      <p role="status" className={message ? 'mt-2 text-xs leading-relaxed text-[#71533e]' : 'sr-only'}>{message}</p>
    </div>
  )
}
