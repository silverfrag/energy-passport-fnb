import type { Metadata } from 'next'
import OrderStatusClient from '@/features/orders/OrderStatusClient'

export const metadata: Metadata = {
  title: 'Theo dõi đơn',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
}

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OrderStatusClient orderId={id} />
}
