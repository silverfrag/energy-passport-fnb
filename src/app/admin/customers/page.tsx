import type { Metadata } from 'next'
import { getCustomersData } from '@/features/admin/customer-actions'
import CustomerManagementClient from '@/features/admin/CustomerManagementClient'

export const metadata: Metadata = {
  title: 'Quản Lý Khách Quen & Ưu Đãi — Fame Drink Admin',
  description: 'Giao diện quản lý tích lũy ưu đãi, tra cứu SĐT và chăm sóc khách quen dành cho Barista và Quản lý Fame Drink.',
}

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const data = await getCustomersData()

  return (
    <div className="w-full">
      <CustomerManagementClient
        initialCustomers={data.customers}
        stats={{
          totalCustomers: data.totalCustomers,
          rewardEligibleCount: data.rewardEligibleCount,
          activeWeeklyCount: data.activeWeeklyCount,
          withPhoneCount: data.withPhoneCount,
        }}
      />
    </div>
  )
}
