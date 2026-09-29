import { Suspense } from 'react'
import type { Metadata } from 'next'
import CheckInForm from '@/features/checkin/CheckInForm'

export const metadata: Metadata = {
  title: 'Check-in trạng thái',
  description: 'Chọn trạng thái năng lượng để nhận gợi ý đồ uống phù hợp.',
}

export default function CheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm px-4 py-10">
          <div className="skeleton h-8 w-48 mb-4" />
          <div className="skeleton h-4 w-64 mb-8" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-16 mb-3 rounded-xl" />
          ))}
        </div>
      }
    >
      <CheckInForm />
    </Suspense>
  )
}
