import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import HomeHero from '@/components/HomeHero'
import HomeMotion from '@/components/HomeMotion'
import { getProductArt } from '@/lib/constants/product-art'
import { getAdminProductsList } from '@/lib/store/catalog-service'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import { FAME_FACEBOOK_URL } from '@/lib/constants/business'

export const metadata: Metadata = { alternates: { canonical: '/' } }
const featuredSlugs = ['ca-phe-sot-biscoff', 'matcha-latte', 'tra-dao-luu-do', 'tra-xoai-yakult']

export default async function HomePage() {
  const { products } = await getAdminProductsList().catch(() => ({ products: STANDARD_PRODUCTS }))
  const active = products.filter((product) => product.active)
  const featured = featuredSlugs.flatMap((slug) => active.find((product) => product.slug === slug) ?? []).concat(active.filter((product) => !featuredSlugs.includes(product.slug))).slice(0, 4)
  const biscoff = active.find((product) => product.slug === 'ca-phe-sot-biscoff')
  const matcha = active.find((product) => product.slug === 'matcha-latte')
  const money = (price: number | null) => price === null ? 'Liên hệ giá' : `${new Intl.NumberFormat('vi-VN').format(price)}₫`

  return <>
    <HomeMotion />
    <HomeHero products={featured} />

    <section className="fd-menu-section fd-shell" aria-labelledby="menu-heading">
      <div className="fd-home-menu-heading" data-home-reveal><h2 id="menu-heading">Hôm nay uống gì?</h2><nav className="fd-category-nav" aria-label="Chọn nhóm đồ uống">{[['ca-phe', 'Cà phê'], ['matcha', 'Matcha'], ['tra-trai-cay', 'Trà trái cây']].map(([id, name]) => <Link key={id} href={`/menu#${id}`}>{name}</Link>)}</nav></div>
      {featured.length ? <div className="fd-product-grid">{featured.map((product, index) => <ProductCard artMode="campaign" key={product.id} product={product} number={index + 1} />)}</div> : <p className="fd-empty">Menu đang cập nhật. Ghé lại sớm nhé.</p>}
      <Link href="/menu" className="fd-menu-all">Tất cả những vị bạn thích <span aria-hidden="true">↗</span></Link>
    </section>

    <section className="fd-spotlight-strip" id="flavours" aria-label="Matcha và Energy Passport">
      <div className="fd-section-wave" aria-hidden="true"><svg viewBox="0 0 1440 32" preserveAspectRatio="none"><path fill="currentColor" d="M0 0H1440V10C1320 42 1240-12 1120 13S920 39 800 13 600-10 480 14 280 39 160 13 40 5 0 20Z" /></svg></div>
      {matcha && <div className="fd-spotlight-matcha">
        <div className="fd-spotlight-copy" data-home-reveal><p className="fd-kicker">THE GREEN SIDE OF FAME</p><h2>MATCHA,<br />THEO GU BẠN.</h2><p>Vị trà xanh chát nhẹ.<br />Một chút sữa béo, một gu rất riêng.</p><strong>{money(matcha.price)}</strong><Link href={`/menu/${matcha.slug}`} className="fd-button">Xem món <span aria-hidden="true">→</span></Link></div>
        <div className="fd-spotlight-art"><span aria-hidden="true">MATCHA</span><Image src={getProductArt(matcha).src} alt={matcha.name} width={650} height={720} sizes="(min-width: 900px) 40vw, 50vw" unoptimized={!getProductArt(matcha).src.startsWith('/images/')} /></div>
      </div>}
      <div className="fd-spotlight-passport">
        <p className="fd-script">Energy<br />Passport</p>
        <div className="fd-passport-book-v5" aria-hidden="true"><b>FAME<br />DRINK</b><span>✳</span><small>ENERGY<br />PASSPORT</small></div>
        <div className="fd-spotlight-passport-copy" data-home-reveal><h2>Mỗi ly,<br />một dấu nhớ.</h2><p>Nhật ký cá nhân cho những vị đã thử.<br />Tùy chọn, không cần để đặt món.</p><Link href="/passport" className="fd-button">Mở Passport <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="fd-brand-story" aria-labelledby="story-heading">
      <div className="fd-story-top fd-shell" data-home-reveal><p className="fd-kicker">FIND YOUR OWN FLAVOUR</p><h2 id="story-heading">MỘT LY NGON.<br />NHIỀU CẢM HỨNG.</h2></div>
      <div className="fd-story-composition fd-shell">
        <div className="fd-story-note" data-home-reveal><span aria-hidden="true">↗</span><h3>Đậm. Êm. Hay tươi?</h3><p>Cà phê đậm đà, matcha béo nhẹ, trà trái cây chua ngọt. Cứ chọn theo cảm hứng hôm nay.</p><Link href="/check-in" className="fd-text-link">Để Fame gợi ý món ↗</Link></div>
        <div className="fd-story-object"><span aria-hidden="true">FAME</span>{biscoff && <Image src={getProductArt(biscoff).src} alt={biscoff.name} width={460} height={500} sizes="(min-width: 900px) 32vw, 65vw" unoptimized={!getProductArt(biscoff).src.startsWith('/images/')} />}</div>
        <div className="fd-story-note fd-story-note-right" data-home-reveal><h3>Vị quen, gu mới.</h3><p>Thử một kết hợp khác. Tìm một món quen. Và lưu lại những ly đã khiến ngày của bạn có vị hơn.</p><Link href="/menu" className="fd-text-link">Tìm vị của bạn ↗</Link></div>
      </div>
      <div className="fd-diagonal-ribbon" aria-hidden="true"><span>FAME DRINK</span><i>✳</i><span>ĐẬM VỊ. ĐÚNG GU.</span><i>✳</i><span>FAME DRINK</span></div>
    </section>

    <section className="fd-order-rail fd-shell" aria-labelledby="order-heading"><div className="fd-order-rail-title" data-home-reveal><p className="fd-kicker">FROM FAME, TO YOU.</p><h2 id="order-heading">CHỌN GU.<br /> FAME GIAO.</h2></div><ol>{[['01', 'Chọn món', 'Xem vị từng món, thêm vào giỏ.', '/menu'], ['02', 'Gửi lời nhắn', 'Nhập địa chỉ và yêu cầu riêng.', '/checkout'], ['03', 'Chờ Fame xác nhận', 'Chuyển khoản theo QR khi hệ thống nhận đơn; Fame kiểm tra tiền nhận và xác nhận giao.', '#contact']].map(([number, title, text, href]) => <li key={number}><Link href={href}><span>{number}</span><h3>{title} ↗</h3></Link><p>{text}</p></li>)}</ol><p className="fd-order-rail-note">Bản demo · Phí giao 0₫ · Xác nhận chuyển khoản thủ công. Trạng thái nhận đơn hiển thị tại giỏ hàng.</p></section>

    <section className="fd-contact-editorial" id="contact" aria-labelledby="contact-heading"><div className="fd-contact-editorial-inner fd-shell"><div className="fd-contact-rail" aria-hidden="true">SAY HELLO.</div><div className="fd-contact-editorial-title" data-home-reveal><p className="fd-kicker">KẾT NỐI VỚI FAME</p><h2 id="contact-heading">MỘT LY GÌ ĐÓ,<br /><em>cùng Fame?</em></h2><p>Hỏi món, gửi yêu cầu riêng<br />hoặc trao đổi về đơn giao hàng.</p></div><div className="fd-contact-channels" data-home-reveal><a href={FAME_FACEBOOK_URL} target="_blank" rel="noopener noreferrer"><span>01 / FANPAGE</span><h3>Nhắn Fame một chút.</h3><p>Trao đổi trực tiếp với cửa hàng.</p><b aria-hidden="true">↗</b></a><Link href="/menu"><span>02 / MENU ONLINE</span><h3>Tìm một vị bạn thích.</h3><p>Cà phê, matcha và trà trái cây.</p><b aria-hidden="true">↗</b></Link><div><span>03 / CŨNG CÓ TRÊN</span><h3>GrabFood · ShopeeFood</h3><p>Nhắn fanpage để nhận đúng liên kết cửa hàng. Fame chỉ nhận giao hàng, không nhận tại quầy.</p></div></div></div></section>
  </>
}
