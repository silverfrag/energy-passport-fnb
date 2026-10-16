import type { Metadata } from 'next'
import { getAdminProductsList } from '@/lib/store/catalog-service'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import type { Product } from '@/types'
import PackagingClient from '@/features/packaging/PackagingClient'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Công cụ tạo tem QR — Dành cho nhân viên',
  description: 'Tạo mã QR theo món để khách tự ghi nhận ly đồ uống trong Passport.',
  robots: { index: false, follow: false },
}

async function getProducts(): Promise<Product[]> {
  try {
    const { products } = await getAdminProductsList()
    return products.filter((product) => product.active)
  } catch {
    // fallback
  }

  return STANDARD_PRODUCTS.filter((product) => product.active)
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
