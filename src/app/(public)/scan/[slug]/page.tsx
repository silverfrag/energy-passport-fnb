import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ScanConfirmClient from '@/features/scan/ScanConfirmClient'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

import { getAdminProduct } from '@/lib/store/catalog-service'
import { findStandardProduct } from '@/lib/constants/products'

async function getProduct(slug: string): Promise<{ product: Product | null; inactive: boolean }> {
  try {
    const row = await getAdminProduct(slug)
    if (row) {
      return { product: row.active ? row : null, inactive: !row.active }
    }
  } catch { /* fallback */ }

  const fallback = findStandardProduct(slug)
  if (fallback) return { product: fallback, inactive: !fallback.active }
  return { product: null, inactive: false }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { product } = await getProduct(slug)
  if (!product) return { title: 'Sản phẩm không tồn tại' }
  return { title: `Xác nhận: ${product.name}` }
}

export default async function ScanPage({ params }: Props) {
  const { slug } = await params
  const { product, inactive } = await getProduct(slug)

  // Check authenticated state
  let isAuthenticated = false
  let userEmail: string | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user && !user.is_anonymous) {
      isAuthenticated = true
      userEmail = user.email ?? null
    }
  } catch {
    // ignore
  }

  // Inactive product
  if (inactive) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center fade-in">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-black mb-2" style={{ color: 'var(--color-text)' }}>
          Sản phẩm không còn hoạt động
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Sản phẩm này hiện không có trong menu. Vui lòng chọn sản phẩm khác.
        </p>
        <Link href="/menu" className="btn btn-primary-wake">
          Xem menu →
        </Link>
      </div>
    )
  }

  // Not found
  if (!product) {
    notFound()
  }

  return (
    <ScanConfirmClient
      product={product}
      isAuthenticated={isAuthenticated}
      userEmail={userEmail}
    />
  )
}
