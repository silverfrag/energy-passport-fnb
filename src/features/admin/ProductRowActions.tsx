'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toggleProductActive } from '@/features/admin/product-actions'

interface Props {
  id: string
  slug: string
  active: boolean
}

export default function ProductRowActions({ id, slug, active }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductActive(id, active)
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
        title={active ? 'Nhấn để ẩn món khỏi thực đơn' : 'Nhấn để mở bán lại'}
      >
        {isPending ? '…' : active ? 'Đang bán' : 'Tạm ẩn'}
      </button>

      <Link
        href={`/admin/products/${slug}`}
        className="btn btn-ghost text-xs"
        style={{ padding: '6px 12px', minHeight: 32 }}
      >
        Sửa
      </Link>

      <Link
        href={`/menu/${slug}`}
        className="text-xs text-white/50 hover:text-amber-400 transition-colors hidden sm:inline"
        target="_blank"
      >
        Xem →
      </Link>
    </div>
  )
}
