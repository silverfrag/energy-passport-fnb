import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CategoryBadge from '@/components/CategoryBadge'
import AddToCartButton from '@/features/orders/AddToCartButton'
import { getProductImage, getPublicProductCopy } from '@/lib/constants/drink-assets'
import { findStandardProduct } from '@/lib/constants/products'
import { getAdminProduct } from '@/lib/store/catalog-service'
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
    title: `${product.name} — Fame Drink`,
    description: `${getPublicProductCopy(product).summary} Xem món tại Fame Drink, giao tận nơi.`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const imageUrl = product.image_url || getProductImage(product.slug, product.category)
  const copy = getPublicProductCopy(product)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-8 sm:pt-8">
      <Link href="/menu" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#756457] hover:text-[#b94720] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720]">
        <span aria-hidden="true">←</span> Xem tất cả món
      </Link>

      <div className="grid items-start gap-7 md:grid-cols-2 md:gap-10 lg:gap-14">
        <div className="overflow-hidden rounded-3xl border border-[#e8ddcf] bg-[#f7f1e8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={product.name} width={1254} height={1254} fetchPriority="high" className="aspect-square h-auto w-full object-contain" />
        </div>

        <div className="space-y-6 md:pt-2">
          <div>
            <CategoryBadge category={product.category} />
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#35251c] sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#b94720]">
              {product.price !== null ? `${new Intl.NumberFormat('vi-VN').format(product.price)}₫` : 'Liên hệ để biết giá'}
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#756457]">{copy.description}</p>
          </div>

          <div className="flex flex-wrap gap-2" aria-label="Hương vị">
            {copy.tastingNotes.map((note) => <span key={note} className="rounded-full border border-[#e5d7c7] bg-[#f7efe4] px-3 py-1.5 text-xs font-medium text-[#71533e]">{note}</span>)}
          </div>

          <section className="rounded-2xl border border-[#e8ddcf] bg-white p-5 sm:p-6" aria-labelledby="nhan-mon-heading">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a4522c]">Chọn món · Nhận món · Thưởng thức</p>
            <h2 id="nhan-mon-heading" className="text-lg font-bold text-[#35251c]">Giao tận địa chỉ của bạn</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#756457]">
              Thêm món vào giỏ, nhập địa chỉ giao hàng và gửi đơn cho Fame. Bạn có thể ghi yêu cầu riêng khi đặt món.
            </p>
            <div className="mt-5">
              <AddToCartButton product={product} />
            </div>
            <Link href="/checkout" className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#d7c9b9] px-5 py-2.5 text-sm font-bold text-[#493326] transition-colors hover:border-[#b94720] hover:text-[#b94720] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720]">
              Xem giỏ hàng <span aria-hidden="true">→</span>
            </Link>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8ddcf] pt-5">
            <p className="text-xs text-[#756457]">Đã có Passport của bạn?</p>
            <Link href="/passport" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#71533e] hover:text-[#b94720] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b94720]">
              Xem Passport <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
