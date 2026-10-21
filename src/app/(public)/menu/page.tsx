import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import ProductShowcase from '@/components/ProductShowcase'
import { CATEGORY_DETAILS } from '@/lib/constants/drink-assets'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import { getAdminProductsList } from '@/lib/store/catalog-service'
import type { DrinkCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Xem menu cà phê, matcha và trà trái cây tại Fame Drink. Chọn món yêu thích để giao tận nơi.',
  alternates: { canonical: '/menu' },
}

const CATEGORIES: { id: DrinkCategory; anchor: string; title: string; description: string }[] = [
  { id: 'WAKE', anchor: 'ca-phe', title: 'ĐẬM MỘT CHÚT.', description: 'Từ cà phê đen quen thuộc đến những kết hợp thơm béo.' },
  { id: 'FOCUS', anchor: 'matcha', title: 'ÊM MỘT CHÚT.', description: 'Vị trà xanh cùng sữa, dừa và các hương vị trái cây.' },
  { id: 'REFRESH', anchor: 'tra-trai-cay', title: 'TƯƠI MỘT CHÚT.', description: 'Nhiều lựa chọn chua ngọt, thơm hương trái cây.' },
]

export default async function MenuPage() {
  const catalog = await getAdminProductsList().catch(() => ({ products: STANDARD_PRODUCTS }))
  const products = catalog.products.filter((product) => product.active)
  const spotlightSlugs = ['ca-phe-sot-biscoff', 'matcha-latte', 'tra-dao-luu-do', 'tra-xoai-yakult']
  const preferred = spotlightSlugs.flatMap((slug) => products.find((product) => product.slug === slug) ?? [])
  const spotlight = preferred.length ? preferred : products.slice(0, 4)

  return <>
    {spotlight.length ? <ProductShowcase products={spotlight} /> : <header className="fd-shell py-8"><h1 className="fd-menu-title">Menu Fame Drink</h1></header>}
    <div id="all-drinks" className="fd-catalog-navigation"><nav className="fd-catalog-nav fd-shell" aria-label="Nhóm đồ uống">{CATEGORIES.map((category) => <a key={category.id} href={`#${category.anchor}`}>{CATEGORY_DETAILS[category.id].label}<span>{products.filter((product) => product.category === category.id).length}</span></a>)}<Link href="/checkout" className="fd-catalog-cart">Giỏ hàng ↗</Link></nav></div>
    {CATEGORIES.map((category, index) => {
      const items = products.filter((product) => product.category === category.id)
      return <section key={category.id} id={category.anchor} data-category={category.id} className="fd-catalog-section" aria-labelledby={`${category.anchor}-heading`}>
        <div className="fd-shell"><div className="fd-catalog-heading"><div><p className="fd-kicker">0{index + 1} / {category.title}</p><h2 id={`${category.anchor}-heading`}>{CATEGORY_DETAILS[category.id].label}</h2></div><p>{category.description}</p><span className="fd-catalog-seal" aria-hidden="true">FAME<br />✳<br />{category.id}</span></div>
          {items.length ? <div className="fd-product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <p className="fd-empty">Nhóm này đang cập nhật món. Bạn xem thử các nhóm còn lại nhé.</p>}
        </div>
      </section>
    })}
    <div className="fd-catalog-ending fd-shell"><p>ĐÃ TÌM THẤY<br /><em>gu của bạn?</em></p><Link href="/checkout" className="fd-button fd-button-primary">Xem giỏ hàng <span aria-hidden="true">→</span></Link></div>
  </>
}
