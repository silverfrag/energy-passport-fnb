import './storefront.css'
import './storefront-motion.css'
import Header from '@/components/Header'
import Link from 'next/link'
import CartProvider from '@/features/orders/CartProvider'
import { FAME_FACEBOOK_URL } from '@/lib/constants/business'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="takeaway-site flex min-h-dvh w-full flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-[#35251c] focus:px-5 focus:py-3 focus:text-white">Đến nội dung chính</a>
        <Header />
        <main id="main-content" tabIndex={-1} className="w-full flex-1">{children}</main>
        <footer className="fd-footer">
          <div className="fd-footer-main fd-shell">
            <div><Link href="/" aria-label="Fame Drink — trang chủ" className="fd-wordmark">FAME<br />DRINK</Link><p>Cà phê, matcha và trà trái cây.<br />Một chút ngon lành cho ngày của bạn.</p><p className="mt-4">Chọn món online. Fame tiếp nhận<br />và xác nhận đơn giao tận nơi.</p></div>
            <div><h2>KHÁM PHÁ FAME</h2><ul><li><Link href="/menu">Menu đồ uống ↗</Link></li><li><Link href="/checkout">Giỏ hàng của bạn ↗</Link></li><li><Link href="/check-in">Gợi ý chọn món ↗</Link></li><li><Link href="/passport">Energy Passport ↗</Link></li></ul></div>
            <div><h2>LET’S HAVE A DRINK.</h2><a href={FAME_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Nhắn fanpage Fame Drink ↗</a><p className="mt-3">Fame chỉ nhận đơn giao hàng,<br />không nhận tại quầy.</p><p className="mt-3">GrabFood / ShopeeFood<br />Nhắn fanpage để lấy đúng liên kết.</p></div>
          </div>
          <div className="fd-footer-word" aria-hidden="true">FAME DRINK.</div>
          <div className="fd-footer-bottom fd-shell"><p>© 2026 Fame Drink · Đậm vị. Đúng gu.</p><p>Bản demo đặt món · Phí giao 0₫ · Xác nhận chuyển khoản thủ công</p></div>
        </footer>

      </div>
    </CartProvider>
  )
}
