'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { confirmConsumption, confirmConsumptionDespiteDuplicate } from './actions'
import CategoryBadge from '@/components/CategoryBadge'
import Link from 'next/link'
import { getProductImage } from '@/lib/constants/drink-assets'
import { 
  IconCheck, 
  IconPassportCrest, 
  IconPassport, 
  IconScan, 
  IconArrowRight, 
  IconStampSeal,
  IconShield
} from '@/components/icons'

interface Props {
  product: Product
}

type UIState = 'idle' | 'loading' | 'duplicate' | 'success' | 'error'

const CATEGORY_COLORS = {
  WAKE: { primary: 'var(--color-wake)', light: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.3)' },
  FOCUS: { primary: 'var(--color-focus)', light: 'rgba(45,122,79,0.1)', border: 'rgba(45,122,79,0.3)' },
  REFRESH: { primary: 'var(--color-refresh)', light: 'rgba(74,144,217,0.1)', border: 'rgba(74,144,217,0.3)' },
}

export default function ScanConfirmClient({ product }: Props) {
  const [uiState, setUiState] = useState<UIState>('idle')
  const [error, setError] = useState<string | null>(null)

  const colors = CATEGORY_COLORS[product.category]
  const imageUrl = product.image_url || getProductImage(product.slug, product.category)

  const handleConfirm = async () => {
    setUiState('loading')
    setError(null)

    const result = await confirmConsumption(product.id, product.slug)

    if (result.duplicate) {
      setUiState('duplicate')
      return
    }

    if (result.success) {
      setUiState('success')
      return
    }

    setUiState('error')
    setError(result.error ?? 'Có lỗi xảy ra.')
  }

  const handleConfirmDuplicate = async () => {
    setUiState('loading')
    const result = await confirmConsumptionDespiteDuplicate(product.id, product.slug)
    if (result.success) {
      setUiState('success')
    } else {
      setUiState('error')
      setError(result.error ?? 'Có lỗi xảy ra.')
    }
  }

  // ===== SUCCESS STATE =====
  if (uiState === 'success') {
    return (
      <div className="w-full fade-in text-center mx-auto max-w-md px-4 py-12 space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
          <IconCheck className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-400 font-mono block mb-1">
            ĐÃ XÁC NHẬN PHỤC VỤ THÀNH CÔNG
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Thưởng Thức Trọn Vẹn!
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-xs mx-auto leading-relaxed">
            <strong className="text-white">{product.name}</strong> đã được đóng dấu vào sổ Energy Passport của bạn.
          </p>
        </div>

        {product.caffeine_mg !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-mono text-amber-300">
            <IconShield className="w-3.5 h-3.5 text-amber-400" />
            <span>+{product.caffeine_mg}mg caffeine ước tính đã nạp</span>
          </div>
        )}

        {/* Claim Account Card */}
        <div className="surface p-5 text-left rounded-2xl border border-amber-400/20 bg-amber-500/5 space-y-2.5">
          <div className="flex items-center gap-2">
            <IconPassportCrest className="w-5 h-5 text-amber-400" color="#D4AF37" />
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
              Bảo Lưu Sổ Ký Danh Passport
            </p>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Lịch sử hiện tại đang lưu tạm trên trình duyệt này. Bạn có thể liên kết email bất cứ lúc nào để đồng bộ trên mọi thiết bị.
          </p>
          <div className="pt-1">
            <Link
              href="/auth"
              className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2 px-4 inline-flex items-center gap-1.5"
            >
              <span>Liên Kết Email Ngay</span>
              <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link href="/passport" className="btn btn-gold btn-full text-xs font-bold uppercase tracking-wider py-3 shadow-xl flex items-center justify-center gap-2">
            <IconPassport className="w-4 h-4" />
            <span>Mở Sổ Ký Danh Passport</span>
          </Link>
          <Link href="/" className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-muted hover:text-white border border-white/10">
            Về Trang Chủ
          </Link>
        </div>
      </div>
    )
  }

  // ===== DUPLICATE WARNING STATE =====
  if (uiState === 'duplicate') {
    return (
      <div className="w-full fade-in text-center mx-auto max-w-md px-4 py-12 space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
          <IconShield className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400 font-mono block mb-1">
            CẢNH BÁO TRÙNG LẶP GẦN ĐÂY
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Bạn Vừa Ghi Nhận Ly Này
          </h2>
          <p className="text-xs text-stone-300 mt-2 max-w-xs mx-auto leading-relaxed">
            Cùng một sản phẩm <strong>{product.name}</strong> đã được đóng dấu trong vòng 5 phút vừa qua. Bạn đang gọi thêm ly thứ hai?
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={handleConfirmDuplicate}
            className="btn btn-gold btn-full text-xs font-bold uppercase tracking-wider py-3 shadow-lg"
          >
            Đúng Vậy, Xác Nhận Thêm 1 Ly Nữa
          </button>
          <Link href="/passport" className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-muted hover:text-white border border-white/10">
            Không, Mở Passport Xem Lịch Sử
          </Link>
        </div>
      </div>
    )
  }

  // ===== IDLE / SCAN VIEW =====
  return (
    <div className="w-full mx-auto max-w-md px-4 py-10 fade-in space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-muted font-mono mb-3">
          <IconScan className="w-3.5 h-3.5 text-amber-400" />
          <span>QUÉT MÃ QR TRÊN THÂN LY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Xác Nhận Thức Uống
        </h1>
        <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
          Xác nhận bạn đang thưởng thức ly này để đóng dấu Visa Thưởng Thức vào Energy Passport.
        </p>
      </div>

      {/* Product Card */}
      <article className="surface card-hover rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Real Product Image */}
        <div className="relative h-64 overflow-hidden bg-stone-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute top-3 left-3">
            <CategoryBadge category={product.category} showEmoji={false} />
          </div>

          {product.price && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-amber-300 font-mono font-bold text-sm">
              {new Intl.NumberFormat('vi-VN').format(product.price)}₫
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-xl font-black text-white">
              {product.name}
            </h2>
            {product.short_description && (
              <p className="text-xs text-muted leading-relaxed mt-1">
                {product.short_description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="tag-pill text-[11px] font-mono">
              {product.caffeine_mg !== null ? `~${product.caffeine_mg}mg caffeine ước tính` : 'Thảo mộc thanh khiết'}
            </span>
            <span className="tag-pill text-[11px]">
              {product.category === 'WAKE' ? 'Arabica Cầu Đất' : product.category === 'FOCUS' ? 'Matcha Uji Kyoto' : 'Oolong Mộc Châu'}
            </span>
          </div>

          {/* Error Alert */}
          {uiState === 'error' && error && (
            <div className="rounded-xl p-3.5 text-xs leading-relaxed bg-red-950/40 border border-red-500/30 text-red-200">
              {error}
            </div>
          )}

          {/* Primary Action Button */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleConfirm}
              disabled={uiState === 'loading'}
              id="confirm-consumption-btn"
              className="btn btn-gold btn-full font-bold text-xs uppercase tracking-wider py-3.5 shadow-2xl flex items-center justify-center gap-2"
            >
              {uiState === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full" />
                  Đang Đóng Dấu Vào Passport…
                </span>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>Xác Nhận — Đang Thưởng Thức Ly Này</span>
                </>
              )}
            </button>

            <Link
              href={`/menu/${product.slug}`}
              className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-muted hover:text-white border border-white/10"
            >
              Xem Chi Tiết Món & Nguồn Gốc
            </Link>
          </div>
        </div>
      </article>

      <p className="text-[11px] text-center text-muted leading-relaxed font-mono">
        Lưu ý: Mua đồ uống chưa tự động lưu dữ liệu. Chỉ khi bạn bấm xác nhận, ly nước mới được đóng dấu vào Passport.
      </p>
    </div>
  )
}
