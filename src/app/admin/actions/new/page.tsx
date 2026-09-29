import MicroActionForm from '@/features/admin/MicroActionForm'
import { createMicroAction } from '@/features/admin/action-actions'
import Link from 'next/link'

export default function NewActionPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/actions" className="text-sm mb-6 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
        ← Danh sách micro-actions
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: 'var(--color-text)' }}>
        Thêm micro-action mới
      </h1>
      <MicroActionForm onSubmit={createMicroAction} submitLabel="Tạo micro-action" />
    </div>
  )
}
