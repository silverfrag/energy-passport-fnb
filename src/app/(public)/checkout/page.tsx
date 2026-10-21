import type { Metadata } from 'next'
import CheckoutClient from '@/features/orders/CheckoutClient'

export const metadata: Metadata = {
  title: 'Giỏ hàng & giao hàng',
  description: 'Kiểm tra món, nhập địa chỉ giao hàng và gửi đơn đến Fame Drink.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
