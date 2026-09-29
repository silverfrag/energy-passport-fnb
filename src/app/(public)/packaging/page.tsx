import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import type { Product } from '@/types'
import PackagingClient from '@/features/packaging/PackagingClient'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Bao Bì & Mã QR Take-away — Energy Passport',
  description: 'Thiết kế bao bì chuyên biệt cho bán mang đi và giao hàng ship (Grab/ShopeeFood), tích hợp mã QR thông minh nạp dữ liệu Energy Passport.',
}

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (data && data.length > 0) {
      return data as Product[]
    }
  } catch {
    // fallback
  }

  return STANDARD_PRODUCTS
}

export default async function PackagingPage() {
  const products = await getProducts()
  
  // Resolve base URL
  let baseUrl = 'https://energy-passport-fnb.vercel.app'
  try {
    const headerList = await headers()
    const host = headerList.get('x-forwarded-host') || headerList.get('host')
    const proto = headerList.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
    if (host) {
      baseUrl = `${proto}://${host}`
    }
  } catch {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://energy-passport-fnb.vercel.app'
  }

  return <PackagingClient products={products} baseUrl={baseUrl} />
}
