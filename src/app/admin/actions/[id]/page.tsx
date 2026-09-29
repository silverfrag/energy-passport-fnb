import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MicroActionForm from '@/features/admin/MicroActionForm'
import { updateMicroAction } from '@/features/admin/action-actions'
import Link from 'next/link'
import type { MicroAction } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditActionPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: actionRaw } = await supabase
    .from('micro_actions')
    .select('*')
    .eq('id', id)
    .single()

  const action = actionRaw as MicroAction | null
  if (!action) notFound()

  const updateWithId = updateMicroAction.bind(null, id)

  return (
    <div className="max-w-2xl">
      <Link href="/admin/actions" className="text-sm mb-6 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
        ← Danh sách micro-actions
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: 'var(--color-text)' }}>
        Chỉnh sửa: {action.title}
      </h1>
      <MicroActionForm action={action} onSubmit={updateWithId} submitLabel="Cập nhật" />
    </div>
  )
}
