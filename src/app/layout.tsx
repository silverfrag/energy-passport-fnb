import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Fame Drink — Energy Passport Atelier | WAKE · FOCUS · REFRESH',
    template: '%s | Fame Drink',
  },
  description: 'Fame Drink — Đồ uống đặc sản định hướng trạng thái năng lượng. Cà phê Arabica Cầu Đất, Matcha Ceremonial Uji và Trà Oolong cao sơn kết hợp sổ ký danh Energy Passport.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Fame Drink — Energy Passport Atelier',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
