'use client'

import { useState, useActionState } from 'react'
import { signInWithEmail, signInWithGoogle } from './actions'
import { IconMail } from '@/components/icons'

export default function AuthForm() {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)
  const [state, emailAction, isPending] = useActionState(async (previous: { error?: string; success?: boolean } | null, formData: FormData) => {
    try {
      return await signInWithEmail(previous, formData)
    } catch {
      return { error: 'Chưa gửi được email. Bạn thử lại sau nhé.' }
    }
  }, null)

  async function handleGoogle() {
    setGoogleLoading(true)
    setGoogleError(null)
    try {
      const result = await signInWithGoogle()
      if (result?.error) setGoogleError('Chưa kết nối được với Google. Bạn thử đăng nhập bằng email nhé.')
    } catch {
      setGoogleError('Chưa kết nối được. Bạn thử lại nhé.')
    } finally {
      setGoogleLoading(false)
    }
  }

  if (state?.success) {
    return (
      <div className="text-center space-y-3" role="status">
        <IconMail className="w-9 h-9 text-[#ad431e] mx-auto" />
        <h2 className="text-xl font-bold">Kiểm tra email của bạn</h2>
        <p className="text-sm text-muted">Mở liên kết vừa gửi để đăng nhập Passport. Nếu chưa thấy email, bạn kiểm tra thêm thư mục thư rác nhé.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <form action={emailAction} className="space-y-3">
        <label htmlFor="email-input" className="block text-sm font-medium">Email</label>
        <input id="email-input" name="email" type="email" autoComplete="email" required placeholder="ban@example.com"
          className="w-full px-4 py-3 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-2)]" />
        {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={isPending} className="btn btn-gold btn-full" id="email-submit-btn">
          <IconMail className="w-4 h-4" />
          {isPending ? 'Đang gửi…' : 'Gửi liên kết đăng nhập'}
        </button>
      </form>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-[var(--color-border)]" />hoặc<span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>
      <button type="button" onClick={handleGoogle} disabled={googleLoading} className="btn btn-ghost btn-full" id="google-signin-btn">
        {googleLoading ? 'Đang kết nối…' : 'Tiếp tục với Google'}
      </button>
      {googleError && <p role="alert" className="text-sm text-red-700">{googleError}</p>}
      <p className="text-xs text-muted leading-relaxed">Nhật ký khách hiện được lưu trong trình duyệt này. Đăng nhập không tự chuyển các ghi nhận đó sang thiết bị khác.</p>
    </div>
  )
}
