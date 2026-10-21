'use client'

import Image from 'next/image'
import type { Product } from '@/types'
import { getProductArt } from '@/lib/constants/product-art'

/** Persistent layers let both the departing and arriving cups travel on screen. */
export default function DrinkMotionStage({ products, selected, artMode = 'catalog' }: { products: Product[]; selected: number; artMode?: 'catalog' | 'campaign' }) {
  return <span className="fd-drink-motion" aria-hidden="true">{products.map((product, index) => {
    const art = getProductArt(product, artMode)
    return <span key={product.id} className={`fd-drink-layer${art.cutout ? ' is-cutout' : ' is-photo'}`} data-position={index === selected ? 'active' : index < selected ? 'before' : 'after'}><Image src={art.src} alt="" fill sizes="(min-width: 1000px) 600px, 70vw" loading="eager" unoptimized={!art.src.startsWith('/images/')} /></span>
  })}</span>
}
