import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { getPublicProductCopy } from '@/lib/constants/drink-assets'
import { getProductArt } from '@/lib/constants/product-art'
import { getFlavourTheme } from './FlavourBackdrop'
import AddToCartButton from '@/features/orders/AddToCartButton'

interface ProductCardProps {
  product: Product
  href?: string
  number?: number
  artMode?: 'catalog' | 'campaign'
}

export default function ProductCard({ product, href, number, artMode = 'catalog' }: ProductCardProps) {
  const art = getProductArt(product, artMode)
  const imageUrl = art.src
  const copy = getPublicProductCopy(product)

  return (
    <article className="fd-product-card" data-category={product.category} data-flavour={getFlavourTheme(product)} data-framed={art.framed} data-highlight={number === 1 || undefined}>
      <Link href={href ?? `/menu/${product.slug}`} className="fd-product-main">
        <div className={`fd-product-image${art.cutout ? ' fd-cutout' : ''}`}>
          <Image src={imageUrl} alt={product.name} fill sizes="(min-width: 1024px) 290px, (min-width: 640px) calc(50vw - 42px), calc(50vw - 22px)" unoptimized={!imageUrl.startsWith('/images/')} />
          {(number || product.featured) && <span className="fd-product-number">{number ? `${String(number).padStart(2, '0')} / ` : ''}{product.category === 'WAKE' ? 'CÀ PHÊ' : product.category === 'FOCUS' ? 'MATCHA' : 'TRÀ TRÁI CÂY'}</span>}
        </div>
        <div className="fd-product-info">
          <h3>{product.name}</h3>
          <p>{copy.summary}</p>
          <div className="fd-product-bottom">
<span className="fd-product-detail">Xem món <span aria-hidden="true">↗</span></span>
          </div>
        </div>
      </Link>
      <div className="fd-product-add">
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}
