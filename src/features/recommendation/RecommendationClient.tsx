'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { RecommendationResult } from '@/types'
import CategoryBadge from '@/components/CategoryBadge'
import { getProductImage } from '@/lib/constants/drink-assets'
import { 
  IconWake, 
  IconFocus, 
  IconRefresh, 
  IconCheck, 
  IconScan, 
  IconTimer, 
  IconCompass, 
  IconArrowRight, 
  IconPassportCrest,
  IconShield,
  IconSparkles,
  IconCup,
  IconBolt,
  IconTeaLeaf
} from '@/components/icons'

interface Props {
  result: RecommendationResult
}

const CATEGORY_CONFIG = {
  WAKE: { primary: 'var(--color-wake)', light: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.3)', icon: IconWake, label: 'ĐÁNH THỨC NĂNG LƯỢNG' },
  FOCUS: { primary: 'var(--color-focus)', light: 'rgba(56,123,78,0.1)', border: 'rgba(56,123,78,0.3)', icon: IconFocus, label: 'DÒNG CHẢY LÀM VIỆC SÂU' },
  REFRESH: { primary: 'var(--color-refresh)', light: 'rgba(61,140,168,0.1)', border: 'rgba(61,140,168,0.3)', icon: IconRefresh, label: 'THƯ GIÃN & TÁI TẠO' },
}

export default function RecommendationClient({ result }: Props) {
  const [showAction, setShowAction] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const config = CATEGORY_CONFIG[result.recommendedCategory]
  const IconComponent = config.icon

  const productImage = result.recommendedProduct
    ? (result.recommendedProduct.image_url || getProductImage(result.recommendedProduct.slug, result.recommendedCategory))
    : getProductImage(null, result.recommendedCategory)

  const startTimer = () => {
    if (!result.microAction) return
    const totalSeconds = result.microAction.duration_minutes * 60
    setSecondsLeft(totalSeconds)
    setTimerActive(true)
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // =========================================================================
  // SCREEN: SOMATIC RITUAL / MICRO-ACTION TIMER
  // =========================================================================
  if (showAction && result.microAction) {
    return (
      <div className="w-full mx-auto max-w-md px-4 py-10 fade-in space-y-6">
        <button
          onClick={() => setShowAction(false)}
          className="text-xs font-semibold flex items-center gap-1.5 text-muted hover:text-white transition-colors uppercase font-mono tracking-wider"
        >
          ← Quay lại đơn kê đồ uống
        </button>

        <div className="text-center space-y-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border"
            style={{ background: config.light, borderColor: config.border, color: config.primary }}
          >
            <IconComponent className="w-7 h-7" color={config.primary} />
          </div>
          <div className="flex justify-center">
            <CategoryBadge category={result.recommendedCategory} showEmoji={false} />
          </div>
          <h1 className="text-2xl font-black text-white">
            {result.microAction.title}
          </h1>
          <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
            Nghi thức {result.microAction.duration_minutes} phút • {result.microAction.description}
          </p>
        </div>

        {/* Timer Card */}
        <div className="surface p-6 rounded-2xl border border-white/10 text-center shadow-xl">
          {timerActive ? (
            <div className="py-4 space-y-2">
              <div
                className="text-6xl font-black font-mono tracking-tight"
                style={{ color: config.primary }}
              >
                {formatTime(secondsLeft)}
              </div>
              <p className="text-xs text-muted font-mono animate-pulse">Đang đồng hành cùng chu kỳ tập trung…</p>
            </div>
          ) : secondsLeft === 0 && !timerActive ? (
            <div className="space-y-4 py-2">
              <p className="text-xs text-stone-300">
                Hãy nhấp một ngụm đồ uống đầu tiên, hít sâu hương thơm và bấm kích hoạt nghi thức:
              </p>
              <button
                onClick={startTimer}
                className="btn btn-gold btn-full text-xs font-bold uppercase tracking-wider py-3.5 shadow-xl flex items-center justify-center gap-2"
              >
                <IconTimer className="w-4 h-4" />
                <span>Bắt Đầu Nghi Thức {result.microAction.duration_minutes} Phút</span>
              </button>
            </div>
          ) : (
            <div className="py-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <IconCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Hoàn Thành Chu Kỳ!</h3>
              <p className="text-xs text-muted">Nhâm nhi thêm một ngụm để duy trì sự êm ái trọn vẹn.</p>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted font-mono">
            HƯỚNG DẪN THỰC HIỆN TỪNG BƯỚC
          </p>
          {(result.microAction.steps as { order: number; text: string }[])
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <div
                key={step.order}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/5 bg-surface"
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                  style={{ background: config.light, color: config.primary }}
                >
                  {step.order}
                </span>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
        </div>
      </div>
    )
  }

  // =========================================================================
  // SCREEN: BESPOKE ENERGY PRESCRIPTION (RECOMMENDED DRINK)
  // =========================================================================
  return (
    <div className="w-full mx-auto max-w-lg px-4 py-10 fade-in space-y-6">
      {/* Top Crest & Certificate Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300 font-mono">
          <IconPassportCrest className="w-3.5 h-3.5 text-amber-400" color="#D4AF37" />
          <span>ĐƠN KÊ NĂNG LƯỢNG ĐỘC BẢN • ATELIER ĐÀ NẴNG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Công Thức Hương Vị Dành Riêng Cho Bạn
        </h1>
        <p className="text-xs text-muted font-mono">
          Mục tiêu: <strong style={{ color: config.primary }}>{config.label}</strong>
        </p>
      </div>

      {/* Barista Somatic Explanation */}
      <div
        className="p-4 rounded-2xl border text-xs sm:text-sm text-stone-200 leading-relaxed relative"
        style={{ background: config.light, borderColor: config.border }}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl">☕</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono mb-0.5">
              Lời nhắn từ Barista:
            </p>
            <p className="italic text-stone-200">&ldquo;{result.explanation}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Recommended Product Hero Card */}
      {result.recommendedProduct ? (
        <article className="surface rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300">
          {/* Photo */}
          <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={productImage}
              alt={result.recommendedProduct.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3">
              <CategoryBadge category={result.recommendedCategory} showEmoji={false} />
            </div>

            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-amber-300 font-mono font-bold text-sm">
              {result.recommendedProduct.price
                ? `${new Intl.NumberFormat('vi-VN').format(result.recommendedProduct.price)}₫`
                : '55.000₫'}
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-amber-200/90 font-mono">
              <span className="inline-flex items-center gap-1.5">
                {result.recommendedProduct.caffeine_mg ? (
                  <>
                    <IconBolt className="w-3.5 h-3.5 text-amber-400" />
                    <span>~{result.recommendedProduct.caffeine_mg}mg caffeine</span>
                  </>
                ) : (
                  <>
                    <IconTeaLeaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Không caffeine</span>
                  </>
                )}
              </span>
              <span>Pha tươi tại quầy ✓</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">
                {result.recommendedProduct.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {result.recommendedProduct.short_description || result.recommendedProduct.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link
                href={`/menu/${result.recommendedProduct.slug}`}
                className="btn btn-gold btn-full text-xs font-bold uppercase tracking-wider py-3.5 shadow-xl flex items-center justify-center gap-2"
              >
                <IconCup className="w-4 h-4" />
                <span>Xem Chi Tiết Món & Đặt Tại Quầy</span>
              </Link>

              <Link
                href={`/scan/${result.recommendedProduct.slug}`}
                className="btn btn-ghost btn-full text-xs font-semibold uppercase tracking-wider text-stone-300 hover:text-white border border-white/15 flex items-center justify-center gap-2 py-3"
              >
                <IconScan className="w-4 h-4 text-amber-400" />
                <span>Đã Nhận Ly? Quét Mã QR Vào Passport</span>
              </Link>
            </div>
          </div>
        </article>
      ) : (
        <div className="surface p-6 rounded-2xl text-center border border-white/10 text-muted">
          <p>Chưa có sản phẩm phù hợp lúc này.</p>
        </div>
      )}

      {/* Bonus Micro Action Ritual Card */}
      {result.microAction && (
        <div
          className="surface p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 card-hover shadow-lg"
          style={{ background: config.light, borderColor: config.border }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-amber-400">
                Nghi thức đồng hành • {result.microAction.duration_minutes} phút
              </span>
            </div>
            <p className="font-bold text-sm text-white truncate">
              {result.microAction.title}
            </p>
            <p className="text-xs text-muted line-clamp-1 mt-0.5">
              {result.microAction.description}
            </p>
          </div>

          <button
            onClick={() => setShowAction(true)}
            className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex-shrink-0 flex items-center gap-1"
          >
            <span>Thực Hành</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-3 text-xs font-mono text-muted border-t border-white/10">
        <Link href="/check-in" className="hover:text-white transition-colors flex items-center gap-1">
          <span>← Check-in lại cảm giác khác</span>
        </Link>
        <Link href="/menu" className="hover:text-amber-300 transition-colors flex items-center gap-1">
          <span>Khám phá menu quán →</span>
        </Link>
      </div>
    </div>
  )
}
