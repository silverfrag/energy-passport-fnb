'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { DrinkCategory } from '@/types'
import { IconCoffeeBean, IconTeaLeaf, IconDroplet, IconArrowRight } from '@/components/icons'

const OPTIONS = [
  { value: 'WAKE' as DrinkCategory, label: 'Cà phê', description: 'Thích vị cà phê đậm đà, thơm béo.', icon: IconCoffeeBean },
  { value: 'FOCUS' as DrinkCategory, label: 'Matcha', description: 'Thích vị trà xanh kết hợp cùng sữa hoặc trái cây.', icon: IconTeaLeaf },
  { value: 'REFRESH' as DrinkCategory, label: 'Trà trái cây', description: 'Thích vị chua ngọt, dễ uống.', icon: IconDroplet },
]

export default function CheckInForm() {
  const router = useRouter()
  const params = useSearchParams()
  const initial = OPTIONS.find((option) => option.value === params.get('state'))?.value ?? null
  const [selected, setSelected] = useState<DrinkCategory | null>(initial)
  const [pending, setPending] = useState(false)

  function showSuggestion() {
    if (!selected || pending) return
    setPending(true)
    router.push('/recommendation?state=' + selected)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-16 space-y-7">
      <Link href="/menu" className="text-sm text-muted hover:underline">← Xem tất cả món</Link>
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ad431e]">Gợi ý món · Tùy chọn</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Hôm nay bạn thích vị gì?</h1>
        <p className="text-sm text-muted leading-relaxed">
          Chọn một nhóm để xem gợi ý từ menu Fame Drink. Bạn có thể xem menu và đặt món trực tiếp mà không cần bước này.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">Chọn nhóm đồ uống yêu thích</legend>
        {OPTIONS.map((option) => {
          const Icon = option.icon
          const active = selected === option.value
          return (
            <label key={option.value} className="flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition-colors"
              style={{ borderColor: active ? '#b94a24' : 'var(--color-border)', background: active ? '#fff0e4' : 'var(--color-surface)' }}>
              <input type="radio" name="drink-preference" value={option.value} checked={active}
                onChange={() => setSelected(option.value)} className="h-4 w-4 accent-[#b94a24] shrink-0" />
              <Icon className="w-6 h-6 text-[#ad431e] shrink-0" />
              <span>
                <span className="block font-bold">{option.label}</span>
                <span className="block text-sm text-muted mt-1">{option.description}</span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <button type="button" onClick={showSuggestion} disabled={!selected || pending}
        className="btn btn-gold btn-full disabled:opacity-50 disabled:cursor-not-allowed">
        {pending ? 'Đang tìm món…' : 'Xem món gợi ý'}
        {!pending && <IconArrowRight className="w-4 h-4" />}
      </button>
      <p className="text-sm text-muted">Chọn món online, Fame xác nhận và giao tận nơi. Bản demo đang miễn phí giao hàng.</p>
    </div>
  )
}
