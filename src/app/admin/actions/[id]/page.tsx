import { notFound } from 'next/navigation'
import Link from 'next/link'
import MicroActionForm from '@/features/admin/MicroActionForm'
import { updateMicroAction } from '@/features/admin/action-actions'
import { getAdminAction } from '@/lib/store/catalog-service'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditActionPage({ params }: Props) {
  const { id } = await params
  const action = await getAdminAction(id)

  if (!action) {
    notFound()
  }

  const updateWithId = updateMicroAction.bind(null, action.id || action.slug)

  return (
    <div className="max-w-2xl space-y-6 fade-in">
      <div>
        <Link
          href="/admin/actions"
          className="text-xs text-muted hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 mb-3"
        >
          <span>← Quay lại Danh sách micro-actions</span>
        </Link>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 font-mono block">
          CHỈNH SỬA MICRO-ACTION
        </span>
        <h1 className="text-2xl font-black text-white mt-1">
          {action.title}
        </h1>
        <p className="text-xs text-muted mt-1 font-mono">
          Slug: {action.slug} · Thời lượng: {action.duration_minutes} phút · Danh mục: {action.category}
        </p>
      </div>

      <div className="surface p-6 rounded-3xl border border-white/10 shadow-lg">
        <MicroActionForm action={action} onSubmit={updateWithId} submitLabel="Lưu Thay Đổi Micro-Action" />
      </div>
    </div>
  )
}
