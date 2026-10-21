import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import FlavourBackdrop, { getFlavourTheme } from '@/components/FlavourBackdrop'
import { getProductArt } from '@/lib/constants/product-art'
import AddToCartButton from '@/features/orders/AddToCartButton'
import { getPublicProductCopy } from '@/lib/constants/drink-assets'
import { findStandardProduct, STANDARD_PRODUCTS } from '@/lib/constants/products'
import { getAdminProduct, getAdminProductsList } from '@/lib/store/catalog-service'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await getAdminProduct(slug)
    // An inactive catalog item must not be resurrected by the standard fallback.
    return product?.active ? product : null
  } catch {
    const product = findStandardProduct(slug)
    return product?.active ? product : null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Không tìm thấy đồ uống' }
  return {
    title: product.name,
    description: `${getPublicProductCopy(product).summary} Xem món tại Fame Drink, giao tận nơi.`,
    alternates: { canonical: `/menu/${product.slug}` },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const art = getProductArt(product)
  const copy = getPublicProductCopy(product)
  const { products } = await getAdminProductsList().catch(() => ({ products: STANDARD_PRODUCTS }))
  const related = products.filter((item) => item.active && item.slug !== product.slug).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 4)
  const category = product.category === 'WAKE' ? 'CÀ PHÊ' : product.category === 'FOCUS' ? 'MATCHA' : 'TRÀ TRÁI CÂY'

  return <div className="fd-detail-v5">
    <section className="fd-detail-stage" data-category={product.category} data-flavour={getFlavourTheme(product)} aria-labelledby="product-title">
      <FlavourBackdrop products={[product]} selected={0} />
      <span className="fd-detail-watermark" aria-hidden="true">{category}</span>
      <nav className="fd-detail-breadcrumb fd-shell" aria-label="Đường dẫn"><Link href="/">Fame Drink</Link><span aria-hidden="true">/</span><Link href="/menu">Menu</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav>
      <div className="fd-detail-composition fd-shell">
        <div className="fd-detail-editorial"><p className="fd-kicker">THE FAME EDIT / {category}</p><h1 id="product-title">{product.name}</h1><p className="fd-detail-v5-description">{copy.description}</p><div className="fd-detail-v5-notes" aria-label="Hương vị">{copy.tastingNotes.map((note, i) => <span key={note}><small>{String(i + 1).padStart(2, '0')}</small>{note}</span>)}</div><Link href="/menu" className="fd-text-link">Khám phá menu ↗</Link></div>
        <div className={`fd-detail-centerpiece${art.cutout ? ' is-cutout' : ''}`} data-framed={art.framed}><span className="fd-detail-orbit" aria-hidden="true" /><Image src={art.src} alt={product.name} width={800} height={900} sizes="(min-width: 1000px) 40vw, (min-width: 600px) 50vw, 85vw" loading="eager" fetchPriority="high" unoptimized={!art.src.startsWith('/images/')} /><span className="fd-detail-art-signature" aria-hidden="true">FAME / ĐẬM VỊ. ĐÚNG GU.</span></div>
        <section className="fd-product-purchase" aria-labelledby="choice-heading"><p className="fd-kicker">YOUR DAILY FLAVOUR</p><h2 id="choice-heading">Một ly<br /><em>đúng gu.</em></h2><p className="fd-purchase-name">{product.name}</p><AddToCartButton product={product} /><Link href="/checkout" className="fd-button fd-button-outline">Xem giỏ hàng →</Link><p className="fd-purchase-note">Giao tận địa chỉ của bạn. Ghi yêu cầu riêng cho món tại bước đặt hàng.</p></section>
      </div>
      <div className="fd-detail-stage-bottom fd-shell"><span>CHỌN MÓN THEO GU CỦA BẠN</span><span>{category} / FAME DRINK</span><span aria-hidden="true">✳</span></div>
    </section>
    <div className="fd-detail-after fd-shell">
      <section className="fd-detail-passport-line" aria-labelledby="passport-prompt"><span className="fd-kicker">ENERGY PASSPORT</span><h2 id="passport-prompt">Mỗi ly, một dấu nhớ.</h2><p>Nhật ký đồ uống cá nhân, dùng tùy chọn.<br />Bạn không cần tài khoản để đặt món.</p><Link href="/passport" className="fd-text-link">Mở Passport ↗</Link></section>
      {related.length > 0 && <section className="fd-related-v5" aria-labelledby="related-title"><div className="fd-heading-row"><div><p className="fd-kicker">MỘT CHÚT GU MỚI</p><h2 id="related-title">Cũng có thể bạn thích.</h2></div><Link href="/menu" className="fd-text-link">Tất cả đồ uống ↗</Link></div><div className="fd-product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </div>
  </div>
}
