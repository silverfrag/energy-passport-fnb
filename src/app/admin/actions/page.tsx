import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { MicroAction } from '@/types'
import CategoryBadge from '@/components/CategoryBadge'

export default async function AdminActionsPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('micro_actions')
    .select('*')
    .order('category')
    .order('duration_minutes')

  const allActions = (actions ?? []) as MicroAction[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
          Micro-actions ({allActions.length})
        </h1>
        <Link href="/admin/actions/new" className="btn btn-primary-focus" style={{ padding: '10px 18px' }}>
          + Thêm mới
        </Link>
      </div>

      {allActions.length === 0 ? (
        <div className="surface p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
          Chưa có micro-action.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allActions.map((action) => (
            <div
              key={action.id}
              className="surface flex items-center gap-4 p-4"
              style={{ opacity: action.active ? 1 : 0.5 }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'var(--color-surface-2)' }}
              >
                ⏱️
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryBadge category={action.category} showEmoji={false} />
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                    {action.duration_minutes} phút
                  </span>
                  {!action.active && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(255,70,70,0.15)', color: '#FF6B6B' }}>
                      Ẩn
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {action.title}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                  {action.slug} · {(action.steps as {order: number; text: string}[]).length} bước
                </p>
              </div>

              <Link
                href={`/admin/actions/${action.id}`}
                className="btn btn-ghost text-xs"
                style={{ padding: '8px 14px', minHeight: 36 }}
              >
                Sửa
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
