import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Fame Drink — Cà phê, Matcha & Trà trái cây giao tận nơi',
    template: '%s | Fame Drink',
  },
  description: 'Chọn cà phê, matcha và trà trái cây tại Fame Drink. Đặt đồ uống online, thanh toán chuyển khoản QR và theo dõi đơn giao tận nơi.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://energy-passport-fnb.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Fame Drink',
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
