'use client'

import Link from 'next/link'
import type { RecommendationResult } from '@/types'
import { getProductImage, getPublicProductCopy } from '@/lib/constants/drink-assets'

const CATEGORY_NAMES = { WAKE: 'cà phê', FOCUS: 'matcha', REFRESH: 'trà trái cây' }

export default function RecommendationClient({ result }: { result: RecommendationResult }) {
  const product = result.recommendedProduct

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16 space-y-6">
      <Link href="/check-in" className="text-sm text-muted hover:underline">← Chọn lại khẩu vị</Link>
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ad431e]">Một món để bạn thử</p>
        <h1 className="text-3xl font-black tracking-tight">Hợp gu hôm nay</h1>
        <p className="text-sm text-muted leading-relaxed">
          Bạn chọn nhóm {CATEGORY_NAMES[result.recommendedCategory]}. Đây là một gợi ý từ menu; bạn có thể đổi sang món khác bất cứ lúc nào.
        </p>
      </div>

      {product ? (
        <article className="surface rounded-3xl border border-[var(--color-border)] overflow-hidden">
          <div className="aspect-square bg-[#f5eadb]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image_url || getProductImage(product.slug, product.category)}
              alt={product.name} className="h-full w-full object-contain" />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-2xl font-black">{product.name}</h2>
              <p className="font-bold text-lg text-[#ad431e]">
                {product.price !== null ? new Intl.NumberFormat('vi-VN').format(product.price) + '₫' : 'Liên hệ quán'}
              </p>
            </div>
            <p className="text-sm text-muted leading-relaxed">{getPublicProductCopy(product).summary}</p>
            {product.caffeine_mg !== null && (
              <p className="text-xs text-muted">Caffeine tham khảo: khoảng {product.caffeine_mg} mg/ly. Lượng thực tế có thể thay đổi theo cách pha.</p>
            )}
            <Link href={'/menu/' + product.slug} className="btn btn-gold btn-full">Xem món & chọn đặt hàng</Link>
          </div>
        </article>
      ) : (
        <div className="surface rounded-2xl border border-[var(--color-border)] p-6">
          <p className="text-sm text-muted">Nhóm này chưa có món đang bán. Bạn xem thêm các món khác trong menu nhé.</p>
        </div>
      )}

      <Link href="/menu" className="btn btn-ghost btn-full">Xem toàn bộ menu</Link>
      <p className="text-xs text-muted text-center">Gợi ý khẩu vị là tùy chọn, không tạo đơn hàng hoặc ghi nhận một ly vào Passport.</p>
    </div>
  )
}
