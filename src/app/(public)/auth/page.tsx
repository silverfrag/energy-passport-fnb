import type { Metadata } from 'next'
import AuthForm from '@/features/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IconPassportCrest } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Liên Kết Sổ Ký Danh — Energy Passport',
  description: 'Liên kết email để lưu giữ vĩnh viễn Energy Passport và tích lũy đặc quyền.',
}

export default async function AuthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already logged in with permanent account — redirect to passport
  if (user && !user.is_anonymous) {
    redirect('/passport')
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12 fade-in">
      <div className="text-center mb-8 space-y-3">
        <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
          <IconPassportCrest className="w-8 h-8" color="#D4AF37" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400 font-mono block">
          OFFICIAL PASSPORT REGISTRATION
        </span>
        <h1 className="text-2xl font-black text-white">
          Lưu Sổ Ký Danh Passport
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          {user
            ? 'Liên kết email để bảo vệ lịch sử thưởng thức và giữ nguyên vẹn các con dấu Visa khi bạn đổi điện thoại.'
            : 'Đăng nhập để xem và quản lý sổ ký danh Energy Passport của bạn.'}
        </p>
      </div>

      <AuthForm />
    </div>
  )
}
