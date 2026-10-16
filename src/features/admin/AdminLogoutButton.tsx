'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logoutAdminPasskey } from './customer-actions'
import { IconLock } from '@/components/icons'

export default function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminPasskey()
      router.replace('/admin')
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors flex items-center gap-1.5"
      title="Khóa phiên làm việc quản trị"
    >
      <IconLock className="w-3.5 h-3.5 text-rose-300" />
      <span>{isPending ? '…' : 'Khóa'}</span>
    </button>
  )
}
