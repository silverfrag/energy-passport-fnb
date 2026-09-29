'use client'

import { useState } from 'react'
import { verifyAdminPasskey } from './customer-actions'
import FameDrinkLogo from '@/components/FameDrinkLogo'
import Link from 'next/link'
import { IconShield, IconSparkles } from '@/components/icons'

interface Props {
  userEmail?: string | null
}

export default function AdminUnlockCard({ userEmail }: Props) {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await verifyAdminPasskey(pin)
    setLoading(false)

    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        // Reload current page to unlock layout seamlessly
        window.location.reload()
      }, 400)
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="surface max-w-md w-full p-8 rounded-3xl border border-amber-400/30 space-y-6 shadow-2xl text-center fade-in">
        <div className="flex justify-center">
          <FameDrinkLogo size="lg" variant="full" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-3">
            <IconShield className="w-3.5 h-3.5" />
            <span>FAME DRINK • QUẢN TRỊ VIÊN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Đăng Nhập Quản Trị Quán
          </h2>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            Dành riêng cho Chủ quán và Quản lý vận hành. Nhập mã PIN trực tiếp để truy cập quản lý thực đơn, ưu đãi và số liệu mà không cần tạo tài khoản.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-[11px] font-mono uppercase text-muted block mb-1.5">
              Mã PIN Quản Trị Cửa Hàng
            </label>
            <input
              type="password"
              required
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold px-4 py-3 rounded-xl bg-stone-900 border border-white/20 text-white outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center font-mono">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-emerald-400 text-center font-mono">
              ✓ Xác thực thành công! Đang tải bảng điều khiển...
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold btn-full text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <span>Đang kiểm tra...</span>
            ) : (
              <>
                <IconSparkles className="w-4 h-4" />
                <span>Vào Trang Quản Trị →</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-400 font-mono">
          <Link
            href="/"
            className="hover:text-white underline"
          >
            ← Ra website
          </Link>
          <span className="text-[11px] text-white/40">
            Truy cập một chạm (PIN)
          </span>
        </div>
      </div>
    </div>
  )
}
