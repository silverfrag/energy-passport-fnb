'use client'

import Link from 'next/link'
import { useCart } from './CartProvider'

export default function CartLink({ className = '' }: { className?: string }) {
  const { totalQuantity, ready } = useCart()
  const count = ready ? totalQuantity : 0
  return (
    <Link href="/checkout" aria-label={`Giỏ hàng, ${count} ly`} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#b94720] px-4 py-2 text-sm font-bold text-white hover:bg-[#963716] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720] ${className}`}>
      Giỏ hàng <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs" aria-hidden="true">{count}</span>
    </Link>
  )
}
