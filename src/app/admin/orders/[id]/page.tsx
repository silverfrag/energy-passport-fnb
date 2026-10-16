import type { Metadata } from 'next'
import { isOrderAdmin } from '@/lib/orders/auth'
import { findOrder, publicOrder } from '@/lib/orders/service'
import type { Order } from '@/lib/orders/types'
import AdminUnlockCard from '@/features/admin/AdminUnlockCard'
import OrderDetailClient from '@/features/admin/orders/OrderDetailClient'
import { serverFailure } from '@/features/admin/orders/server-error'
import type { AdminFailure } from '@/features/admin/orders/shared'

export const metadata: Metadata = { title: 'Chi tiết đơn hàng', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!await isOrderAdmin()) return <AdminUnlockCard />
  const { id } = await params
  let order: Order | null = null
  let error: AdminFailure | null = null
  try { order = publicOrder(await findOrder(id)) } catch (cause) { error = serverFailure(cause) }
  return <OrderDetailClient key={id} orderId={id} initialOrder={order} initialError={error} />
}
