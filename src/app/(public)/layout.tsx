import Header from '@/components/Header'
import Link from 'next/link'
import { IconPassportCrest, IconShield, IconClock } from '@/components/icons'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex flex-col w-full" style={{ background: 'var(--color-bg)' }}>
      <Header />
      <main className="flex-1 w-full">{children}</main>
      
      {/* Luxury F&B Editorial Footer */}
      <footer
        className="w-full mt-20 border-t border-white/10"
        style={{
          background: 'linear-gradient(180deg, rgba(13,12,10,0.8) 0%, rgba(8,7,6,0.98) 100%)',
        }}
      >
        <div className="w-full mx-auto max-w-6xl px-4 sm:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Atelier Crest & Mission */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <IconPassportCrest className="w-10 h-10 text-amber-400" color="#D4AF37" />
                <div>
                  <span className="font-serif text-lg tracking-[0.2em] font-black text-white">
                    ENERGY PASSPORT
                  </span>
                  <p className="text-[10px] tracking-widest uppercase text-muted">
                    Cognitive Beverage Atelier • Est. 2026
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed max-w-md">
                Chúng tôi định nghĩa lại trải nghiệm đồ uống thường nhật: kết hợp hương vị thủ công tuyển chọn cùng khoa học nhịp sinh học. Mỗi ly nước là một nguồn năng lượng chính xác — WAKE, FOCUS hay REFRESH.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-amber-400/80">
                <IconShield className="w-4 h-4 text-amber-400" color="#D4AF37" />
                <span>100% Cà phê Arabica Cầu Đất & Matcha Ceremonial Uji nhập khẩu</span>
              </div>
            </div>

            {/* Atelier Hours & Locations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Flagship Atelier
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                68 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh
              </p>
              <div className="flex items-center gap-1.5 text-xs text-white/80 pt-1">
                <IconClock className="w-3.5 h-3.5 text-wake" color="var(--color-wake)" />
                <span>07:00 — 22:00 (Mỗi ngày)</span>
              </div>
              <p className="text-[11px] text-muted pt-1">
                Hotline Barista: 1900 8826
              </p>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Trải Nghiệm
              </h4>
              <ul className="space-y-1.5 text-xs text-muted">
                <li>
                  <Link href="/check-in" className="hover:text-wake transition-colors">
                    Check-in Cảm Xúc & Nhu Cầu
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-focus transition-colors">
                    Thực Đơn Tinh Hoa (Menu)
                  </Link>
                </li>
                <li>
                  <Link href="/passport" className="hover:text-amber-400 transition-colors">
                    Sổ Ký Danh Energy Passport
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="hover:text-white transition-colors">
                    Liên Kết Thẻ Thành Viên
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Gold Filigree */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted">
            <p>
              Thông tin caffeine được chuẩn hóa theo mẻ chiết xuất thủ công.
            </p>
            <p className="tracking-wider uppercase font-mono text-[10px]">
              © 2026 ENERGY PASSPORT ATELIER • ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
