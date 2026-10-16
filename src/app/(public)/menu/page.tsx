import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { CATEGORY_DETAILS } from '@/lib/constants/drink-assets'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import { getAdminProductsList } from '@/lib/store/catalog-service'
import type { DrinkCategory, Product } from '@/types'

export const metadata: Metadata = {
  title: 'Menu — Fame Drink',
  description: 'Xem menu cà phê, matcha và trà trái cây tại Fame Drink. Chọn món yêu thích để giao tận nơi.',
}

async function getProducts(): Promise<Product[]> {
  try {
    const { products } = await getAdminProductsList()
    return products.filter((product) => product.active)
  } catch {
    return STANDARD_PRODUCTS.filter((product) => product.active)
  }
}

const CATEGORIES: { id: DrinkCategory; anchor: string; description: string }[] = [
  { id: 'WAKE', anchor: 'ca-phe', description: 'Từ cà phê đen quen thuộc đến những kết hợp thơm béo.' },
  { id: 'FOCUS', anchor: 'matcha', description: 'Vị trà xanh cùng sữa, dừa và các hương vị trái cây.' },
  { id: 'REFRESH', anchor: 'tra-trai-cay', description: 'Nhiều lựa chọn chua ngọt, thơm hương trái cây.' },
]

export default async function MenuPage() {
  const products = await getProducts()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b94720]">Fame Drink · Giao hàng tận nơi</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#35251c] sm:text-5xl">Hôm nay uống gì?</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#756457] sm:text-base">
            Cà phê, matcha hay trà trái cây — chọn món bạn thích để giao tận nơi.
          </p>
        </div>
        <Link href="/checkout" className="inline-flex min-h-11 w-fit items-center justify-center gap-3 rounded-full border border-[#d7c9b9] bg-white px-5 py-2.5 text-sm font-bold text-[#35251c] transition-colors hover:border-[#b94720] hover:text-[#b94720] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720]">
          Xem giỏ hàng <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <nav
        aria-label="Nhóm đồ uống"
        className="sticky z-20 -mx-4 mb-8 flex gap-2 overflow-x-auto border-y border-[#e8ddcf] bg-[#fffaf2]/95 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:rounded-2xl sm:border sm:px-3"
        style={{ top: 'var(--public-header-height, 72px)' }}
      >
        {CATEGORIES.map((category) => {
          const count = products.filter((product) => product.category === category.id).length
          return (
            <a key={category.id} href={`#${category.anchor}`} className="inline-flex min-h-11 flex-shrink-0 items-center gap-2 rounded-full border border-[#e2d5c5] bg-white px-4 py-2 text-sm font-bold text-[#493326] transition-colors hover:border-[#b94720] hover:bg-[#fff0e5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b94720]">
              {CATEGORY_DETAILS[category.id].label}
              <span className="text-xs font-medium text-[#897565]">{count}</span>
            </a>
          )
        })}
      </nav>

      <div className="space-y-12 sm:space-y-16">
        {CATEGORIES.map((category) => {
          const categoryProducts = products.filter((product) => product.category === category.id)
          return (
            <section key={category.id} id={category.anchor} className="scroll-mt-40" aria-labelledby={`${category.anchor}-heading`}>
              <div className="mb-5 border-b border-[#e8ddcf] pb-4">
                <div className="flex items-baseline gap-3">
                  <h2 id={`${category.anchor}-heading`} className="text-2xl font-extrabold tracking-tight text-[#35251c] sm:text-3xl">{CATEGORY_DETAILS[category.id].label}</h2>
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#8b7868]">{category.id}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#756457]">{category.description}</p>
              </div>
              {categoryProducts.length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                  {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
              ) : (
                <p className="rounded-2xl border border-[#e8ddcf] bg-white p-6 text-sm text-[#756457]">Nhóm này đang cập nhật món. Bạn xem thử các nhóm còn lại nhé.</p>
              )}
            </section>
          )
        })}
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#f2e7d8] p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold text-[#35251c]">Đã chọn được món yêu thích?</p>
          <p className="mt-1 text-sm text-[#756457]">Kiểm tra giỏ hàng và nhập địa chỉ giao món.</p>
        </div>
        <Link href="/checkout" className="inline-flex min-h-11 items-center gap-3 rounded-full bg-[#b94720] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#963716] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720]">
          Xem giỏ hàng <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
