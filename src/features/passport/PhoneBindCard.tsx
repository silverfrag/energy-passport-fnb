'use client'

import { useState } from 'react'
import { updatePhoneNumber } from './actions'

export default function PhoneBindCard({ initialPhone }: { initialPhone?: string | null }) {
  const [savedPhone, setSavedPhone] = useState(initialPhone || '')
  const [phone, setPhone] = useState(initialPhone || '')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const result = await updatePhoneNumber(phone)
      if (!result.success) {
        setError(result.error || 'Chưa lưu được số điện thoại. Bạn thử lại nhé.')
        return
      }
      setSavedPhone(phone)
      setEditing(false)
      setMessage('Đã lưu số điện thoại.')
    } catch {
      setError('Chưa kết nối được. Bạn thử lại nhé.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="surface rounded-2xl border border-[var(--color-border)] p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-sm">Số điện thoại trong Passport</h2>
          <p className="text-xs text-muted mt-1">Tùy chọn. Thông tin này chưa được xác minh bằng OTP.</p>
        </div>
        {!editing && <button type="button" onClick={() => { setEditing(true); setMessage(null) }}
          className="text-sm text-[#ad431e] font-bold shrink-0 hover:underline">{savedPhone ? 'Chỉnh sửa' : 'Thêm'}</button>}
      </div>
      {!editing && savedPhone && (
        <p className="text-sm font-semibold">{savedPhone.length >= 8 ? savedPhone.slice(0, 4) + '***' + savedPhone.slice(-3) : savedPhone}</p>
      )}
      {editing && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="passport-phone" className="text-sm text-muted block">Số điện thoại</label>
          <input id="passport-phone" type="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)}
            placeholder="0908 123 456" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-gold text-sm">{loading ? 'Đang lưu…' : 'Lưu số điện thoại'}</button>
            <button type="button" disabled={loading} onClick={() => { setPhone(savedPhone); setEditing(false); setError(null) }} className="btn btn-ghost text-sm">Hủy</button>
          </div>
        </form>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="text-sm text-green-800">{message}</p>}
    </section>
  )
}
