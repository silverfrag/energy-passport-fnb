'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { confirmConsumption, confirmConsumptionDespiteDuplicate } from './actions'
import { getProductImage, getPublicProductCopy } from '@/lib/constants/drink-assets'
import { IconCheck, IconScan } from '@/components/icons'

interface Props {
  product: Product
  isAuthenticated?: boolean
  userEmail?: string | null
}

type UIState = 'idle' | 'loading' | 'duplicate' | 'success' | 'error'

export default function ScanConfirmClient({ product, isAuthenticated = false }: Props) {
  const [uiState, setUiState] = useState<UIState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm(allowDuplicate = false) {
    setUiState('loading')
    setError(null)
    try {
      const result = allowDuplicate
        ? await confirmConsumptionDespiteDuplicate(product.id, product.slug)
        : await confirmConsumption(product.id, product.slug)
      if ('duplicate' in result && result.duplicate) {
        setUiState('duplicate')
      } else if (result.success) {
        setUiState('success')
      } else {
        setUiState('error')
        setError(result.error || 'Chưa lưu được ly này. Bạn thử lại nhé.')
      }
    } catch {
      setUiState('error')
      setError('Chưa kết nối được. Bạn thử lại nhé.')
    }
  }

  if (uiState === 'success') {
    return (
      <div className="mx-auto max-w-md px-4 py-12 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-green-100 text-green-800">
          <IconCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black">Đã lưu ly của bạn</h1>
        <p className="text-sm text-muted"><strong>{product.name}</strong> đã được thêm vào nhật ký Passport.</p>
        <p className="text-xs text-muted leading-relaxed">
          Đây là ghi nhận do bạn xác nhận, không phải xác thực mua hàng hoặc điểm đổi quà.
          {!isAuthenticated && ' Nhật ký khách được lưu trên trình duyệt này.'}
        </p>
        <Link href="/passport" className="btn btn-gold btn-full">Xem Passport</Link>
        <Link href="/menu" className="btn btn-ghost btn-full">Về menu</Link>
      </div>
    )
  }

  if (uiState === 'duplicate') {
    return (
      <div className="mx-auto max-w-md px-4 py-12 space-y-5">
        <p className="text-xs text-[#ad431e] font-bold uppercase tracking-widest">Kiểm tra trước khi lưu</p>
        <h1 className="text-2xl font-black">Bạn vừa ghi nhận món này</h1>
        <p className="text-sm text-muted leading-relaxed">
          <strong>{product.name}</strong> đã có trong nhật ký 5 phút gần đây. Chỉ lưu thêm nếu bạn đang uống một ly khác.
        </p>
        <button type="button" onClick={() => handleConfirm(true)} className="btn btn-gold btn-full">Tôi đang uống thêm một ly — lưu tiếp</button>
        <Link href="/passport" className="btn btn-ghost btn-full">Giữ nguyên nhật ký</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 space-y-6">
      <Link href="/menu" className="text-sm text-muted hover:underline">← Về menu</Link>
      <div className="space-y-3">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ad431e]">
          <IconScan className="w-4 h-4" /> Passport · Tùy chọn
        </p>
        <h1 className="text-3xl font-black">Lưu ly đang uống</h1>
        <p className="text-sm text-muted leading-relaxed">QR trên ly giúp mở đúng món. Chỉ khi bạn bấm xác nhận, món này mới được lưu vào nhật ký của bạn.</p>
      </div>
      <article className="surface overflow-hidden rounded-3xl border border-[var(--color-border)]">
        <div className="aspect-square bg-[#f5eadb]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image_url || getProductImage(product.slug, product.category)} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="p-5 space-y-4">
          <h2 className="text-2xl font-black">{product.name}</h2>
          <p className="text-sm text-muted leading-relaxed">{getPublicProductCopy(product).summary}</p>
          <p className="text-xs text-muted">
            {product.caffeine_mg !== null ? 'Caffeine tham khảo: khoảng ' + product.caffeine_mg + ' mg/ly, thay đổi theo cách pha.' : 'Chưa có ước tính caffeine cho món này.'}
          </p>
          {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-800">{error}</p>}
          <button type="button" onClick={() => handleConfirm()} disabled={uiState === 'loading'}
            id="confirm-consumption-btn" className="btn btn-gold btn-full">
            {uiState === 'loading' ? 'Đang lưu…' : 'Tôi đang uống ly này — lưu Passport'}
          </button>
          <Link href={'/menu/' + product.slug} className="btn btn-ghost btn-full">Xem thông tin món</Link>
        </div>
      </article>
      <p className="text-xs text-muted leading-relaxed">Passport là nhật ký tự ghi nhận. Dấu lưu không xác thực giao dịch mua hàng và không có giá trị quy đổi.</p>
    </div>
  )
}
