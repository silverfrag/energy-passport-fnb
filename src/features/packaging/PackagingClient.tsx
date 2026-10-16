'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/types'
import QRCode from 'qrcode'
import Link from 'next/link'

interface Props { products: Product[]; baseUrl: string }

export default function PackagingClient({ products, baseUrl }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug || '')
  const [qr, setQr] = useState<{ url: string; dataUrl: string; svg: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const product = products.find((item) => item.slug === selectedSlug)
  const scanUrl = product ? baseUrl + '/scan/' + encodeURIComponent(product.slug) : ''
  const currentQr = qr?.url === scanUrl ? qr : null

  useEffect(() => {
    let cancelled = false
    if (!scanUrl) return
    const options = { margin: 4, errorCorrectionLevel: 'H' as const, color: { dark: '#20150f', light: '#ffffff' } }
    Promise.all([
      QRCode.toDataURL(scanUrl, { ...options, width: 600 }),
      QRCode.toString(scanUrl, { ...options, type: 'svg' }),
    ]).then(([dataUrl, svg]) => {
      if (!cancelled) { setQr({ url: scanUrl, dataUrl, svg }); setError(null) }
    }).catch(() => {
      if (!cancelled) setError('Chưa tạo được mã QR. Hãy thử chọn lại món.')
    })
    return () => { cancelled = true }
  }, [scanUrl])

  function downloadSvg() {
    if (!currentQr || !product) return
    const url = URL.createObjectURL(new Blob([currentQr.svg], { type: 'image/svg+xml' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'QR-' + product.slug + '.svg'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16 space-y-7">
      <div className="packaging-controls space-y-5">
        <Link href="/menu" className="text-sm text-muted hover:underline">← Khách mua hàng: về menu</Link>
        <div className="space-y-3">
          <p className="text-xs font-bold text-[#ad431e] uppercase tracking-widest">Công cụ dành cho nhân viên</p>
          <h1 className="text-3xl font-black">Tạo tem QR Passport</h1>
          <p className="text-sm text-muted leading-relaxed">
            Chọn món để tạo mã mở trang ghi nhận Passport. Mã này định danh món, không xác thực đơn hàng, thanh toán hoặc tính nguyên vẹn của bao bì.
          </p>
        </div>

        {products.length === 0 ? <p className="text-sm text-muted">Chưa có món đang bán để tạo tem.</p> : (
          <div className="surface rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
            <label htmlFor="packaging-product" className="block text-sm font-bold">Món trên tem</label>
            <select id="packaging-product" value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm">
              {products.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </select>
            <p className="text-xs text-muted break-all">{scanUrl}</p>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={!currentQr} onClick={downloadSvg} className="btn btn-gold text-sm">Tải mã QR SVG</button>
              <button type="button" disabled={!currentQr} onClick={() => window.print()} className="btn btn-ghost text-sm">In 12 tem trên A4</button>
              {product && <Link href={'/scan/' + product.slug} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-sm">Kiểm tra trang QR ↗</Link>}
            </div>
            <p className="text-xs text-muted">In thử ở tỷ lệ 100%, kiểm tra QR bằng điện thoại trước khi in hàng loạt. Giữ vùng trắng quanh mã.</p>
          </div>
        )}
      </div>

      {product && currentQr && (
        <div className="passport-label-sheet grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 text-[#2e2118]">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="passport-print-label rounded-xl border border-dashed border-stone-300 p-3 text-center flex flex-col items-center justify-between gap-1">
              <p className="font-black text-[10px] tracking-widest">FAME DRINK</p>
              <p className="text-xs font-semibold">{product.name}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentQr.dataUrl} alt={'QR Passport cho ' + product.name} className="w-24 h-24" />
              <p className="text-[9px]">Quét để tự ghi nhận ly vào Passport</p>
            </div>
          ))}
        </div>
      )}
      <style>{'@media print { @page { size: A4; margin: 12mm; } body * { visibility: hidden; } .passport-label-sheet, .passport-label-sheet * { visibility: visible; } .passport-label-sheet { position: absolute; top: 0; left: 0; width: 186mm; display: grid; grid-template-columns: repeat(3, 58mm); gap: 5mm; padding: 0; border: 0; } .passport-print-label { height: 60mm; break-inside: avoid; padding: 3mm; } .passport-print-label img { width: 32mm; height: 32mm; } }'}</style>
    </div>
  )
}
