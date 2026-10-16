import Header from '@/components/Header'
import Link from 'next/link'
import FameDrinkLogo from '@/components/FameDrinkLogo'
import CartProvider from '@/features/orders/CartProvider'
import { FAME_FACEBOOK_URL } from '@/lib/constants/business'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="takeaway-site flex min-h-dvh w-full flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-[#35251c] focus:px-5 focus:py-3 focus:text-white">Đến nội dung chính</a>
        <Header />
        <main id="main-content" className="w-full flex-1">{children}</main>
        <footer className="mt-8 border-t border-[#e8ddcf] bg-[#f2e7d8]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <FameDrinkLogo size="lg" showLink />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#756457]">Cà phê, matcha và trà trái cây cho ngày của bạn. Chọn món online, Fame tiếp nhận và xác nhận đơn giao tận nơi.</p>
              <p className="mt-3 text-xs text-[#756457]">Fame chỉ nhận đơn giao hàng, không nhận tại quầy.</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-extrabold">Chọn món cùng Fame</p>
              <ul className="space-y-1 text-sm text-[#756457]">
                <li><Link href="/menu" className="inline-block py-2 hover:text-[#b94720]">Menu đồ uống</Link></li>
                <li><Link href="/checkout" className="inline-block py-2 hover:text-[#b94720]">Giỏ hàng của bạn</Link></li>
                <li><Link href="/passport" className="inline-block py-2 hover:text-[#b94720]">Passport · Nhật ký đồ uống</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-extrabold">Liên hệ & đặt món</p>
              <a href={FAME_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#c9b4a0] bg-[#fffaf2] px-4 text-sm font-bold hover:border-[#b94720] hover:text-[#b94720]">Fanpage Fame Drink <span aria-hidden="true">↗</span></a>
              <p className="mt-3 text-xs leading-relaxed text-[#756457]">Cũng có trên GrabFood và ShopeeFood. Nhắn fanpage để nhận đúng liên kết cửa hàng.</p>
            </div>
          </div>
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 border-t border-[#dfd0be] px-4 py-5 text-xs text-[#756457] sm:flex-row sm:px-8">
            <p>© 2026 Fame Drink</p>
            <p>Bản demo đặt món · Phí giao 0₫ · Xác nhận chuyển khoản thủ công</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}
