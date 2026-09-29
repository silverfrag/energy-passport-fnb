'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, DrinkCategory } from '@/types'

interface Props {
  product?: Product
  onSubmit: (prevState: { error?: string } | null, formData: FormData) => Promise<{ error?: string }>
  submitLabel?: string
}

const CATEGORIES: { value: DrinkCategory; label: string }[] = [
  { value: 'WAKE', label: 'WAKE — Cà phê & Năng lượng' },
  { value: 'FOCUS', label: 'FOCUS — Matcha & Tập trung' },
  { value: 'REFRESH', label: 'REFRESH — Trà trái cây & Thảo mộc' },
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

export default function ProductForm({ product, onSubmit, submitLabel = 'Lưu sản phẩm' }: Props) {
  const [state, action, isPending] = useActionState(onSubmit, null)

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle} htmlFor="product-name">Tên sản phẩm *</label>
          <input
            id="product-name"
            name="name"
            required
            defaultValue={product?.name}
            style={inputStyle}
            placeholder="VD: Americano"
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="product-slug">Slug (URL) *</label>
          <input
            id="product-slug"
            name="slug"
            required
            defaultValue={product?.slug}
            style={inputStyle}
            placeholder="wake-americano"
            readOnly={!!product}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
            Slug không thể thay đổi sau khi tạo (dùng cho QR)
          </p>
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="product-category">Danh mục *</label>
        <select
          id="product-category"
          name="category"
          required
          defaultValue={product?.category ?? 'WAKE'}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="product-short-desc">Mô tả ngắn</label>
        <input
          id="product-short-desc"
          name="short_description"
          defaultValue={product?.short_description ?? ''}
          style={inputStyle}
          placeholder="Một câu mô tả ngắn gọn"
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="product-desc">Mô tả đầy đủ</label>
        <textarea
          id="product-desc"
          name="description"
          defaultValue={product?.description ?? ''}
          style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
          placeholder="Mô tả chi tiết sản phẩm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label style={labelStyle} htmlFor="product-price">Giá (VNĐ)</label>
          <input
            id="product-price"
            name="price"
            type="number"
            defaultValue={product?.price ?? ''}
            style={inputStyle}
            placeholder="45000"
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="product-caffeine">Caffeine (mg)</label>
          <input
            id="product-caffeine"
            name="caffeine_mg"
            type="number"
            defaultValue={product?.caffeine_mg ?? ''}
            style={inputStyle}
            placeholder="Để trống nếu không có"
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="product-sort">Thứ tự sắp xếp</label>
          <input
            id="product-sort"
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="product-image">URL hình ảnh</label>
        <input
          id="product-image"
          name="image_url"
          type="url"
          defaultValue={product?.image_url ?? ''}
          style={inputStyle}
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="hidden"
            name="active"
            value="false"
          />
          <input
            type="checkbox"
            name="active"
            value="true"
            defaultChecked={product?.active ?? true}
            className="w-4 h-4"
          />
          <span style={{ color: 'var(--color-text)', fontSize: 14 }}>Đang hoạt động</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={product?.featured ?? false}
            className="w-4 h-4"
          />
          <span style={{ color: 'var(--color-text)', fontSize: 14 }}>Nổi bật (★)</span>
        </label>
      </div>

      {state?.error && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: 'rgba(255,70,70,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,70,70,0.3)' }}
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary-wake btn-full"
        id="product-submit-btn"
      >
        {isPending ? 'Đang lưu…' : submitLabel}
      </button>
    </form>
  )
}
