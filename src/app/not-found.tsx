import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 text-center fade-in"
      style={{ background: 'var(--color-bg)' }}>
      <div className="text-5xl mb-4">🫗</div>
      <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
        Trang không tồn tại
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <div className="flex flex-col gap-3">
        <Link href="/" className="btn btn-primary-wake">
          Về trang chủ
        </Link>
        <Link href="/menu" className="btn btn-ghost text-sm">
          Xem menu đồ uống
        </Link>
      </div>
    </div>
  )
}
