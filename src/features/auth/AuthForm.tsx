'use client'

import { useState, useActionState } from 'react'
import { signInWithEmail, signInWithGoogle } from './actions'
import { IconMail } from '@/components/icons'

export default function AuthForm() {
  const [emailSent, setEmailSent] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const [state, emailAction, isPending] = useActionState(signInWithEmail, null)

  if (state?.success || emailSent) {
    return (
      <div className="fade-in text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg">
          <IconMail className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
          Kiểm tra email của bạn
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Chúng tôi đã gửi một link xác nhận. Nhấn vào link trong email để lưu Energy Passport.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Email form */}
      <form action={emailAction} className="flex flex-col gap-3 mb-6">
        <div>
          <label
            htmlFor="email-input"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Email
          </label>
          <input
            id="email-input"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-wake)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)' }}
          />
        </div>

        {state?.error && (
          <p className="text-sm" style={{ color: '#FF6B6B' }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary-wake btn-full"
          id="email-submit-btn"
        >
          {isPending ? (
            'Đang gửi…'
          ) : (
            <span className="inline-flex items-center justify-center gap-2">
              <IconMail className="w-4 h-4" />
              <span>Gửi link xác nhận</span>
            </span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>hoặc</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
      </div>

      {/* Google OAuth */}
      <form
        action={async () => { void signInWithGoogle() }}
        onSubmit={() => setGoogleLoading(true)}
      >
        <button
          type="submit"
          disabled={googleLoading}
          className="btn btn-ghost btn-full"
          id="google-signin-btn"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Đang chuyển hướng…' : 'Tiếp tục với Google'}
        </button>
      </form>

      <p
        className="text-xs mt-4 text-center"
        style={{ color: 'var(--color-text-dim)' }}
      >
        Lịch sử hiện tại của bạn sẽ được giữ nguyên sau khi liên kết.
      </p>
    </div>
  )
}
