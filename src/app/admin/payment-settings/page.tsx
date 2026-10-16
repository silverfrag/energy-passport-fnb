import type { Metadata } from 'next'
import { isOrderAdmin } from '@/lib/orders/auth'
import { getPaymentSettings } from '@/lib/orders/service'
import type { PaymentSettings } from '@/lib/orders/types'
import AdminUnlockCard from '@/features/admin/AdminUnlockCard'
import PaymentSettingsClient from '@/features/admin/orders/PaymentSettingsClient'
import { serverFailure } from '@/features/admin/orders/server-error'
import type { AdminFailure } from '@/features/admin/orders/shared'

export const metadata: Metadata = { title: 'Cấu hình chuyển khoản', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminPaymentSettingsPage() {
  if (!await isOrderAdmin()) return <AdminUnlockCard />
  let settings: PaymentSettings | null = null
  let error: AdminFailure | null = null
  try { settings = await getPaymentSettings() } catch (cause) { error = serverFailure(cause) }
  return <PaymentSettingsClient initialSettings={settings} initialError={error} />
}
