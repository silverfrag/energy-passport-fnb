'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toggleMicroActionActive } from '@/features/admin/action-actions'

interface Props {
  id: string
  slug: string
  active: boolean
}

export default function ActionRowActions({ id, slug, active }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleMicroActionActive(id, active)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="btn btn-ghost text-xs"
        style={{
          padding: '6px 10px',
          minHeight: 32,
          fontSize: '11px',
          color: active ? '#10b981' : '#f87171',
          border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        }}
        title={active ? 'Nhấn để ẩn action' : 'Nhấn để kích hoạt action'}
      >
        {isPending ? '…' : active ? 'Hoạt động' : 'Tạm ẩn'}
      </button>

      <Link
        href={`/admin/actions/${slug}`}
        className="btn btn-ghost text-xs"
        style={{ padding: '6px 12px', minHeight: 32 }}
      >
        Sửa
      </Link>
    </div>
  )
}
