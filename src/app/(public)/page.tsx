import Link from 'next/link'
import type { Metadata } from 'next'
import {
  IconWake,
  IconFocus,
  IconRefresh,
  IconPassport,
  IconScan,
  IconArrowRight,
  IconPassportCrest,
  IconCompass,
  IconClock,
  IconShield,
  IconCup,
  IconSparkles,
  IconCoffeeBean,
  IconCeremonialMatcha,
  IconArtisanCroissant,
  IconFocusWorkspace,
  IconStar,
  IconMapPin,
  IconPhone,
  IconWifi,
  IconCreditCard,
  IconSnowflake,
  IconParking,
  IconHeart,
  IconBolt,
} from '@/components/icons'
import { CATEGORY_DETAILS } from '@/lib/constants/drink-assets'

export const metadata: Metadata = {
  title: 'Fame Drink — Cà Phê Đặc Sản & Trà Năng Lượng | Energy Passport',
  description:
    'Fame Drink — Quán cà phê đặc sản & trà thủ công cao cấp tại 68 Nguyễn Huệ, Quận 1, Sài Gòn. Cà phê Arabica Cầu Đất 1.600m, Matcha Ceremonial Uji Kyoto, bánh nướng tươi mỗi sáng và tích lũy ưu đãi thông minh Energy Passport.',
}

const FEATURED_DRINKS = [
  {
    slug: 'wake-cold-brew',
    name: 'Cold Brew Ủ Lạnh 12H',
    category: 'WAKE' as const,
    categoryLabel: 'WAKE',
    price: '29.000₫',
    image: '/images/drinks/wake-cold-brew.jpg',
    badge: 'Best Seller',
    notes: 'Socola đen · Hạt phỉ nướng · Hậu ngọt êm',
    origin: 'Arabica Cầu Đất 1.600m',
    caffeine: '~150mg',
    desc: 'Ủ chậm lạnh 12-16 giờ ở 4°C, chiết xuất vị ngọt tự nhiên, êm dịu cho dạ dày.',
  },
  {
    slug: 'focus-matcha-latte',
    name: 'Matcha Latte Ceremonial',
    category: 'FOCUS' as const,
    categoryLabel: 'FOCUS',
    price: '35.000₫',
    image: '/images/drinks/focus-matcha-latte.jpg',
    badge: 'Nhập Khẩu',
    notes: 'Umami tròn · Cỏ ngọt non · Sữa yến mạch',
    origin: 'Uji, Kyoto, Nhật Bản',
    caffeine: '~70mg',
    desc: 'Bột matcha thượng hạng đánh bằng Chasen thủ công, giàu L-theanine cho làm việc tập trung sâu.',
  },
  {
    slug: 'refresh-peach-tea',
    name: 'Peach Oolong Sparkling',
    category: 'REFRESH' as const,
    categoryLabel: 'REFRESH',
    price: '28.000₫',
    image: '/images/drinks/refresh-fruit-tea.jpg',
    badge: 'Thanh Nhiệt',
    notes: 'Đào mật giòn · Hoa mộc · Bọt khoáng mát',
    origin: 'Oolong Tứ Quý Mộc Châu',
    caffeine: '~30mg',
    desc: 'Trà Oolong Mộc Châu ủ lạnh cùng đào tươi thái lát và nước khoáng có ga sảng khoái.',
  },
  {
    slug: 'wake-americano',
    name: 'Americano Double Shot',
    category: 'WAKE' as const,
    categoryLabel: 'WAKE',
    price: '25.000₫',
    image: '/images/drinks/wake-cold-brew.jpg',
    badge: 'Đặc Sản',
    notes: 'Cam Bergamot · Mật mía · Crema dày vàng',
    origin: 'Arabica Cầu Đất Rang Vừa',
    caffeine: '~120mg',
    desc: 'Double shot espresso đậm đà thanh khiết, đánh thức giác quan ngay trong ngụm đầu tiên.',
  },
  {
    slug: 'focus-matcha-espresso',
    name: 'Matcha Espresso Layered Dirty',
    category: 'FOCUS' as const,
    categoryLabel: 'FOCUS',
    price: '39.000₫',
    image: '/images/drinks/focus-matcha-latte.jpg',
    badge: 'Đặc Quyền',
    notes: 'Umami matcha · Espresso đậm đà · Sữa lạnh',
    origin: 'Uji Kyoto & Cầu Đất Blend',
    caffeine: '~110mg',
    desc: 'Sự giao thoa độc đáo giữa matcha Uji và espresso Cầu Đất, tối ưu cho phiên làm việc sáng tạo.',
  },
  {
    slug: 'refresh-lychee-mint',
    name: 'Lychee Mint Herbal Sparkler',
    category: 'REFRESH' as const,
    categoryLabel: 'REFRESH',
    price: '26.000₫',
    image: '/images/drinks/refresh-fruit-tea.jpg',
    badge: 'Không Caffeine',
    notes: 'Vải thiều mọng · Bạc hà the mát · Chanh tươi',
    origin: 'Trái Cây Nhiệt Đới Tươi',
    caffeine: '0mg',
    desc: 'Thanh lọc vị giác, làm dịu tâm trí sau giờ làm việc căng thẳng, không lo mất ngủ.',
  },
]

const PROMOTIONS = [
  {
    tag: 'COMBO BỮA SÁNG KHỞI ĐỘNG',
    title: 'Combo Morning Flow',
    price: '39.000₫',
    originalPrice: '49.000₫',
    image: '/images/combo-croissant.jpg',
    time: 'Áp dụng 07:00 — 11:00 mỗi sáng',
    desc: '01 Ly Cold Brew Ủ Lạnh 12H (hoặc Americano) + 01 Bánh Croissant bơ Pháp nướng nóng giòn tan.',
    badge: 'Tiết kiệm 10.000₫',
  },
  {
    tag: 'COMBO TẬP TRUNG SÂU 4H',
    title: 'Combo Deep Work Session',
    price: '45.000₫',
    originalPrice: '55.000₫',
    image: '/images/drinks/focus-matcha-latte.jpg',
    time: 'Phục vụ cả ngày tại Focus Lounge',
    desc: '01 Matcha Latte Ceremonial Uji Kyoto + 01 Bánh Financier hạt hạnh nhân nướng thủ công.',
    badge: 'Được yêu thích nhất',
  },
  {
    tag: 'ĐẶC QUYỀN GIỜ VÀNG',
    title: 'Happy Coffee Hour',
    price: 'Tặng thêm 1 Shot',
    originalPrice: 'Miễn phí',
    image: '/images/barista-craft.jpg',
    time: 'Mỗi ngày từ 07:00 — 09:00',
    desc: 'Tặng thêm 01 shot Espresso Arabica Cầu Đất tươi khi gọi bất kỳ món nhóm WAKE để bắt đầu ngày mới.',
    badge: 'Giờ vàng sáng',
  },
]

const STRENGTHS = [
  {
    icon: IconCoffeeBean,
    accentColor: '#D4AF37',
    badge: 'Arabica 1.600m',
    title: 'Hạt Arabica Cầu Đất 1.600m',
    desc: 'Thu hoạch quả chín thủ công tại Lâm Đồng, sơ chế ướt và rang mẻ nhỏ để giữ trọn nốt hoa quả thanh lịch.',
  },
  {
    icon: IconCeremonialMatcha,
    accentColor: '#387B4E',
    badge: 'Uji Kyoto Grade A',
    title: 'Matcha Ceremonial Grade Uji',
    desc: 'Nhập khẩu chính ngạch từ vùng Uji (Kyoto), đánh bằng chổi tre Chasen truyền thống giữ nguyên dưỡng chất L-theanine.',
  },
  {
    icon: IconArtisanCroissant,
    accentColor: '#E05A2B',
    badge: 'Bơ Pháp 06:30',
    title: 'Bánh Nướng Tươi Mỗi Ngày',
    desc: 'Croissant bơ Pháp nướng tại chỗ mỗi sáng lúc 06:30, thơm lừng giòn rụm kết hợp hoàn hảo cùng cà phê.',
  },
  {
    icon: IconFocusWorkspace,
    accentColor: '#3D8CA8',
    badge: 'Wifi 300Mbps',
    title: 'Không Gian Focus Tiêu Chuẩn',
    desc: 'Ghế ngồi công thái học, ổ cắm từng bàn, wifi cáp quang 300Mbps chuyên dụng cho làm việc và họp sáng tạo.',
  },
]

const REVIEWS = [
  {
    name: 'Hoàng Minh',
    role: 'Product Designer tại District 1',
    content:
      'Quán có không gian làm việc cực kỳ yên tĩnh và truyền cảm hứng. Cold Brew ở đây hậu vị thơm mộc, uống rất thanh và không hề cồn cào ruột.',
    stars: 5,
    tag: 'Khách quen 6 tháng',
  },
  {
    name: 'Thu Trang',
    role: 'Founder & Content Creator',
    content:
      'Matcha Latte Ceremonial ngon nhất Sài Gòn mình từng thử, thơm ngậy umami thật chứ không nồng mùi hương liệu. Quét mã QR trên ly đóng dấu Passport rất thú vị!',
    stars: 5,
    tag: 'Khách hàng VIP',
  },
  {
    name: 'Đức Thành',
    role: 'Software Engineer',
    content:
      'Wifi cực khỏe, bàn làm việc rộng rãi có đủ ổ cắm. Rất thích món Matcha Espresso Layered Dirty, vừa đủ tỉnh táo để code liên tục suốt buổi chiều.',
    stars: 5,
    tag: 'Thành viên thường xuyên',
  },
]

export default function HomePage() {
  return (
    <div className="w-full">
      {/* ================================================================
          SECTION 1: HERO — Immersive Commercial F&B Landing
          ================================================================ */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-bg.jpg"
          alt="Energy Passport Atelier – Specialty Coffee & Tea"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 w-full mx-auto max-w-6xl px-4 sm:px-8 py-24 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 mb-8 shadow-xl">
            <IconPassportCrest className="w-4 h-4 text-amber-400" color="#D4AF37" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-200/90 font-mono">
              FAME DRINK • SPECIALTY COFFEE & TEA • SÀI GÒN
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] mb-6 tracking-tight text-white drop-shadow-2xl">
            <span className="block font-serif italic font-normal text-amber-200/90 text-xl sm:text-3xl mb-3 tracking-[0.1em]">
              Nơi Hương Vị Đánh Thức Dòng Chảy Sáng Tạo
            </span>
            <span className="text-wake">WAKE</span>
            <span className="text-white/30 mx-2 sm:mx-3 font-light">·</span>
            <span className="text-focus">FOCUS</span>
            <span className="text-white/30 mx-2 sm:mx-3 font-light">·</span>
            <span className="text-refresh">REFRESH</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow">
            Cà phê Arabica Cầu Đất 1.600m, Matcha Ceremonial Grade Uji Kyoto và Trà Oolong Mộc Châu hữu cơ. Pha chế tươi theo đơn, phục vụ trong không gian yên tĩnh và tinh tế.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/menu"
              className="btn btn-gold text-sm tracking-wider uppercase font-bold flex items-center justify-center gap-2 shadow-2xl px-8 py-3.5"
              style={{ minWidth: 220 }}
            >
              <IconCup className="w-4 h-4" />
              <span>Xem Thực Đơn (Menu)</span>
            </Link>

            <a
              href="#promotions"
              className="btn btn-ghost text-sm tracking-wider uppercase font-semibold flex items-center justify-center gap-2 border border-white/30 text-white hover:border-amber-400/60 backdrop-blur-sm px-8 py-3.5"
              style={{ minWidth: 220 }}
            >
              <IconSparkles className="w-4 h-4 text-amber-400" />
              <span>Combo & Ưu Đãi</span>
            </a>
          </div>

          {/* Smart Ecosystem Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs text-stone-300">
            <IconCompass className="w-3.5 h-3.5 text-amber-400" />
            <span>Có dịch vụ</span>
            <Link href="/check-in" className="text-amber-300 font-bold hover:underline">
              Check-in Năng Lượng
            </Link>
            <span>& Mã QR trên mỗi ly vào</span>
            <Link href="/passport" className="text-amber-300 font-bold hover:underline">
              Sổ Ký Danh Passport
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-mono">Khám Phá Menu</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ================================================================
          SECTION 2: PROMOTIONS & COMBOS (SALES DRIVER)
          ================================================================ */}
      <section id="promotions" className="w-full px-4 sm:px-8 py-20 sm:py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
              ƯU ĐÃI & SET TRẢI NGHIỆM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 text-white">
              Khởi Đầu Ngày Mới Trọn Vẹn
            </h2>
            <p className="text-sm sm:text-base text-muted mt-3 max-w-xl mx-auto">
              Các combo kết hợp giữa cà phê đặc sản pha tươi và bánh nướng cao cấp — tiếp thêm năng lượng cho buổi sáng năng suất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMOTIONS.map((promo, idx) => (
              <div
                key={idx}
                className="surface card-hover overflow-hidden rounded-2xl border border-white/10 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 font-mono shadow-md">
                    {promo.badge}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-[10px] text-amber-200/90 font-mono tracking-wider uppercase">
                      ⏱ {promo.time}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono mb-1">
                    {promo.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {promo.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed mb-6 flex-1">
                    {promo.desc}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-amber-300 font-mono">
                        {promo.price}
                      </span>
                      {promo.originalPrice !== 'Miễn phí' && (
                        <span className="text-xs text-muted line-through ml-2 font-mono">
                          {promo.originalPrice}
                        </span>
                      )}
                    </div>
                    <Link
                      href="/menu"
                      className="text-xs font-bold uppercase tracking-wider text-white hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Gọi Món</span>
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: SIGNATURE DRINKS — Comprehensive Product Showcase
          ================================================================ */}
      <section className="w-full px-4 sm:px-8 py-20 sm:py-28 relative" style={{ background: 'var(--color-surface)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
                THỰC ĐƠN ĐẶC SẮC (SIGNATURE COLLECTION)
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 text-white">
                Bộ Sưu Tập Đồ Uống Tinh Tuyển
              </h2>
              <p className="text-sm text-muted mt-2 max-w-lg">
                Mỗi thức uống được tinh chỉnh tỉ mỉ về tỉ lệ hương vị và hàm lượng caffeine để đáp ứng chuẩn xác nhu cầu năng lượng của bạn.
              </p>
            </div>
            <Link
              href="/menu"
              className="text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors px-4 py-2 rounded-full border border-amber-400/30 hover:bg-amber-400/10"
            >
              <span>Xem Toàn Bộ Menu</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_DRINKS.map((drink) => {
              const catDetail = CATEGORY_DETAILS[drink.category]
              return (
                <Link key={drink.slug} href={`/menu/${drink.slug}`} className="block group">
                  <article className="h-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-surface-2)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/40 hover:shadow-2xl">
                    {/* Product Photo */}
                    <div className="relative h-64 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                      <span
                        className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase font-mono border"
                        style={{
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(8px)',
                          color: catDetail.color,
                          borderColor: catDetail.borderColor,
                        }}
                      >
                        {drink.categoryLabel}
                      </span>

                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 font-mono shadow-md">
                        {drink.badge}
                      </span>

                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] text-amber-200/90 font-mono tracking-wide">
                          📍 {drink.origin}
                        </span>
                        <span className="text-white/40">·</span>
                        <span className="text-[10px] text-stone-300 font-mono">
                          {drink.caffeine}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors mb-2">
                        {drink.name}
                      </h3>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted font-mono mb-0.5">
                          Nốt hương vị:
                        </p>
                        <p className="text-xs text-amber-100/90 font-medium">{drink.notes}</p>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed mb-4 flex-1">{drink.desc}</p>

                      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-muted">Đặt tại quầy</span>
                        <span className="text-lg font-black text-amber-300 font-mono">{drink.price}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4: THE CRAFT & SOURCING (NGHỆ THUẬT PHA CHẾ)
          ================================================================ */}
      <section className="w-full relative overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="order-2 lg:order-1">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
                NGHỆ THUẬT PHA CHẾ THỦ CÔNG
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-6 text-white leading-tight">
                Từng Giọt Cà Phê
                <br />
                <span className="font-serif italic font-normal text-amber-200/90">
                  Là Một Tác Phẩm Barista
                </span>
              </h2>
              <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
                <p>
                  Tại Fame Drink, chúng tôi không xem cà phê chỉ là chất kích thích nhanh — mà là một nghệ thuật ẩm thực tinh tế giúp nuôi dưỡng tâm trí minh mẫn.
                </p>
                <p>
                  Hạt Arabica Cầu Đất được thu hái ở độ cao 1.600m, tuyển chọn 100% trái chín đỏ, rang mẻ nhỏ thủ công theo từng tuần. Mỗi ly pour-over hay espresso đều được cân đo từng gram, kiểm soát nhiệt độ nước và thời gian chiết xuất chính xác đến từng giây.
                </p>
                <p>
                  Bạn có thể ngồi ngay trước Slow Bar để trò chuyện cùng các barista, lắng nghe câu chuyện về từng vùng trồng và tận hưởng hương thơm quyến rũ lan tỏa khắp không gian.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-black text-amber-400 font-mono">1.600m</span>
                  <p className="text-xs text-muted mt-1">Độ cao nông trại Cầu Đất</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-black text-amber-400 font-mono">100%</span>
                  <p className="text-xs text-muted mt-1">Matcha Uji & Sữa Yến Mạch</p>
                </div>
              </div>
            </div>

            {/* Photo Barista */}
            <div className="order-1 lg:order-2 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/barista-craft.jpg"
                alt="Barista brewing pour-over coffee at Energy Passport Atelier"
                className="w-full h-80 sm:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <IconShield className="w-4 h-4 text-amber-400" color="#D4AF37" />
                  <span className="font-medium">Pha chế tươi thủ công từng ly</span>
                </div>
                <span className="font-mono text-amber-300">V60 · Aeropress · Espresso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5: SPACE & ATMOSPHERE (KHÔNG GIAN ATELIER)
          ================================================================ */}
      <section className="w-full px-4 sm:px-8 py-20 sm:py-28" style={{ background: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
              KHÔNG GIAN & TRẢI NGHIỆM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 text-white">
              Nơi Làm Việc & Gặp Gỡ Lý Tưởng
            </h2>
            <p className="text-sm text-muted mt-3 max-w-xl mx-auto">
              Được thiết kế cân bằng giữa ánh sáng tự nhiên ấm áp, vật liệu gỗ mộc và âm nhạc lo-fi nhẹ nhàng — mang lại sự thư thái trọn vẹn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 group h-80 sm:h-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/cafe-lounge.jpg"
                alt="Focus Workspace at Energy Passport Atelier"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                  KHU VỰC 01
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">Focus Work Lounge</h4>
                <p className="text-xs text-stone-300 mt-1">
                  Bàn dài gỗ sồi, ổ cắm từng ghế, wifi cáp quang 300Mbps — yên tĩnh cho dân làm việc & sáng tạo.
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 group h-80 sm:h-96">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/atelier-interior.jpg"
                alt="Slow Bar and Social Patio"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                  KHU VỰC 02
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">Slow Bar & Garden Patio</h4>
                <p className="text-xs text-stone-300 mt-1">
                  Trò chuyện cùng barista, thưởng thức hương thơm hạt cà phê và không gian xanh thoáng mát.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STRENGTHS.map((s, i) => {
              const IconComp = s.icon
              return (
                <div
                  key={i}
                  className="surface p-6 rounded-2xl border border-white/10 text-center card-hover flex flex-col items-center justify-between group transition-all duration-300 hover:border-amber-400/40 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg"
                      style={{
                        background: `radial-gradient(circle, ${s.accentColor}25 0%, rgba(0,0,0,0.6) 100%)`,
                        border: `1px solid ${s.accentColor}40`,
                        boxShadow: `0 8px 24px ${s.accentColor}20`,
                      }}
                    >
                      <IconComp className="w-7 h-7" color={s.accentColor} />
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2.5"
                      style={{
                        color: s.accentColor,
                        background: `${s.accentColor}15`,
                        border: `1px solid ${s.accentColor}30`,
                      }}
                    >
                      {s.badge}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: SMART SERVICE ECOSYSTEM — ENERGY PASSPORT & QR
          ================================================================ */}
      <section className="w-full px-4 sm:px-8 py-20 sm:py-28" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="surface p-8 sm:p-12 rounded-3xl border border-amber-400/25 relative overflow-hidden shadow-2xl">
            {/* Ambient gold glow */}
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left explanation */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-xs font-semibold text-amber-300">
                  <IconPassportCrest className="w-4 h-4 text-amber-400" color="#D4AF37" />
                  <span>DỊCH VỤ ĐỘC QUYỀN XOAY QUANH QUÁN</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Mã QR Trên Mỗi Ly &
                  <br />
                  <span className="font-serif italic font-normal text-amber-200/90">
                    Sổ Ký Danh Energy Passport
                  </span>
                </h2>

                <p className="text-sm text-stone-300 leading-relaxed">
                  Khi đến quán, trên mỗi chiếc ly bạn nhận được sẽ có một mã QR dán riêng. Bạn chỉ cần bật camera điện thoại quét mã (không cần cài ứng dụng) để tự động ghi nhận hành trình năng lượng:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] font-black font-mono text-amber-400">01. CHECK-IN</span>
                    <h4 className="text-sm font-bold text-white mt-1">Chọn Trạng Thái</h4>
                    <p className="text-xs text-muted mt-0.5">Khảo sát 15s để nhận gợi ý món hợp thể trạng nhất.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] font-black font-mono text-amber-400">02. THƯỞNG THỨC</span>
                    <h4 className="text-sm font-bold text-white mt-1">Pha Tươi Tại Quầy</h4>
                    <p className="text-xs text-muted mt-0.5">Barista chế tác đúng chuẩn nồng độ caffeine.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] font-black font-mono text-amber-400">03. QUÉT QR</span>
                    <h4 className="text-sm font-bold text-white mt-1">Đóng Dấu Visa</h4>
                    <p className="text-xs text-muted mt-0.5">Tự động cộng dồn tem thưởng thức và theo dõi caffeine.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Link
                    href="/passport"
                    className="btn btn-gold text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 px-6 py-3"
                  >
                    <IconPassport className="w-4 h-4" />
                    <span>Xem Passport Của Bạn</span>
                  </Link>

                  <Link
                    href="/packaging"
                    className="btn btn-ghost text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 border border-white/20 text-white hover:border-amber-400/50 px-6 py-3"
                  >
                    <IconScan className="w-4 h-4 text-amber-400" />
                    <span>Bao Bì & Tạo Tem QR</span>
                  </Link>

                  <Link
                    href="/check-in"
                    className="btn btn-ghost text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 border border-white/20 text-white hover:border-amber-400/50 px-6 py-3"
                  >
                    <IconCompass className="w-4 h-4" />
                    <span>Thử Check-in</span>
                  </Link>
                </div>
              </div>

              {/* Right Passport Preview Card */}
              <div className="lg:col-span-5">
                <div className="passport-card p-6 rounded-2xl space-y-4 shadow-2xl relative border border-amber-400/30">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-400/20">
                    <div>
                      <p className="text-[10px] font-bold text-amber-300 tracking-widest uppercase font-mono">
                        ENERGY PASSPORT • SÀI GÒN
                      </p>
                      <p className="text-xs font-bold text-white">Sổ Ký Danh Điện Tử Của Bạn</p>
                    </div>
                    <IconPassportCrest className="w-7 h-7 text-amber-400" color="#D4AF37" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-400/20">
                      <p className="text-[10px] text-muted uppercase font-mono">Caffeine Hôm Nay</p>
                      <p className="text-xl font-black text-amber-300 font-mono mt-0.5">~185 mg</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-amber-400/20">
                      <p className="text-[10px] text-muted uppercase font-mono">Ưu Đãi Khách Quen</p>
                      <p className="text-sm font-bold text-emerald-400 mt-1">Đang Tích Lũy</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-wake" />
                        <span className="text-white font-medium">Cold Brew Cầu Đất</span>
                      </div>
                      <span className="text-amber-300/90 font-mono text-[11px]">08:30 · Đã đóng dấu ✓</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-black/60 border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-focus" />
                        <span className="text-white font-medium">Matcha Ceremonial Uji</span>
                      </div>
                      <span className="text-amber-300/90 font-mono text-[11px]">14:15 · Đã đóng dấu ✓</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
                    <p className="text-[11px] text-amber-200 font-mono flex items-center justify-center gap-1.5">
                      <IconSparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Hệ thống tự động tích lũy đặc quyền & ưu đãi tri ân khách quen Fame Drink</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 7: REVIEWS & SOCIAL PROOF
          ================================================================ */}
      <section className="w-full px-4 sm:px-8 py-20 sm:py-24" style={{ background: 'var(--color-surface)' }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
              KHÁCH HÀNG NÓI GÌ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 text-white">
              Được Yêu Thích Tại Sài Gòn
            </h2>
            <div className="flex items-center justify-center gap-2 mt-3 text-amber-400 text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, sIdx) => (
                  <IconStar key={sIdx} className="w-4 h-4" color="#D4AF37" fill="#D4AF37" />
                ))}
              </div>
              <span className="text-white font-bold ml-1 font-mono">4.9 / 5.0</span>
              <span className="text-muted text-xs">(Hơn 500+ lượt đánh giá trên Google)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="surface p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.stars }).map((_, sIdx) => (
                        <IconStar key={sIdx} className="w-3.5 h-3.5" color="#D4AF37" fill="#D4AF37" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-400">
                      {r.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-6 italic">
                    "{r.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white">{r.name}</h4>
                  <p className="text-[11px] text-muted">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 8: VISIT US & RESERVATION — Store Information
          ================================================================ */}
      <section className="w-full px-4 sm:px-8 py-20 sm:py-28 relative" style={{ background: 'var(--color-bg)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
            GHÉ THĂM CHÚNG TÔI
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-2 mb-4 text-white">
            Flagship Atelier Sài Gòn
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Hãy ghé thăm và trải nghiệm trực tiếp không gian cà phê đặc sản kết hợp khoa học năng lượng ngay trung tâm Quận 1.
          </p>

          <div className="surface p-8 rounded-3xl border border-white/10 text-left mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-3">
                <IconMapPin className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Địa Chỉ Atelier</h4>
              <p className="text-xs text-stone-300">68 Nguyễn Huệ, P. Bến Nghé</p>
              <p className="text-xs text-muted">Quận 1, TP. Hồ Chí Minh</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-3">
                <IconClock className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Giờ Hoạt Động</h4>
              <p className="text-xs text-stone-300">07:00 — 22:00 Mỗi ngày</p>
              <p className="text-xs text-muted">Bánh tươi nướng từ 06:30 sáng</p>
            </div>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-3">
                <IconPhone className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Hotline Barista</h4>
              <p className="text-xs text-amber-300 font-mono font-bold">1900 8826</p>
              <p className="text-xs text-muted">Giữ chỗ & Tư vấn hạt đặc sản</p>
            </div>
          </div>

          {/* Amenities Strip */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs text-stone-300 mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <IconParking className="w-3.5 h-3.5 text-amber-400" />
              <span>Chỗ Đậu Xe Miễn Phí</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <IconWifi className="w-3.5 h-3.5 text-amber-400" />
              <span>Wifi Cáp Quang 300Mbps</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <IconSnowflake className="w-3.5 h-3.5 text-cyan-400" />
              <span>Máy Lạnh Êm Dịu</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <IconCreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Thanh Toán Không Tiền Mặt</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <IconHeart className="w-3.5 h-3.5 text-rose-400" />
              <span>Thân Thiện Thú Cưng</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="btn btn-gold text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 px-8 py-3.5 shadow-2xl"
              style={{ minWidth: 220 }}
            >
              <IconCup className="w-4 h-4" />
              <span>Xem Toàn Bộ Thực Đơn</span>
            </Link>

            <Link
              href="/check-in"
              className="btn btn-ghost text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 text-white hover:border-amber-400/50 px-8 py-3.5"
              style={{ minWidth: 220 }}
            >
              <IconCompass className="w-4 h-4" />
              <span>Check-in Năng Lượng</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
