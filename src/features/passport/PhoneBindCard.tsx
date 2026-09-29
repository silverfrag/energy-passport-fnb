'use client'

import { useState } from 'react'
import { updatePhoneNumber } from './actions'
import { IconShield, IconCheck } from '@/components/icons'

interface Props {
  initialPhone?: string | null
}

export default function PhoneBindCard({ initialPhone }: Props) {
  const [phone, setPhone] = useState(initialPhone || '')
  const [isEditing, setIsEditing] = useState(!initialPhone)
  const [isDismissed, setIsDismissed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await updatePhoneNumber(phone)
    setLoading(false)

    if (res.success) {
      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(res.error || 'Có lỗi xảy ra, vui lòng thử lại.')
    }
  }

  // If dismissed and not editing, show a subtle one-line trigger
  if (isDismissed && !phone) {
    return (
      <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
        <span className="text-muted">Chưa lưu SĐT nhận diện ưu đãi</span>
        <button
          onClick={() => {
            setIsDismissed(false)
            setIsEditing(true)
          }}
          className="text-amber-400 font-bold hover:underline"
        >
          + Thêm SĐT
        </button>
      </div>
    )
  }

  // If already has phone and not editing
  if (phone && !isEditing) {
    // Mask phone e.g. 0908***456
    const masked = phone.length >= 8 
      ? phone.slice(0, 4) + '***' + phone.slice(-3) 
      : phone

    return (
      <div className="surface p-4 rounded-2xl border border-amber-400/20 bg-amber-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <IconShield className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
              SĐT NHẬN DIỆN ƯU ĐÃI FAME DRINK
            </p>
            <p className="text-xs text-white font-mono font-bold mt-0.5">
              {masked} <span className="text-emerald-400 font-normal text-[11px] ml-1">✓ Đã liên kết</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-muted hover:text-white underline font-mono text-[11px] px-2 py-1"
        >
          Đổi SĐT
        </button>
      </div>
    )
  }

  // Input Form
  return (
    <div className="surface p-5 rounded-2xl border border-amber-400/25 bg-amber-500/5 space-y-3.5 fade-in">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono block">
            NHẬN DIỆN ƯU ĐÃI TẠI QUẦY & ĐẶT SHIP
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Lưu Số Điện Thoại Của Bạn
          </h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          KHÔNG CẦN OTP
        </span>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        Để Barista nhận ra bạn khi ghé quán hoặc tự động ghi nhận ưu đãi tri ân khi bạn đặt hàng, hãy nhập số điện thoại:
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ví dụ: 0908 123 456"
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-white/15 text-white text-xs font-mono outline-none focus:border-amber-400 transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-5 shrink-0 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <IconCheck className="w-3.5 h-3.5" />
                <span>Lưu SĐT</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs text-emerald-400">
            ✓ Đã lưu thành công số điện thoại!
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] pt-1 text-muted">
          <span>Cam kết chỉ dùng để Barista đối chiếu ưu đãi, không gửi tin nhắn spam.</span>
          {!initialPhone && (
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-stone-400 hover:text-white underline ml-2 shrink-0"
            >
              Để sau
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
