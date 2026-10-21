'use client'

import { useState } from 'react'
import DrinkMotionStage from './DrinkMotionStage'
import FlavourBackdrop, { getFlavourTheme } from './FlavourBackdrop'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { getProductArt } from '@/lib/constants/product-art'
import { getPublicProductCopy } from '@/lib/constants/drink-assets'
import AddToCartButton from '@/features/orders/AddToCartButton'

export default function ProductShowcase({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0)
  if (!products.length) return null
  const selectedIndex = index % products.length
  const product = products[selectedIndex]
  const art = getProductArt(product)
  const copy = getPublicProductCopy(product)
  const category = product.category === 'WAKE' ? 'CÀ PHÊ' : product.category === 'FOCUS' ? 'MATCHA' : 'TRÀ TRÁI CÂY'
  function move(step: number) { setIndex((value) => (value + step + products.length) % products.length) }

  return <section className="fd-showcase" data-category={product.category} data-product={product.slug} data-flavour={getFlavourTheme(product)} aria-labelledby="showcase-title">
    <FlavourBackdrop products={products} selected={selectedIndex} />
    <span className="fd-showcase-watermark" aria-hidden="true">FAME</span>
    <div className="fd-showcase-top fd-shell">
      <div><p className="fd-kicker">THE FLAVOUR EDIT / FAME DRINK</p><h1 id="showcase-title">Gặp gu của bạn.</h1></div>
      <a href="#all-drinks" className="fd-text-link">Khám phá toàn bộ menu ↓</a>
    </div>
    <div className="fd-showcase-stage fd-shell">
      <div className="fd-showcase-editorial"><p className="fd-kicker">{category} / {String(selectedIndex + 1).padStart(2, '0')}</p><h2 aria-live="polite" aria-atomic="true"><span key={product.id} className="fd-flavour-name">{product.name}</span></h2><p>{copy.summary}</p><Link href={`/menu/${product.slug}`} className="fd-text-link">Khám phá hương vị ↗</Link></div>
      <div className="fd-showcase-gallery">
        <button type="button" onClick={() => move(-1)} aria-label="Xem món trước" className="fd-carousel-arrow">←</button>
        <Link href={`/menu/${product.slug}`} className={`fd-showcase-product${art.cutout ? ' is-cutout' : ''}`} data-framed={art.framed} aria-label={`Xem chi tiết ${product.name}`}><DrinkMotionStage products={products} selected={selectedIndex} /></Link>
        <button type="button" onClick={() => move(1)} aria-label="Xem món tiếp theo" className="fd-carousel-arrow">→</button>
      </div>
      <div className="fd-showcase-purchase"><span className="fd-kicker">MỘT LY ĐÚNG GU</span><AddToCartButton key={product.id} product={product} /><p>Chọn món trước.<br />Ghi yêu cầu riêng tại giỏ hàng.</p></div>
    </div>
    <div className="fd-showcase-selector fd-shell" aria-label="Chọn món nổi bật">{products.map((item, position) => <button type="button" key={item.id} onClick={() => setIndex(position)} aria-pressed={selectedIndex === position} aria-label={`Chọn ${item.name}`}><Image src={getProductArt(item).src} alt="" width={54} height={68} sizes="54px" unoptimized={!getProductArt(item).src.startsWith('/images/')} /><span>{item.name}</span></button>)}</div>
  </section>
}
