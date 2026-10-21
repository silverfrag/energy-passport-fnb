'use client'

import { useEffect, useRef, useState } from 'react'
import DrinkMotionStage from './DrinkMotionStage'
import FlavourBackdrop, { getFlavourTheme } from './FlavourBackdrop'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { getProductArt } from '@/lib/constants/product-art'

const money = (price: number | null) => price === null ? 'Liên hệ giá' : `${new Intl.NumberFormat('vi-VN').format(price)}₫`

export default function HomeHero({ products }: { products: Product[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const wheelRegion = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const region = wheelRegion.current
    if (!region || products.length < 2) return
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let accumulated = 0
    let lastEvent = 0
    let lastSwitch = -Infinity
    let direction = 0
    let waitingForGesture = false

    const onWheel = (event: WheelEvent) => {
      // Preserve zoom, horizontal gestures and normal scrolling below the hero.
      if (!Number.isFinite(event.deltaY) || !finePointer.matches || event.ctrlKey || event.metaKey || event.shiftKey ||
          Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.deltaY ||
          (region.closest('section')?.getBoundingClientRect().top ?? -1) < 0) return
      event.preventDefault()
      const now = performance.now()
      const sign = Math.sign(event.deltaY)
      const gap = now - lastEvent
      lastEvent = now
      if (gap > 180 || sign !== direction) accumulated = 0
      direction = sign
      // Wait for the cup's journey, and let trackpad inertia finish before rearming.
      if (now - lastSwitch < 1200) return
      if (waitingForGesture && gap < 180) return
      waitingForGesture = false
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 :
        event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1
      accumulated += event.deltaY * unit
      if (Math.abs(accumulated) < 60) return
      setSelectedIndex((index) => (index + sign + products.length) % products.length)
      accumulated = 0
      lastSwitch = now
      waitingForGesture = true
    }

    region.addEventListener('wheel', onWheel, { passive: false })
    return () => region.removeEventListener('wheel', onWheel)
  }, [products.length])

  const selected = products.length ? selectedIndex % products.length : 0
  const product = products[selected]
  const category = !product || product.category === 'WAKE' ? 'CÀ PHÊ' : product.category === 'FOCUS' ? 'MATCHA' : 'TRÀ TRÁI CÂY'

  return <section className="fd-hero-v5 fd-home-hero-v6" data-category={product?.category || 'WAKE'} data-product={product?.slug} data-flavour={getFlavourTheme(product)} aria-labelledby="home-title">
    <FlavourBackdrop products={products} selected={selected} />
    <span className="fd-hero-watermark" aria-hidden="true">FAME</span>
    <div className="fd-hero-composition fd-shell">
      <div className="fd-hero-v5-copy">
        <p className="fd-kicker">FAME DRINK / MỘT LY, MỘT GU RIÊNG</p>
        <h1 id="home-title">ĐẬM VỊ.<br />ĐÚNG GU.</h1>
        <p className="fd-hero-v5-description">Cà phê, matcha và trà trái cây<br />giao tận nơi.</p>
        <div className="fd-hero-v5-actions"><Link href="/menu" className="fd-button fd-button-primary">Chọn món ngay <span aria-hidden="true">→</span></Link><a href="#flavours" className="fd-text-link">Khám phá vị</a></div>
        <div className="fd-hero-v5-picks" role="group" aria-label="Chọn đồ uống nổi bật">{products.map((item, index) => {
          const thumbnail = getProductArt(item, 'campaign')
          return <button key={item.id} type="button" onClick={() => setSelectedIndex(index)} aria-pressed={selected === index} aria-label={`Chọn ${item.name}`}><Image src={thumbnail.src} alt="" width={70} height={86} sizes="70px" unoptimized={!thumbnail.src.startsWith('/images/')} /></button>
        })}</div>
        <p className="sr-only" role="status">{product ? `${product.name}, ${money(product.price)}` : ''}</p>
      </div>
      <div className="fd-hero-v5-scene">
        <div ref={wheelRegion} className="fd-hero-v7-cups" data-visible="true"><DrinkMotionStage products={products} selected={selected} artMode="campaign" /></div>
        {products.length > 1 && <span className="fd-hero-wheel-hint" aria-hidden="true">↑ ↓ <span>Cuộn trên ly để đổi vị</span></span>}
        <span key={category} className="fd-hero-v5-outline" aria-hidden="true">{category}</span>
      </div>
      {product && <Link className="fd-hero-v5-caption" href={`/menu/${product.slug}`}><span>{product.name}</span><strong>{money(product.price)}</strong><svg aria-hidden="true" viewBox="0 0 94 47" fill="none"><path d="M4 2c0 26 25 39 49 28 15-7 14-17 6-14-8 4 3 20 27 12m-8-4 9 4-6 8" stroke="currentColor" strokeWidth="1.3" /></svg></Link>}
    </div>
  </section>
}
