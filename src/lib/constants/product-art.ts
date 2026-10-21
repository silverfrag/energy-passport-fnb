import type { Product } from '@/types'
import { getProductImage } from '@/lib/constants/drink-assets'

// Only restyle the bundled photography. Uploaded catalog images always win.
const CUTOUTS: Record<string, string> = {
  'bac-siu': '/images/campaign/brand-v12/bac-siu.webp',
  'ca-phe-caramel-kem-muoi': '/images/campaign/brand-v12/ca-phe-caramel-kem-muoi.webp',
  'ca-phe-cot-dua': '/images/campaign/brand-v12/ca-phe-cot-dua.webp',
  'ca-phe-den': '/images/campaign/brand-v12/ca-phe-den.webp',
  'ca-phe-kem-deo-buon-me': '/images/campaign/brand-v12/ca-phe-kem-deo-buon-me.webp',
  'ca-phe-sua-tuoi-suong-sao': '/images/campaign/brand-v12/ca-phe-sua-tuoi-suong-sao.webp',
  'ca-phe-sua': '/images/campaign/brand-v12/ca-phe-sua.webp',
  'coco-matcha': '/images/campaign/brand-v12/coco-matcha.webp',
  'matcha-caramel': '/images/campaign/brand-v12/matcha-caramel.webp',
  'matcha-coldwhisk': '/images/campaign/brand-v12/matcha-coldwhisk.webp',
  'matcha-cookie-kem-deo': '/images/campaign/brand-v12/matcha-cookie-kem-deo.webp',
  'matcha-dau-sua': '/images/campaign/brand-v12/matcha-dau-sua.webp',
  'matcha-dua-non': '/images/campaign/brand-v12/matcha-dua-non.webp',
  'matcha-xoai-sua': '/images/campaign/brand-v12/matcha-xoai-sua.webp',
  'tra-buoi': '/images/campaign/brand-v12/tra-buoi.webp',
  'tra-cam-quyt': '/images/campaign/brand-v12/tra-cam-quyt.webp',
  'tra-chanh-day-chom-chom': '/images/campaign/brand-v12/tra-chanh-day-chom-chom.webp',
  'tra-chanh-day-nhiet-doi': '/images/campaign/brand-v12/tra-chanh-day-nhiet-doi.webp',
  'tra-dao-cam-sa': '/images/campaign/brand-v12/tra-dao-cam-sa.webp',
  'tra-dau': '/images/campaign/brand-v12/tra-dau.webp',
  'tra-dua-hau-oi-hong': '/images/campaign/brand-v12/tra-dua-hau-oi-hong.webp',
  'tra-dua-luoi': '/images/campaign/brand-v12/tra-dua-luoi.webp',
  'tra-luu-do-habicus': '/images/campaign/brand-v12/tra-luu-do-habicus.webp',
  'tra-mang-cau-tuoi': '/images/campaign/brand-v12/tra-mang-cau-tuoi.webp',
  'tra-me': '/images/campaign/brand-v12/tra-me.webp',
  'tra-tac': '/images/campaign/brand-v12/tra-tac.webp',
  'tra-vai-hoa-hong': '/images/campaign/brand-v12/tra-vai-hoa-hong.webp',
  'tra-viet-quat': '/images/campaign/brand-v12/tra-viet-quat.webp',
  'matcha-latte': '/images/campaign/brand-v12/matcha-latte.webp',
  'tra-dao-luu-do': '/images/campaign/brand-v12/tra-dao-luu-do.webp',
  'tra-xoai-yakult': '/images/campaign/brand-v12/tra-xoai-yakult.webp',
  'ca-phe-sot-biscoff': '/images/campaign/brand-v12/ca-phe-sot-biscoff.webp',
}
const CAMPAIGN_CUTOUTS: Record<string, string> = {
  'matcha-latte': '/images/campaign/matcha-cutout-v5.webp',
  'tra-dao-luu-do': '/images/campaign/peach-cutout-v5.webp',
  'tra-xoai-yakult': '/images/campaign/mango-cutout-v5.webp',
  'ca-phe-sot-biscoff': '/images/campaign/biscoff-cutout-v5.webp',
}
export function getProductArt(product: Product, usage: 'catalog' | 'campaign' = 'catalog') {
  const original = getProductImage(product.slug, product.category)
  const bundled = !product.image_url || product.image_url === original
  const cutout = bundled ? (usage === 'campaign' ? CAMPAIGN_CUTOUTS[product.slug] || CUTOUTS[product.slug] : CUTOUTS[product.slug]) : undefined
  return { src: cutout || product.image_url || original, cutout: Boolean(cutout), framed: Boolean(cutout?.includes('/brand-v12/')) }
}
