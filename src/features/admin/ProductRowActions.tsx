'use client'

import { useState, useTransition } from 'react'
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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      setError(null)
      try {
        const result = await toggleProductActive(id, active)
        if (result.error) setError(result.error)
        else router.refresh()
      } catch { setError('Không thể cập nhật. Vui lòng kiểm tra phiên đăng nhập và thử lại.') }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {error && <p role="alert" className="w-full text-xs text-red-400">{error}</p>}
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
