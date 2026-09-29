import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { getAdminActionsList } from '@/lib/store/catalog-service'
import { handleSyncActions } from '@/features/admin/action-actions'
import SyncCatalogBanner from '@/features/admin/SyncCatalogBanner'
import ActionRowActions from '@/features/admin/ActionRowActions'

export const dynamic = 'force-dynamic'

export default async function AdminActionsPage() {
  const { actions: allActions, isDatabaseSource } = await getAdminActionsList()

  const activeCount = allActions.filter((a) => a.active).length

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 font-mono">
            FAME DRINK • MICRO-ACTIONS SỨC KHỎE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Quản Lý Micro-Actions ({allActions.length})
          </h1>
          <p className="text-xs text-muted mt-1">
            Các bài tập phục hồi 5–25 phút đồng hành cùng thực đơn WAKE, FOCUS, REFRESH.
          </p>
        </div>

        <Link
          href="/admin/actions/new"
          className="btn btn-primary-focus py-2.5 px-5 font-bold rounded-xl flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <span>+ Thêm Action Mới</span>
        </Link>
      </div>

      {/* Sync Status Banner */}
      <SyncCatalogBanner
        type="actions"
        isDatabaseSource={isDatabaseSource}
        count={allActions.length}
        onSync={handleSyncActions}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Tổng micro-actions</span>
          <p className="text-xl font-bold font-mono text-white mt-0.5">{allActions.length}</p>
        </div>
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Đang hoạt động</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{activeCount}</p>
        </div>
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Tạm ngưng</span>
          <p className="text-xl font-bold font-mono text-rose-400 mt-0.5">
            {allActions.length - activeCount}
          </p>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {allActions.map((action) => {
          const stepsCount = Array.isArray(action.steps) ? action.steps.length : 0

          return (
            <div
              key={action.id || action.slug}
              className="surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all shadow-sm"
              style={{ opacity: action.active ? 1 : 0.6 }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border border-white/10"
                  style={{ background: 'var(--color-surface-2)' }}
                >
                  ⏱️
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <CategoryBadge category={action.category} showEmoji={false} />
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-white/10">
                      {action.duration_minutes} phút
                    </span>
                    {!action.active && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Tạm ẩn
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white">{action.title}</h3>

                  <p className="text-xs text-muted font-mono mt-0.5">
                    {action.slug} · {stepsCount} bước hướng dẫn
                  </p>

                  {action.description && (
                    <p className="text-xs text-white/60 line-clamp-1 mt-1 max-w-xl">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 shrink-0">
                <ActionRowActions
                  id={action.id || action.slug}
                  slug={action.slug}
                  active={action.active}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
