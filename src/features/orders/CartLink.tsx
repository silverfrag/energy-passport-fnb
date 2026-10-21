'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

export default function CartLink({ className = '' }: { className?: string }) {
  const { totalQuantity, ready } = useCart()
  const count = ready ? totalQuantity : 0
  return (
    <Link href="/checkout" aria-label={`Giỏ hàng, ${count} ly`} className={`fd-cart ${className}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 4h2l2 11h11l2-8H6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="19" r="1" /><circle cx="17" cy="19" r="1" /></svg>
      <span className="fd-cart-label">Giỏ hàng</span><span className="fd-cart-count" aria-hidden="true">{count}</span>
    </Link>
  )
}
