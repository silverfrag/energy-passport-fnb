import type { Metadata } from 'next'
import AuthForm from '@/features/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Đăng nhập Passport',
  description: 'Đăng nhập nhật ký đồ uống Fame Drink. Xem menu và đặt món không cần đăng nhập Passport.',
}

export default async function AuthPage() {
  let signedIn = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    signedIn = !!user && !user.is_anonymous
  } catch {
    // Keep the public page readable when authentication is unavailable.
  }

  if (signedIn) redirect('/passport')

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16 space-y-7">
      <Link href="/passport" className="text-sm text-muted hover:underline">← Về Passport</Link>
      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-[#ad431e]">Nhật ký đồ uống · Tùy chọn</p>
        <h1 className="text-3xl font-black">Đăng nhập Passport</h1>
        <p className="text-sm text-muted leading-relaxed">Dùng email hoặc Google để truy cập tài khoản Passport. Bạn vẫn có thể xem menu và đặt món mà không cần đăng nhập.</p>
      </div>
      <div className="surface p-5 sm:p-6 rounded-2xl border border-[var(--color-border)]">
        <AuthForm />
      </div>
      <Link href="/menu" className="btn btn-ghost btn-full">Tiếp tục xem menu</Link>
    </div>
  )
}
