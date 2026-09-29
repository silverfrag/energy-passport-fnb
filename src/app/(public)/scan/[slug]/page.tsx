import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ScanConfirmClient from '@/features/scan/ScanConfirmClient'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'

interface Props {
  params: Promise<{ slug: string }>
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', slug: 'wake-americano', name: 'Americano Double Shot', category: 'WAKE', short_description: 'Espresso Arabica Cầu Đất nguyên chất, vị đắng sạch thanh lịch, đánh thức tức thì.', description: null, price: 45000, caffeine_mg: 120, image_url: '/images/drinks/wake-cold-brew.jpg', active: true, featured: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', slug: 'wake-cold-brew', name: 'Cold Brew Ủ Lạnh 12H', category: 'WAKE', short_description: 'Ủ lạnh chậm 12-16 giờ ở 4°C, ngọt hậu tự nhiên không đường, êm ái cho dạ dày.', description: null, price: 55000, caffeine_mg: 150, image_url: '/images/drinks/wake-cold-brew.jpg', active: true, featured: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: '3', slug: 'focus-matcha-latte', name: 'Matcha Latte Ceremonial', category: 'FOCUS', short_description: 'Matcha Uji Kyoto đánh chổi tre thủ công cùng sữa yến mạch béo nhẹ, dồi dào L-theanine.', description: null, price: 65000, caffeine_mg: 70, image_url: '/images/drinks/focus-matcha-latte.jpg', active: true, featured: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '4', slug: 'focus-matcha-espresso', name: 'Matcha Espresso Layered Dirty', category: 'FOCUS', short_description: 'Sự giao thoa giữa vị chát umami thanh tao của matcha và độ nồng đượm của espresso.', description: null, price: 70000, caffeine_mg: 110, image_url: '/images/drinks/focus-matcha-latte.jpg', active: true, featured: false, sort_order: 2, created_at: '', updated_at: '' },
  { id: '5', slug: 'refresh-peach-tea', name: 'Peach Oolong Sparkling Tea', category: 'REFRESH', short_description: 'Trà Oolong Tứ Quý ủ lạnh ngâm đào tươi và bọt khoáng sủi sảng khoái.', description: null, price: 50000, caffeine_mg: 30, image_url: '/images/drinks/refresh-fruit-tea.jpg', active: true, featured: true, sort_order: 1, created_at: '', updated_at: '' },
  { id: '6', slug: 'refresh-lychee-mint', name: 'Lychee Mint Herbal Sparkler', category: 'REFRESH', short_description: 'Vải thiều ngọt dịu phối bạc hà tươi the mát và nước khoáng có ga thanh lọc vị giác.', description: null, price: 45000, caffeine_mg: null, image_url: '/images/drinks/refresh-fruit-tea.jpg', active: true, featured: false, sort_order: 2, created_at: '', updated_at: '' },
]

import { findStandardProduct } from '@/lib/constants/products'

async function getProduct(slug: string): Promise<{ product: Product | null; inactive: boolean }> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    const row = data as Product | null
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
