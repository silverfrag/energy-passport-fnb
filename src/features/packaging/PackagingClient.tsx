'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import QRCode from 'qrcode'
import Link from 'next/link'
import { 
  IconScan, 
  IconShield, 
  IconPassportCrest, 
  IconArrowRight,
  IconPrinter
} from '@/components/icons'

interface Props {
  products: Product[]
  baseUrl: string
}

export default function PackagingClient({ products, baseUrl }: Props) {
  const [activeTab, setActiveTab] = useState<'design' | 'generator' | 'print'>('design')
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0] || {
    id: 'wake-cold-brew',
    slug: 'wake-cold-brew',
    name: 'Cold Brew Ủ Lạnh 12H',
    category: 'WAKE',
    short_description: 'Ủ lạnh chậm 12-16 giờ ở 4°C, ngọt hậu tự nhiên.',
    description: null,
    price: 55000,
    caffeine_mg: 150,
    image_url: '/images/drinks/wake-cold-brew.jpg',
    active: true,
    featured: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  })

  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [qrSvg, setQrSvg] = useState<string>('')
  const [printCount, setPrintCount] = useState<number>(12)
  const [stickerShape, setStickerShape] = useState<'round' | 'square'>('round')

  const scanUrl = `${baseUrl}/scan/${selectedProduct.slug}`

  // Generate QR Code
  useEffect(() => {
    let isMounted = true

    async function generateQRCodes() {
      try {
        const dataUrl = await QRCode.toDataURL(scanUrl, {
          width: 400,
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        })

        const svgString = await QRCode.toString(scanUrl, {
          type: 'svg',
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        })

        if (isMounted) {
          setQrDataUrl(dataUrl)
          setQrSvg(svgString)
        }
      } catch (err) {
        console.error('QR generation error:', err)
      }
    }

    generateQRCodes()
    return () => {
      isMounted = false
    }
  }, [scanUrl])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadSvg = () => {
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QR-${selectedProduct.slug}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full mx-auto max-w-6xl px-4 sm:px-8 py-10 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-xs font-semibold text-amber-300 font-mono uppercase tracking-widest">
          <IconScan className="w-4 h-4 text-amber-400" />
          <span>BAO BÌ & HỆ THỐNG MÃ QR TAKE-AWAY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Thiết Kế Bao Bì Chuyên Biệt
          <br />
          <span className="font-serif italic font-normal text-amber-200/90">
            Cho Giao Hàng & Mang Đi
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Giải pháp bao bì chuẩn công nghiệp F&B: Chống ngưng tụ hơi nước đá, khóa nắp chống tràn khi shipper di chuyển, tích hợp mã QR tương tác nạp thẳng dữ liệu vào Energy Passport của khách hàng.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-stone-900 border border-white/10 max-w-md mx-auto no-print">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'design'
              ? 'bg-amber-400 text-stone-950 shadow-lg'
              : 'text-muted hover:text-white'
          }`}
        >
          Thiết Kế Bao Bì
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'generator'
              ? 'bg-amber-400 text-stone-950 shadow-lg'
              : 'text-muted hover:text-white'
          }`}
        >
          Tạo Tem QR Trực Tiếp
        </button>
        <button
          onClick={() => setActiveTab('print')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'print'
              ? 'bg-amber-400 text-stone-950 shadow-lg'
              : 'text-muted hover:text-white'
          }`}
        >
          Khổ In Decal A4
        </button>
      </div>

      {/* ================================================================
          TAB 1: PACKAGING DESIGN SHOWCASE
          ================================================================ */}
      {activeTab === 'design' && (
        <div className="space-y-16 fade-in">
          {/* Main Visuals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Visual 1: Takeaway Cup */}
            <div className="surface rounded-3xl overflow-hidden border border-white/10 flex flex-col group shadow-2xl">
              <div className="relative h-80 sm:h-96 overflow-hidden bg-stone-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/packaging/takeaway-cup.jpg"
                  alt="Take-away coffee cup with QR insulated kraft sleeve"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 font-mono uppercase tracking-wider shadow-lg">
                  LY MANG ĐI (TAKE-AWAY)
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">
                    Ly Đen Mờ 2 Lớp + Cup Sleeve Giấy Kraft Ép Kim
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Vòng giấy cách nhiệt chống ướt, giữ mã QR luôn khô ráo và quét nét 100% trong mọi điều kiện thời tiết.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] font-mono text-amber-400 uppercase font-bold">Chất Liệu</p>
                    <p className="text-white font-medium mt-0.5">Giấy kraft tái chế 350gsm tráng màng mờ PE kép</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] font-mono text-amber-400 uppercase font-bold">Vị Trí Mã QR</p>
                    <p className="text-white font-medium mt-0.5">Mặt chính diện sleeve, kích thước chuẩn 32x32mm</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-muted">Dung tích hỗ trợ: 12oz (355ml) & 16oz (473ml)</span>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Tạo tem ly này</span>
                    <IconArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Visual 2: Delivery Kit */}
            <div className="surface rounded-3xl overflow-hidden border border-white/10 flex flex-col group shadow-2xl">
              <div className="relative h-80 sm:h-96 overflow-hidden bg-stone-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/packaging/delivery-kit.jpg"
                  alt="Delivery kit with kraft paper bag and cup carrier"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 font-mono uppercase tracking-wider shadow-lg">
                  BỘ GIAO HÀNG (DELIVERY & SHIP)
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">
                    Túi Giấy Niêm Phong + Khay Đỡ Định Vị 2 Ly
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Tem niêm phong an toàn chống tráo đổi khi shipper vận chuyển xe máy, kèm khay giấy ép chống nghiêng đổ.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] font-mono text-amber-400 uppercase font-bold">Khay Giữ Ly</p>
                    <p className="text-white font-medium mt-0.5">Bột giấy ép nguyên khối, có quai xách chịu lực 2kg</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <p className="text-[10px] font-mono text-amber-400 uppercase font-bold">Tem Niêm Phong</p>
                    <p className="text-white font-medium mt-0.5">Decal vỡ chống bóc, in mã QR xác thực khi nhận hàng</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-muted">Tối ưu cho GrabFood, ShopeeFood & Shipper riêng</span>
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Tạo tem niêm phong</span>
                    <IconArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Core Engineering Standards for Takeaway/Ship */}
          <div className="surface p-8 sm:p-10 rounded-3xl border border-white/10 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400 font-mono">
                QUY CHUẨN THI CÔNG BAO BÌ
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                3 Yếu Tố Quyết Định Thành Công Khi Bán Mang Đi & Ship
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="text-3xl">💧</div>
                <h3 className="text-base font-bold text-white">Chống Ngưng Tụ Hơi Nước</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Đồ uống đá tan thường làm ướt tem giấy thường khiến mã QR bị mờ nhòe. Bao bì Energy Passport sử dụng chất liệu <strong>decal nhựa PP chống nước</strong> hoặc <strong>sleeve tráng màng mờ</strong>, đảm bảo camera quét 1 chạm trong 0.2 giây.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="text-3xl">🛵</div>
                <h3 className="text-base font-bold text-white">Khóa Chống Đổ Tràn Cho Shipper</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Thiết kế nắp đậy kép với <strong>nút chặn silicon/giấy ép nhiệt</strong> ở lỗ uống. Khi shipper di chuyển qua gờ giảm tốc hay nghiêng túi, cà phê không bị bắn ra ngoài làm bẩn tem QR hay mất thẩm mỹ của khách.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="text-3xl">🎨</div>
                <h3 className="text-base font-bold text-white">Mã Hóa Màu Sắc Năng Lượng</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Phân biệt trực quan qua 3 viền màu: <strong>Cam (WAKE)</strong>, <strong>Xanh Lục (FOCUS)</strong>, <strong>Xanh Lam (REFRESH)</strong>. Giúp barista đóng gói không nhầm lẫn, shipper giao đúng món và khách hàng nhận diện tức thì.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          TAB 2: INTERACTIVE LIVE QR GENERATOR
          ================================================================ */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start fade-in">
          {/* Left: Controls */}
          <div className="lg:col-span-5 surface p-6 sm:p-7 rounded-3xl border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Cấu Hình Tem QR</h2>
              <p className="text-xs text-muted mt-1">
                Chọn món đồ uống để sinh mã QR vector nét căng tương ứng với URL quét thật của quán.
              </p>
            </div>

            {/* Select Product */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider font-mono">
                Chọn Sản Phẩm Trong Menu
              </label>
              <select
                value={selectedProduct.slug}
                onChange={(e) => {
                  const p = products.find((x) => x.slug === e.target.value)
                  if (p) setSelectedProduct(p)
                }}
                className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/15 text-white text-sm outline-none focus:border-amber-400 transition-colors"
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    [{p.category}] {p.name} — {p.caffeine_mg ? `~${p.caffeine_mg}mg` : '0mg'}
                  </option>
                ))}
              </select>
            </div>

            {/* Sticker Shape */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider font-mono">
                Kiểu Dáng Tem Nhãn
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStickerShape('round')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                    stickerShape === 'round'
                      ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                      : 'bg-stone-900 text-muted border-white/10 hover:text-white'
                  }`}
                >
                  Tem Tròn (Ø 45mm)
                </button>
                <button
                  type="button"
                  onClick={() => setStickerShape('square')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                    stickerShape === 'square'
                      ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                      : 'bg-stone-900 text-muted border-white/10 hover:text-white'
                  }`}
                >
                  Tem Vuông (45x45mm)
                </button>
              </div>
            </div>

            {/* Destination URL */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1 text-xs">
              <p className="text-[10px] text-muted uppercase font-mono">Đường Dẫn Quét Thật (Target URL)</p>
              <p className="font-mono text-amber-300 break-all select-all font-semibold">
                {scanUrl}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownloadSvg}
                className="btn btn-gold btn-full text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2"
              >
                <span>Tải File Vector SVG (Gửi Nhà In)</span>
              </button>

              <button
                onClick={() => setActiveTab('print')}
                className="btn btn-ghost btn-full text-xs font-bold uppercase tracking-wider py-3 border border-white/15 text-white hover:border-amber-400 flex items-center justify-center gap-2"
              >
                <span>Chuyển Sang Khổ In Decal A4</span>
              </button>

              <Link
                href={`/scan/${selectedProduct.slug}`}
                target="_blank"
                className="block text-center text-xs text-muted hover:text-amber-300 transition-colors pt-1"
              >
                Kiểm tra thử trang xác nhận của ly này ↗
              </Link>
            </div>
          </div>

          {/* Right: Live Preview Mockup */}
          <div className="lg:col-span-7 space-y-6">
            <div className="surface p-8 sm:p-10 rounded-3xl border border-white/10 text-center relative overflow-hidden shadow-2xl flex flex-col items-center">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono mb-6">
                MÔ PHỎNG TEM DÁN THỰC TẾ TRÊN LY / TÚI SHIP
              </span>

              {/* Physical Sticker Mockup */}
              <div
                className={`p-6 bg-[#1a1715] text-stone-100 shadow-2xl border-2 transition-all relative flex flex-col items-center justify-between w-72 sm:w-80 h-72 sm:h-80 ${
                  stickerShape === 'round'
                    ? 'rounded-full border-amber-400/40'
                    : 'rounded-3xl border-amber-400/40'
                }`}
                style={{
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(212,175,55,0.08)',
                }}
              >
                {/* Header of sticker */}
                <div className="text-center pt-2">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400">
                    <IconPassportCrest className="w-4 h-4" color="#D4AF37" />
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase font-mono">
                      FAME DRINK • PASSPORT
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-1 max-w-[200px] truncate">
                    {selectedProduct.name}
                  </h4>
                </div>

                {/* Center: The sharp QR Code */}
                <div className="p-2.5 bg-white rounded-xl shadow-md border border-stone-300">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="Scannable QR Code"
                      className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                    />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center text-stone-400 text-xs">
                      Đang tạo...
                    </div>
                  )}
                </div>

                {/* Footer of sticker */}
                <div className="text-center pb-2">
                  <p className="text-[9px] font-black tracking-widest uppercase text-amber-300 font-mono">
                    QUÉT CAMERA ĐỂ NẠP PASSPORT
                  </p>
                  <p className="text-[8px] text-stone-400 font-mono mt-0.5">
                    {selectedProduct.caffeine_mg !== null
                      ? `~${selectedProduct.caffeine_mg}mg Caffeine · Pha tươi thủ công`
                      : 'Thảo mộc thanh khiết · Tự nhiên'}
                  </p>
                </div>
              </div>

              {/* Instructions below mockup */}
              <div className="mt-8 flex items-center gap-4 text-xs text-muted max-w-md">
                <IconShield className="w-5 h-5 text-amber-400 shrink-0" color="#D4AF37" />
                <p className="text-left leading-relaxed">
                  Tem decal này có thể bóc dán trực tiếp lên: <strong>Thân ly giấy</strong>, <strong>Nắp đậy</strong>, hoặc <strong>Miệng túi giấy Kraft</strong> để shipper mang đi giao cho khách.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          TAB 3: PRINTABLE A4 DECAL SHEET
          ================================================================ */}
      {activeTab === 'print' && (
        <div className="space-y-6 fade-in">
          {/* Controls Bar (Hidden during print) */}
          <div className="surface p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted font-mono uppercase">Số lượng tem trên trang:</span>
              <select
                value={printCount}
                onChange={(e) => setPrintCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-stone-900 border border-white/15 text-white text-xs"
              >
                <option value={6}>6 Tem (Khổ lớn 70mm)</option>
                <option value={12}>12 Tem (Khổ chuẩn 50mm)</option>
                <option value={20}>20 Tem (Khổ vừa 40mm)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-6 shadow-xl flex items-center gap-2"
              >
                <IconPrinter className="w-4 h-4 text-stone-950" />
                <span>In Bảng Tem Ngay (Ctrl + P)</span>
              </button>
            </div>
          </div>

          {/* Printable Sheet Canvas */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white text-stone-900 shadow-2xl printable-sheet max-w-4xl mx-auto border border-stone-200">
            {/* Header of sheet */}
            <div className="text-center pb-6 border-b border-stone-300 mb-8">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-500 font-mono">
                FAME DRINK • ENERGY PASSPORT — OFFICIAL PACKAGING STAMP SHEET
              </p>
              <h3 className="text-xl font-black text-stone-900 mt-1">
                Bảng Tem Nhãn QR: {selectedProduct.name}
              </h3>
              <p className="text-xs text-stone-500 font-mono mt-0.5">
                Target: {scanUrl} · Khổ in A4 Tiêu Chuẩn (Decal Bóc Dán)
              </p>
            </div>

            {/* Sticker Grid */}
            <div className={`grid gap-6 ${
              printCount <= 6 
                ? 'grid-cols-2' 
                : printCount <= 12 
                ? 'grid-cols-3 sm:grid-cols-3' 
                : 'grid-cols-4 sm:grid-cols-4'
            }`}>
              {Array.from({ length: printCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 border border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-between text-center relative ${
                    stickerShape === 'round' ? 'rounded-full aspect-square p-4' : 'rounded-2xl aspect-square'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-700 font-mono block">
                      FAME DRINK • PASSPORT
                    </span>
                    <p className="text-[10px] font-bold text-stone-900 line-clamp-1 max-w-[120px]">
                      {selectedProduct.name}
                    </p>
                  </div>

                  <div className="p-1 bg-white rounded-lg shadow-sm border border-stone-200 my-1">
                    {qrDataUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="w-20 h-20 object-contain"
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-[7.5px] font-mono font-bold tracking-wider text-stone-700 block">
                      QUÉT ĐỂ NẠP PASSPORT
                    </span>
                    <span className="text-[7px] font-mono text-stone-500">
                      {selectedProduct.caffeine_mg ? `~${selectedProduct.caffeine_mg}mg` : 'Specialty'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer cut line instructions */}
            <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[9px] text-stone-400 font-mono">
              In trên giấy Decal A4 (bóc dán) hoặc giấy Kraft tự dính · Cắt theo đường viền nét đứt.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
