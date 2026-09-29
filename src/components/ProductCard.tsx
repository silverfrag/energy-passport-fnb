import Link from 'next/link'
import type { Product } from '@/types'
import CategoryBadge from './CategoryBadge'
import { getProductImage } from '@/lib/constants/drink-assets'

interface ProductCardProps {
  product: Product
  href?: string
}

export default function ProductCard({ product, href }: ProductCardProps) {
  const cardHref = href ?? `/menu/${product.slug}`
  const imageUrl = product.image_url || getProductImage(product.slug, product.category)

  return (
    <Link href={cardHref} className="block group">
      <article
        className="surface card-hover h-full flex flex-col overflow-hidden transition-all duration-300"
        style={{
          minHeight: 280,
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Image Container with Gradient Fade */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ height: 180, background: 'var(--color-surface-2)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 drink-overlay opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category overlay pill */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={product.category} />
          </div>

          {product.featured && (
            <span
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md"
              style={{
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#FFD166',
                border: '1px solid rgba(255, 209, 102, 0.3)',
              }}
            >
              ★ Nổi bật
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h3
            className="font-bold text-base leading-snug transition-colors group-hover:text-wake"
            style={{ color: 'var(--color-text)' }}
          >
            {product.name}
          </h3>

          {product.short_description && (
            <p
              className="text-xs line-clamp-2 leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {product.short_description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <span className="tag-pill text-[10px]">
              {product.caffeine_mg !== null ? `~${product.caffeine_mg}mg caffeine` : 'Thảo mộc nhẹ'}
            </span>

            {product.price && (
              <span
                className="text-sm font-bold tracking-tight"
                style={{ color: 'var(--color-text)' }}
              >
                {new Intl.NumberFormat('vi-VN').format(product.price)}₫
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
