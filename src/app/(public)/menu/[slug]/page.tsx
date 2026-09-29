import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import { getProductImage, DRINK_METADATA } from '@/lib/constants/drink-assets'
import { 
  IconScan, 
  IconCompass, 
  IconShield, 
  IconClock, 
  IconPassportCrest,
  IconArrowRight 
} from '@/components/icons'

interface Props {
  params: Promise<{ slug: string }>
}

import { STANDARD_PRODUCTS, findStandardProduct } from '@/lib/constants/products'

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (data) return data
  } catch { /* fallback */ }
  return findStandardProduct(slug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Không tìm thấy thức uống' }
  return {
    title: `${product.name} — Fame Drink`,
    description: product.short_description ?? product.description ?? '',
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const imageUrl = product.image_url || getProductImage(product.slug, product.category)
  const meta = DRINK_METADATA[product.slug] || {
    tastingNotes: ['Cân bằng hài hòa', 'Hậu vị ngọt thanh'],
    origin: 'Nguyên liệu đặc sản tuyển chọn',
    brewing: 'Chiết xuất thủ công chuẩn nhiệt độ',
    bestTime: '08:00 - 16:00',
    servingTemp: 'Đá viên tinh khiết',
  }

  return (
    <div className="w-full fade-in pb-20">
      {/* Product Hero Photography */}
      <div className="relative h-80 sm:h-[450px] w-full overflow-hidden bg-stone-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-black/20 to-black/50" />
        
        {/* Navigation overlay */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-semibold text-white hover:bg-black/90 transition-colors"
          >
            ← Quay lại Thực Đơn
          </Link>
        </div>

        {/* Floating Category Pill */}
        <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2">
          <CategoryBadge category={product.category} showEmoji={false} />
          <span className="text-[10px] font-mono tracking-wider uppercase text-amber-200/90 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30">
            {meta.origin}
          </span>
        </div>
      </div>

      <div className="w-full mx-auto max-w-2xl px-4 sm:px-6 pt-6 space-y-6">
        {/* Title and Price */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>
          {product.price && (
            <span className="text-2xl font-black font-mono text-amber-300 flex-shrink-0">
              {new Intl.NumberFormat('vi-VN').format(product.price)}₫
            </span>
          )}
        </div>

        {/* Tasting Notes Highlight */}
        <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted font-mono">
            Hương Vị Ghi Nhận (Tasting Notes)
          </p>
          <div className="flex flex-wrap gap-2">
            {meta.tastingNotes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full text-xs font-medium bg-amber-400/10 text-amber-200 border border-amber-400/20"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-muted font-mono">
              Hàm Lượng Caffeine
            </p>
            <p className="text-lg font-black text-white font-mono mt-0.5">
              {product.caffeine_mg !== null ? `~${product.caffeine_mg} mg` : 'Không đáng kể'}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">Đo lường trên mẻ pha</p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-muted font-mono">
              Thời Điểm Khuyên Dùng
            </p>
            <p className="text-lg font-black text-white font-mono mt-0.5">
              {meta.bestTime}
            </p>
            <p className="text-[10px] text-stone-400 mt-1">{meta.servingTemp}</p>
          </div>
        </div>

        {/* Brewing Story */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Quy Cách Chiết Xuất & Nguồn Gốc
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {product.description || product.short_description}
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-300/80 pt-1">
            <IconShield className="w-4 h-4 text-amber-400" color="#D4AF37" />
            <span>{meta.brewing}</span>
          </div>
        </div>

        {/* QR Scan Action / Bind to Passport */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <Link
            href={`/scan/${product.slug}`}
            className="btn btn-gold btn-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-3.5 shadow-2xl"
          >
            <IconScan className="w-4 h-4" />
            <span>Quét Mã Trên Ly & Xác Nhận Vào Passport</span>
          </Link>

          <Link
            href="/check-in"
            className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white border border-white/10 flex items-center justify-center gap-2 py-3"
          >
            <IconCompass className="w-3.5 h-3.5" />
            <span>Check-in Nhận Đề Xuất Phù Hợp Trạng Thái</span>
          </Link>
        </div>

        <p className="text-[11px] text-muted text-center pt-2 font-mono">
          Thông tin caffeine được chuẩn hóa theo mẻ chiết xuất thủ công của Barista.
        </p>
      </div>
    </div>
  )
}
