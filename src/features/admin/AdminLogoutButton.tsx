'use client'

import { useTransition } from 'react'
import { logoutAdminPasskey } from './customer-actions'

export default function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminPasskey()
      window.location.href = '/admin'
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors flex items-center gap-1.5"
      title="Khóa phiên làm việc quản trị"
    >
      <span>{isPending ? '…' : '🔒 Khóa'}</span>
    </button>
  )
}
