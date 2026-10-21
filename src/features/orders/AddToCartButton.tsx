'use client'

import { useId, useState } from 'react'
import type { Product } from '@/types'
import { PRODUCT_SIZES, getSizePrice, type ProductSize } from '@/lib/constants/product-sizes'
import { formatMoney } from './cart-model'
import { useCart } from './CartProvider'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, ready } = useCart()
  const [size, setSize] = useState<ProductSize | null>(null)
  const [message, setMessage] = useState('')
  const group = useId()
  const price = size ? getSizePrice(product.price, size) : null
  const basePrice = getSizePrice(product.price, 'M')
  const startingPrice = getSizePrice(product.price, 'S')
  const unavailable = !product.active || basePrice === null

  function add() {
    if (!size) return
    const error = addItem(product, size)
    setMessage(error || `Đã thêm ${product.name}, size ${size} vào giỏ.`)
  }

  return <div className="fd-size-purchase" data-size-selected={size !== null}>
    <div className="fd-size-price"><span>{size ? `SIZE ${size}` : 'CHỌN SIZE'}</span><strong aria-live="polite" aria-atomic="true">{size ? (price === null ? 'Liên hệ giá' : formatMoney(price)) : basePrice === null ? 'Liên hệ giá' : `Từ ${formatMoney(startingPrice ?? 0)}`}</strong></div>
    <fieldset className="fd-size-options" disabled={unavailable}>
      <legend>Chọn size</legend>
      <div>{PRODUCT_SIZES.map((option) => <label key={option}>
        <input type="radio" name={group} value={option} checked={size === option} onChange={() => { setSize(option); setMessage('') }} aria-label={`Size ${option}`} />
        <span>{option}</span>
      </label>)}</div>
    </fieldset>
    <button type="button" onClick={add} disabled={!ready || unavailable || !size} className="fd-add-button">{unavailable ? 'Chưa nhận đặt' : !size ? 'Chọn size trước' : 'Thêm vào giỏ'} {!unavailable && size && <span aria-hidden="true">+</span>}</button>
    <p role="status" className={message ? 'fd-add-feedback' : 'sr-only'}>{message}</p>
  </div>
}
