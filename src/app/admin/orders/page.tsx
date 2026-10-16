import type { Metadata } from 'next'
import { isOrderAdmin } from '@/lib/orders/auth'
import { listOrders } from '@/lib/orders/service'
import AdminUnlockCard from '@/features/admin/AdminUnlockCard'
import OrdersClient from '@/features/admin/orders/OrdersClient'
import { serverFailure } from '@/features/admin/orders/server-error'
import type { AdminFailure, OrdersPageData } from '@/features/admin/orders/shared'

export const metadata: Metadata = { title: 'Quản lý đơn hàng', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  if (!await isOrderAdmin()) return <AdminUnlockCard />
  let data: OrdersPageData | null = null
  let error: AdminFailure | null = null
  try { data = await listOrders(0, 30) } catch (cause) { error = serverFailure(cause) }
  return <OrdersClient initialData={data} initialError={error} />
}
