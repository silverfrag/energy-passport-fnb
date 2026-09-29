'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { DrinkCategory } from '@/types'
import {
  IconWake,
  IconFocus,
  IconRefresh,
  IconCompass,
  IconArrowRight,
  IconPassportCrest,
  IconCoffeeBean,
  IconLeaf,
  IconDroplet,
  IconSparkles,
} from '@/components/icons'
import Link from 'next/link'

type Step = 'vibe' | 'state' | 'curating'

const VIBE_PRESETS = [
  {
    battery: 20,
    emoji: '🥱',
    shortLabel: 'Mắt trĩu / Cần đánh thức',
    fatigueValue: 5,
    stateDefault: 'WAKE' as DrinkCategory,
    desc: 'Vừa thức khuya hoặc cạn pin, cần một cú hích caffeine đậm đà vực dậy tức thì.',
    color: '#E05A2B',
  },
  {
    battery: 40,
    emoji: '🧠',
    shortLabel: 'Mơ màng / Xao nhãng',
    fatigueValue: 4,
    stateDefault: 'FOCUS' as DrinkCategory,
    desc: 'Bắt đầu có dấu hiệu mất tập trung, đầu óc hơi uể oải cần một điểm tựa hương vị.',
    color: '#F4A261',
  },
  {
    battery: 60,
    emoji: '💻',
    shortLabel: 'Sẵn sàng vào guồng Deep Work',
    fatigueValue: 3,
    stateDefault: 'FOCUS' as DrinkCategory,
    desc: 'Năng lượng khá ổn, cần duy trì sự chú ý sâu 3-4 giờ liên tục mà không bị bồn chồn.',
    color: '#387B4E',
  },
  {
    battery: 80,
    emoji: '💆',
    shortLabel: 'Căng thẳng / Cần hạ nhiệt',
    fatigueValue: 2,
    stateDefault: 'REFRESH' as DrinkCategory,
    desc: 'Vừa xong cuộc họp áp lực, muốn tìm góc chill nhẹ nhàng xoa dịu vị giác.',
    color: '#3D8CA8',
  },
  {
    battery: 100,
    emoji: '⚡',
    shortLabel: 'Hứng khởi / Thử vị mới',
    fatigueValue: 1,
    stateDefault: 'WAKE' as DrinkCategory,
    desc: 'Tinh thần phấn chấn, sẵn sàng nếm thử những nốt hương đặc sản độc đáo.',
    color: '#D4AF37',
  },
]

const STATE_CARDS: {
  value: DrinkCategory
  icon: (props: { className?: string; color?: string }) => React.ReactElement
  title: string
  subtitle: string
  accentColor: string
  bgColor: string
  borderColor: string
  highlightIngredient: string
  tastingNote: string
  caffeineEstimate: string
  desc: string
}[] = [
  {
    value: 'WAKE',
    icon: IconWake,
    title: 'WAKE • Đánh Thức Năng Lượng',
    subtitle: 'Bứt phá tỉnh táo tức thì',
    accentColor: 'var(--color-wake)',
    bgColor: 'rgba(224,90,43,0.08)',
    borderColor: 'rgba(224,90,43,0.35)',
    highlightIngredient: 'Arabica Cầu Đất 1.600m',
    tastingNote: 'Socola đen · Hạt phỉ nướng · Crema dày',
    caffeineEstimate: '~120-150mg',
    desc: 'Chiết xuất espresso tươi hoặc Cold brew ủ lạnh 12h, kích hoạt ngay sự tỉnh táo và tập trung cao độ.',
  },
  {
    value: 'FOCUS',
    icon: IconFocus,
    title: 'FOCUS • Dòng Chảy Làm Việc Sâu',
    subtitle: 'Tập trung bền bỉ 4 giờ không crash',
    accentColor: 'var(--color-focus)',
    bgColor: 'rgba(56,123,78,0.08)',
    borderColor: 'rgba(56,123,78,0.35)',
    highlightIngredient: 'Ceremonial Matcha Uji Kyoto',
    tastingNote: 'Umami tròn trịa · Cỏ ngọt non · Sữa yến mạch',
    caffeineEstimate: '~70-110mg',
    desc: 'Bột trà matcha Uji đánh bằng Chasen thủ công giàu L-theanine tự nhiên, nuôi dưỡng tư duy sáng tạo êm ái.',
  },
  {
    value: 'REFRESH',
    icon: IconRefresh,
    title: 'REFRESH • Thư Giãn & Tái Tạo',
    subtitle: 'Thanh lọc vị giác, giải tỏa căng thẳng',
    accentColor: 'var(--color-refresh)',
    bgColor: 'rgba(61,140,168,0.08)',
    borderColor: 'rgba(61,140,168,0.35)',
    highlightIngredient: 'Trà Oolong Mộc Châu & Trái Cây Tươi',
    tastingNote: 'Đào mật thơm mát · Hoa mộc · Bọt khoáng sủi',
    caffeineEstimate: '0 - 30mg',
    desc: 'Hạ nhiệt tức thì với trà ủ lạnh phối trái cây tươi và nước khoáng có ga, xua tan bức bối mệt mỏi.',
  },
]

const FLAVOR_OPTIONS = [
  { id: 'bold', label: '☕ Đậm đà, thơm mộc mạc', icon: IconCoffeeBean },
  { id: 'creamy', label: '🥛 Béo êm dịu cùng sữa hạt', icon: IconLeaf },
  { id: 'fruity', label: '🍑 Chua ngọt trái cây sủi bọt', icon: IconDroplet },
]

export default function CheckInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedState = searchParams.get('state') as DrinkCategory | null

  const [step, setStep] = useState<Step>('vibe')
  // KHÔNG pick trước selection cho khách: khởi tạo null để khách tự do chọn
  const [selectedVibeIndex, setSelectedVibeIndex] = useState<number | null>(null)
  const [selectedState, setSelectedState] = useState<DrinkCategory | null>(preselectedState || null)
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)
  const [curatingTextIndex, setCuratingTextIndex] = useState<number>(0)

  // Contextual time-of-day greeting
  const [timeGreeting, setTimeGreeting] = useState<{ title: string; subtitle: string }>({
    title: 'Chào bạn tại Atelier',
    subtitle: 'Hãy cho Barista biết cơ thể bạn đang cần gì hôm nay.',
  })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 11) {
      setTimeGreeting({
        title: '🌅 Buổi Sáng Khởi Động',
        subtitle: 'Bắt đầu ngày mới với một tách đồ uống được thiết kế riêng cho nhịp sinh học của bạn.',
      })
    } else if (hour >= 11 && hour < 14) {
      setTimeGreeting({
        title: '☀️ Nạp Pin Giữa Ngày',
        subtitle: 'Một khoảng lặng êm ái giữa buổi trưa. Bạn cần bứt phá hay thư giãn?',
      })
    } else if (hour >= 14 && hour < 18) {
      setTimeGreeting({
        title: '🌇 Cơn Uể Oải Giờ Chiều?',
        subtitle: 'Để Barista phối một công thức tiếp thêm năng lượng cho chặng nước rút cuối ngày.',
      })
    } else {
      setTimeGreeting({
        title: '🌙 Thư Thái Buổi Tối',
        subtitle: 'Khoảnh khắc chậm lại. Xoa dịu tâm trí sau một ngày dài làm việc năng suất.',
      })
    }
  }, [])

  const currentVibe = selectedVibeIndex !== null ? VIBE_PRESETS[selectedVibeIndex] : null

  const handleVibeSelect = (index: number) => {
    setSelectedVibeIndex(index)
  }

  const handleNextToState = () => {
    if (selectedVibeIndex === null) return
    setStep('state')
  }

  const handleFinishCheckIn = () => {
    if (!selectedState) return

    setStep('curating')

    const texts = [
      'Đang đọc nhịp năng lượng & thời điểm sinh học...',
      'Barista đang cân đối tỷ lệ chiết xuất hạt Cầu Đất & Uji...',
      'Hoàn tất công thức gợi ý độc bản cho bạn!',
    ]

    let current = 0
    const interval = setInterval(() => {
      current++
      if (current < texts.length) {
        setCuratingTextIndex(current)
      } else {
        clearInterval(interval)
        const params = new URLSearchParams({
          fatigue: (currentVibe ? currentVibe.fatigueValue : 3).toString(),
          state: selectedState,
          ...(selectedFlavor ? { flavor: selectedFlavor } : {}),
        })
        router.push(`/recommendation?${params.toString()}`)
      }
    }, 450)
  }

  // =========================================================================
  // SCREEN: CURATING ANIMATION (DELIGHTFUL TRANSITION)
  // =========================================================================
  if (step === 'curating') {
    const curatingTexts = [
      'Đang đọc nhịp năng lượng & thời điểm sinh học...',
      'Barista đang cân đối tỷ lệ chiết xuất hạt Cầu Đất & Uji...',
      'Hoàn tất công thức gợi ý độc bản cho bạn!',
    ]

    return (
      <div className="w-full mx-auto max-w-md px-4 py-20 text-center fade-in space-y-8">
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-amber-400/40 animate-spin" style={{ animationDuration: '4s' }} />
          <div className="w-20 h-20 rounded-full bg-black/60 border border-amber-400/50 flex items-center justify-center shadow-2xl">
            <IconPassportCrest className="w-10 h-10 text-amber-400" color="#D4AF37" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-amber-400 font-mono">
            NGHI THỨC BARISTA PHỐI VỊ
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {curatingTexts[curatingTextIndex]}
          </h2>
          <p className="text-xs text-muted max-w-xs mx-auto">
            {currentVibe ? (
              <>Dựa trên trạng thái <strong className="text-amber-300 font-mono">Pin {currentVibe.battery}%</strong> và mục tiêu <strong className="text-white">{selectedState}</strong>.</>
            ) : (
              <>Dựa trên mục tiêu <strong className="text-white">{selectedState}</strong>.</>
            )}
          </p>
        </div>

        <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-300 rounded-full"
            style={{ width: `${((curatingTextIndex + 1) / 3) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  // =========================================================================
  // SCREEN: STEP 1 — VIBE & ENERGY BATTERY
  // =========================================================================
  if (step === 'vibe') {
    return (
      <div className="w-full mx-auto max-w-xl px-4 py-10 fade-in space-y-8">
        {/* Header with Barista Greeting */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300 font-mono">
            <IconSparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NGHI THỨC CHECK-IN NĂNG LƯỢNG • BƯỚC 1/2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {timeGreeting.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            {timeGreeting.subtitle}
          </p>
        </div>

        {/* Interactive Battery Gauge Box */}
        <div className="surface p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted font-mono">
              Pin Năng Lượng Sinh Học Lúc Này
            </span>
            <div className="flex items-center gap-2">
              {currentVibe ? (
                <>
                  <span
                    className="text-xl sm:text-2xl font-black font-mono transition-colors duration-300"
                    style={{ color: currentVibe.color }}
                  >
                    {currentVibe.battery}%
                  </span>
                  <span className="text-2xl">{currentVibe.emoji}</span>
                </>
              ) : (
                <span className="text-xs font-mono text-stone-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Chạm bên dưới để đo
                </span>
              )}
            </div>
          </div>

          {/* Visual Battery Bar */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-black/60 rounded-full p-1 border border-white/15 relative overflow-hidden flex items-center">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: currentVibe ? `${currentVibe.battery}%` : '0%',
                  background: currentVibe
                    ? `linear-gradient(90deg, #E05A2B 0%, #D4AF37 50%, #387B4E 100%)`
                    : 'transparent',
                  boxShadow: currentVibe ? `0 0 16px ${currentVibe.color}66` : 'none',
                }}
              />
              {!currentVibe && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-stone-500 font-mono tracking-wider">
                  Chưa ghi nhận mức pin
                </span>
              )}
            </div>
            <div className="flex justify-between text-[10px] text-muted font-mono">
              <span>0% Cạn kiệt</span>
              <span>50% Bình hòa</span>
              <span>100% Tràn đầy</span>
            </div>
          </div>

          {/* Preset Buttons Grid (Tất cả để trống, khách tự do click chọn) */}
          <div className="space-y-2 pt-2">
            <p className="text-[11px] text-stone-400 font-medium">
              Chạm chọn cảm giác cơ thể bạn đang phản ánh lúc này:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VIBE_PRESETS.map((item, idx) => {
                const isSelected = selectedVibeIndex === idx
                return (
                  <button
                    key={item.battery}
                    type="button"
                    onClick={() => handleVibeSelect(idx)}
                    className="p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3 group cursor-pointer"
                    style={{
                      background: isSelected ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.03)',
                      borderColor: isSelected ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.15)' : 'none',
                    }}
                  >
                    <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className="text-xs font-bold truncate group-hover:text-amber-300 transition-colors"
                          style={{ color: isSelected ? 'var(--color-gold)' : 'white' }}
                        >
                          {item.shortLabel}
                        </p>
                        <span className="text-[10px] font-mono text-muted ml-1 flex-shrink-0">
                          {item.battery}%
                        </span>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-1 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action bar: Chỉ kích hoạt khi khách ĐÃ CHỌN */}
          {currentVibe ? (
            <div
              className="p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between fade-in"
              style={{
                background: 'rgba(0,0,0,0.5)',
                borderColor: currentVibe.color,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentVibe.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-white">
                    Đã chọn: <span style={{ color: currentVibe.color }}>{currentVibe.shortLabel}</span>
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">
                    Gợi ý nhóm phù hợp: <strong className="text-white">{currentVibe.stateDefault}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextToState}
                className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-5 flex items-center gap-1.5 shadow-lg flex-shrink-0 cursor-pointer"
              >
                <span>Tiếp Tục</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-between text-stone-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">👆</span>
                <span>Vui lòng chạm chọn 1 trạng thái ở trên để tiếp tục</span>
              </div>
              <span className="text-[10px] font-mono uppercase text-stone-500">Chưa chọn</span>
            </div>
          )}
        </div>

        {/* Quick skip to full menu */}
        <div className="text-center">
          <Link
            href="/menu"
            className="text-xs text-muted hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>Hoặc xem trực tiếp toàn bộ menu quán</span>
            <IconArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  // =========================================================================
  // SCREEN: STEP 2 — DESIRED STATE & FLAVOR PREFERENCE
  // =========================================================================
  const canFinish = selectedState !== null

  return (
    <div className="w-full mx-auto max-w-xl px-4 py-10 fade-in space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300 font-mono">
          <IconCompass className="w-3.5 h-3.5 text-amber-400" />
          <span>BƯỚC 2/2 • CHỌN HƯỚNG NĂNG LƯỢNG & KHẨU VỊ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Bạn Muốn Cảm Thấy Thế Nào?
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
          {currentVibe ? (
            <>Cơ thể ghi nhận ở mức <strong className="text-amber-300 font-mono">Pin {currentVibe.battery}%</strong> ({currentVibe.shortLabel}). Hãy chạm chọn cảm xúc mà ly nước sẽ mang đến cho bạn:</>
          ) : (
            <>Hãy chạm chọn cảm xúc mà ly nước hôm nay sẽ mang đến cho bạn:</>
          )}
        </p>
      </div>

      {/* 3 Pillar Options: KHÔNG pre-select thẻ nào */}
      <div className="space-y-3.5">
        {STATE_CARDS.map((card) => {
          const isSelected = selectedState === card.value
          const isRecommendedForBattery = currentVibe && currentVibe.stateDefault === card.value
          const IconComp = card.icon

          return (
            <button
              key={card.value}
              id={`state-card-${card.value}`}
              type="button"
              onClick={() => setSelectedState(card.value)}
              className="w-full p-5 rounded-2xl border text-left transition-all duration-300 card-hover group relative overflow-hidden cursor-pointer"
              style={{
                background: isSelected ? card.bgColor : 'var(--color-surface)',
                borderColor: isSelected ? card.accentColor : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? `0 8px 30px ${card.borderColor}` : 'none',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    borderColor: isSelected ? card.accentColor : 'rgba(255,255,255,0.15)',
                    color: card.accentColor,
                  }}
                >
                  <IconComp className="w-6 h-6" color={card.accentColor} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black" style={{ color: card.accentColor }}>
                        {card.title}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                          ✓ Đã chọn
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isRecommendedForBattery && !isSelected && (
                        <span className="text-[10px] font-mono text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                          Gợi ý theo pin
                        </span>
                      )}
                      <span
                        className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(0,0,0,0.5)',
                          border: `1px solid ${card.borderColor}`,
                          color: card.accentColor,
                        }}
                      >
                        {card.caffeineEstimate}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-white mb-1.5">{card.subtitle}</p>
                  <p className="text-xs text-stone-300 leading-relaxed mb-3">{card.desc}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted pt-2 border-t border-white/10">
                    <span className="text-amber-200/90 font-medium">✨ {card.highlightIngredient}</span>
                    <span>·</span>
                    <span>{card.tastingNote}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Flavor Preference selector: Để trống, không pre-select */}
      <div className="surface p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted font-mono block">
            Gu Hương Vị Bạn Muốn (Tùy Chọn):
          </span>
          {selectedFlavor && (
            <button
              type="button"
              onClick={() => setSelectedFlavor(null)}
              className="text-[10px] text-stone-400 hover:text-white underline font-mono"
            >
              Bỏ chọn
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FLAVOR_OPTIONS.map((fl) => {
            const isSelected = selectedFlavor === fl.id
            return (
              <button
                key={fl.id}
                type="button"
                onClick={() => setSelectedFlavor(isSelected ? null : fl.id)}
                className="p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center gap-2 cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: isSelected ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)',
                  color: isSelected ? 'var(--color-gold)' : 'var(--color-text)',
                }}
              >
                <span>{fl.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep('vibe')}
          className="btn btn-ghost text-xs font-semibold uppercase tracking-wider py-3.5 px-6 border border-white/20 text-stone-400 hover:text-white cursor-pointer"
        >
          ← Chỉnh Pin Năng Lượng
        </button>

        <button
          type="button"
          onClick={canFinish ? handleFinishCheckIn : undefined}
          disabled={!canFinish}
          className={`flex-1 text-xs font-bold uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 rounded-full transition-all duration-300 ${
            canFinish
              ? 'btn btn-gold shadow-2xl cursor-pointer'
              : 'bg-white/10 text-stone-500 border border-white/10 cursor-not-allowed opacity-60'
          }`}
        >
          <IconSparkles className="w-4 h-4" />
          <span>{canFinish ? 'Tìm Thức Uống Dành Riêng Cho Tôi →' : 'Vui Lòng Chọn 1 Hướng Năng Lượng'}</span>
        </button>
      </div>
    </div>
  )
}
