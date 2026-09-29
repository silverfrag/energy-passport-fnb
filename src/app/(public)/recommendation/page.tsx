import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Product, MicroAction, DrinkCategory } from '@/types'
import { getRecommendation } from '@/lib/recommendation/engine'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import type { Metadata } from 'next'
import RecommendationClient from '@/features/recommendation/RecommendationClient'

import { STANDARD_PRODUCTS } from '@/lib/constants/products'

export const metadata: Metadata = {
  title: 'Gợi ý đồ uống — Fame Drink',
  description: 'Đồ uống được gợi ý dựa trên trạng thái của bạn tại Fame Drink.',
}

import { getAdminProductsList, getAdminActionsList } from '@/lib/store/catalog-service'
import { STANDARD_ACTIONS } from '@/lib/constants/actions'

interface PageProps {
  searchParams: Promise<{ fatigue?: string; state?: string }>
}

async function getProductsAndActions() {
  try {
    const [{ products }, { actions }] = await Promise.all([
      getAdminProductsList(),
      getAdminActionsList(),
    ])
    return {
      products: products.filter((p) => p.active),
      actions: actions.filter((a) => a.active),
    }
  } catch {
    return {
      products: STANDARD_PRODUCTS.filter((p) => p.active),
      actions: STANDARD_ACTIONS.filter((a) => a.active),
    }
  }
}

export default async function RecommendationPage({ searchParams }: PageProps) {
  const params = await searchParams
  const fatigueLevel = parseInt(params.fatigue ?? '3') as 1 | 2 | 3 | 4 | 5
  const desiredState = (params.state ?? 'WAKE') as DrinkCategory

  const { products, actions } = await getProductsAndActions()

  const result = getRecommendation(
    { fatigueLevel: Math.min(5, Math.max(1, fatigueLevel)) as 1 | 2 | 3 | 4 | 5, desiredState },
    products,
    actions
  )

  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-10"><div className="skeleton h-64 rounded-xl" /></div>}>
      <RecommendationClient result={result} />
    </Suspense>
  )
}
