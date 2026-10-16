import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { getAdminProductsList } from '@/lib/store/catalog-service'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import { getProductImage } from '@/lib/constants/drink-assets'
import { FAME_FACEBOOK_URL } from '@/lib/constants/business'

export default async function HomePage() {
  const { products } = await getAdminProductsList().catch(() => ({ products: STANDARD_PRODUCTS }))
  const active = products.filter((product) => product.active)
  const picks = ['ca-phe-sot-biscoff', 'matcha-latte', 'tra-dao-luu-do', 'tra-xoai-yakult']
  const featured = picks.flatMap((slug) => {
    const product = active.find((item) => item.slug === slug)
    return product ? [product] : []
  })
  const hero = active.find((product) => product.slug === 'matcha-latte') ?? active[0]
  const prices = active.flatMap((product) => product.price === null ? [] : [product.price])
  const priceFrom = prices.length ? new Intl.NumberFormat('vi-VN').format(Math.min(...prices)) : null

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#e8ddcf]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1.08fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7c9b9] px-3 py-1.5 text-xs font-bold text-[#756457]"><span className="size-2 rounded-full bg-[#497549]" aria-hidden="true" />Đồ uống takeaway · Giao tận nơi</p>
            <h1 className="max-w-xl text-[clamp(2.75rem,6vw,4.8rem)] font-extrabold leading-[1.08] tracking-[-0.055em] text-[#35251c]">Một ly ngon.<br /><span className="text-[#b94720]">Đi cùng bạn.</span></h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#756457] sm:text-lg">Đậm vị cà phê, thơm béo matcha hay mát lành trà trái cây. Chọn món bạn thích, Fame giao đến nơi bạn cần.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/menu" className="inline-flex min-h-12 items-center justify-center gap-5 rounded-full bg-[#b94720] px-6 py-3 text-sm font-bold text-white hover:bg-[#963716]">Chọn món ngay <span aria-hidden="true">→</span></Link>
              <a href={FAME_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ccb9a5] px-5 py-3 text-sm font-bold text-[#493326] hover:bg-[#f2e7d8]">Nhắn Fame trên Facebook ↗</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#e8ddcf] pt-5 text-sm text-[#756457]">
              <span><strong className="text-[#35251c]">{active.length} món</strong> trong menu</span>
              {priceFrom && <span>Chỉ từ <strong className="text-[#35251c]">{priceFrom}₫</strong></span>}
              <span>Không cần tài khoản</span>
            </div>
          </div>
          {hero && <Link href={`/menu/${hero.slug}`} className="group relative mx-auto block w-full max-w-lg rounded-[2rem] border border-[#e1d3c1] bg-[#eee5d6] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 px-2 pb-2 text-xs font-bold uppercase tracking-widest text-[#756457]"><span>Một vị ngon cho hôm nay</span><span aria-hidden="true">↗</span></div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f7f1e8]">
              <Image src={hero.image_url || getProductImage(hero.slug, hero.category)} alt={hero.name} fill priority sizes="(max-width: 1024px) 90vw, 480px" className="object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-[#fffaf2] px-5 py-4">
              <div><p className="text-xs text-[#756457]">Fame gợi ý</p><p className="text-lg font-extrabold text-[#35251c]">{hero.name}</p></div>
              {hero.price !== null && <span className="text-lg font-extrabold text-[#b94720]">{new Intl.NumberFormat('vi-VN').format(hero.price)}₫</span>}
            </div>
          </Link>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16" aria-labelledby="menu-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b94720]">Mỗi ngày, một vị bạn thích</p><h2 id="menu-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl">Hôm nay uống gì?</h2></div>
          <Link href="/menu" className="inline-flex min-h-11 items-center gap-3 text-sm font-bold text-[#b94720] hover:underline">Xem toàn bộ menu <span aria-hidden="true">→</span></Link>
        </div>
        <nav aria-label="Chọn nhóm đồ uống" className="mb-7 flex flex-wrap gap-2">
          {[['ca-phe', 'Cà phê'], ['matcha', 'Matcha'], ['tra-trai-cay', 'Trà trái cây']].map(([id, title]) => <Link key={id} href={`/menu#${id}`} className="inline-flex min-h-11 items-center rounded-full border border-[#d7c9b9] bg-white px-5 text-sm font-bold hover:border-[#b94720] hover:text-[#b94720]">{title} ↗</Link>)}
        </nav>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="border-y border-[#e8ddcf] bg-[#f2e7d8]" aria-labelledby="order-heading">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b94720]">Đặt trực tiếp trên website</p><h2 id="order-heading" className="text-3xl font-extrabold tracking-tight">Chọn món. Chờ Fame giao.</h2></div><span className="rounded-full bg-[#fffaf2] px-4 py-2 text-xs font-bold text-[#85502e]">Bản demo · Miễn phí giao hàng 0₫</span></div>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Chọn món yêu thích', 'Thêm đồ uống vào giỏ, nhập số điện thoại và địa chỉ giao hàng.'],
              ['02', 'Chuyển khoản qua QR', 'Thanh toán đúng số tiền và nội dung hiển thị trên đơn, rồi báo đã chuyển khoản.'],
              ['03', 'Fame xác nhận & giao', 'Admin kiểm tra tiền nhận, xác nhận đơn và cập nhật tiến trình giao hàng.'],
            ].map(([number, title, copy]) => <li key={number} className="rounded-2xl border border-[#e0d0bc] bg-[#fffaf2] p-6"><span className="text-xs font-extrabold text-[#b94720]">{number}</span><h3 className="mb-2 mt-4 text-lg font-extrabold">{title}</h3><p className="text-sm leading-relaxed text-[#756457]">{copy}</p></li>)}
          </ol>
          <p className="mt-5 text-xs leading-relaxed text-[#756457]">Nút “Đã chuyển khoản” gửi yêu cầu kiểm tra. Thanh toán chỉ được xác nhận sau khi admin đối chiếu tiền nhận.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-8 sm:py-16 md:grid-cols-2">
        <div className="rounded-3xl bg-[#354c3c] p-7 text-[#fffaf2] sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d3e0cc]">Chưa biết chọn món nào?</p><h2 className="mt-3 text-2xl font-extrabold">Bắt đầu từ vị bạn thích.</h2><p className="mb-5 mt-3 text-sm leading-relaxed text-[#dce5d6]">Một vài lựa chọn về hương vị sẽ giúp Fame gợi ý món phù hợp. Bạn có thể vào menu và đặt món bất cứ lúc nào.</p><Link href="/check-in" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#90a18d] px-5 text-sm font-bold hover:bg-white/10">Tìm món cho bạn <span aria-hidden="true">→</span></Link></div>
        <div className="rounded-3xl border border-[#e1d3c1] bg-white p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#756457]">Energy Passport</p><h2 className="mt-3 text-2xl font-extrabold">Lưu lại những vị đã thử.</h2><p className="mb-5 mt-3 text-sm leading-relaxed text-[#756457]">Một nhật ký đồ uống nhỏ dành cho bạn. Passport là trải nghiệm tùy chọn, không cần đăng ký để đặt hàng.</p><Link href="/passport" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[#d7c9b9] px-5 text-sm font-bold text-[#493326] hover:bg-[#f2e7d8]">Mở Passport <span aria-hidden="true">→</span></Link></div>
      </section>
    </>
  )
}
