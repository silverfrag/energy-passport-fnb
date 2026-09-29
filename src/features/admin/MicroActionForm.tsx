'use client'

import { useActionState } from 'react'
import type { MicroAction, DrinkCategory } from '@/types'

interface Props {
  action?: MicroAction
  onSubmit: (prevState: { error?: string } | null, formData: FormData) => Promise<{ error?: string }>
  submitLabel?: string
}

const CATEGORIES: { value: DrinkCategory; label: string }[] = [
  { value: 'WAKE', label: 'WAKE — Kích hoạt năng lượng' },
  { value: 'FOCUS', label: 'FOCUS — Tập trung sâu' },
  { value: 'REFRESH', label: 'REFRESH — Thư giãn làm mới' },
]

const inputStyle: React.CSSProperties = {
  background: 'var(--color-surface-2)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  marginBottom: '6px',
}

export default function MicroActionForm({ action, onSubmit, submitLabel = 'Lưu' }: Props) {
  const [state, formAction, isPending] = useActionState(onSubmit, null)

  const stepsText = action?.steps
    ? (action.steps as {order: number; text: string}[])
        .sort((a, b) => a.order - b.order)
        .map((s) => s.text)
        .join('\n')
    : ''

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle} htmlFor="action-title">Tiêu đề *</label>
          <input id="action-title" name="title" required defaultValue={action?.title} style={inputStyle} placeholder="Power Breathe 10+" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="action-slug">Slug *</label>
          <input id="action-slug" name="slug" required defaultValue={action?.slug} style={inputStyle} placeholder="wake-10-power-breathe" readOnly={!!action} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle} htmlFor="action-category">Danh mục *</label>
          <select id="action-category" name="category" required defaultValue={action?.category ?? 'WAKE'} style={{ ...inputStyle, cursor: 'pointer' }}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle} htmlFor="action-duration">Thời lượng (phút) *</label>
          <input id="action-duration" name="duration_minutes" type="number" min={1} required defaultValue={action?.duration_minutes ?? 10} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="action-desc">Mô tả</label>
        <input id="action-desc" name="description" defaultValue={action?.description ?? ''} style={inputStyle} placeholder="Mô tả ngắn về micro-action" />
      </div>

      <div>
        <label style={labelStyle} htmlFor="action-steps">
          Các bước (mỗi bước một dòng)
        </label>
        <textarea
          id="action-steps"
          name="steps"
          defaultValue={stepsText}
          style={{ ...inputStyle, minHeight: 150, resize: 'vertical', fontFamily: 'monospace' }}
          placeholder="Ngồi thẳng lưng.&#10;Hít thở sâu 4 giây.&#10;Lặp lại 10 lần."
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="active" value="true" defaultChecked={action?.active ?? true} className="w-4 h-4" />
          <span style={{ color: 'var(--color-text)', fontSize: 14 }}>Đang hoạt động</span>
        </label>
      </div>

      {state?.error && (
        <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(255,70,70,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,70,70,0.3)' }}>
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending} className="btn btn-primary-focus btn-full">
        {isPending ? 'Đang lưu…' : submitLabel}
      </button>
    </form>
  )
}
