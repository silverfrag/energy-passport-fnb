import Link from 'next/link'
import type { Product } from '@/types'
import { getProductImage, getPublicProductCopy } from '@/lib/constants/drink-assets'
import AddToCartButton from '@/features/orders/AddToCartButton'

interface ProductCardProps {
  product: Product
  href?: string
}

export default function ProductCard({ product, href }: ProductCardProps) {
  const imageUrl = product.image_url || getProductImage(product.slug, product.category)
  const copy = getPublicProductCopy(product)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8ddcf] bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#c99f80] hover:shadow-md">
      <Link href={href ?? `/menu/${product.slug}`} className="group flex flex-1 flex-col rounded-t-2xl focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#b94720]">
        <div className="relative aspect-square overflow-hidden bg-[#f7f1e8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={product.name} width={1024} height={1024} loading="lazy" decoding="async" className="h-full w-full object-contain" />
          {product.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-[#fffaf2] px-2.5 py-1 text-[10px] font-bold text-[#71422b] shadow-sm sm:left-3 sm:top-3">Fame gợi ý</span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="text-sm font-bold leading-snug text-[#35251c] transition-colors group-hover:text-[#b94720] sm:text-base">{product.name}</h3>
          <p className="mb-3 mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#756457]">{copy.summary}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-1 border-t border-[#f0e7dc] pt-3 sm:gap-2">
            <span className="text-base font-extrabold tracking-tight text-[#a63d1b] sm:text-lg">
              {product.price !== null ? `${new Intl.NumberFormat('vi-VN').format(product.price)}₫` : 'Liên hệ giá'}
            </span>
            <span className="text-[11px] font-semibold text-[#756457]">Chi tiết <span aria-hidden="true">↗</span></span>
          </div>
        </div>
      </Link>
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}
