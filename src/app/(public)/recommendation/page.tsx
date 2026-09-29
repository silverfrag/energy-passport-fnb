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

const MOCK_ACTIONS: MicroAction[] = [
  { id: '1', slug: 'wake-10-power-breathe', category: 'WAKE', title: 'Power Breathe 10+', duration_minutes: 10, description: 'Kỹ thuật thở kích hoạt năng lượng trong 10 phút.', steps: [{ order: 1, text: 'Ngồi thẳng lưng.' }, { order: 2, text: 'Hít thật sâu 4 giây.' }, { order: 3, text: 'Nín thở 4 giây.' }, { order: 4, text: 'Thở ra mạnh 4 giây.' }, { order: 5, text: 'Lặp lại 10 lần.' }], active: true, created_at: '', updated_at: '' },
  { id: '2', slug: 'focus-25-deep-work', category: 'FOCUS', title: 'Deep Work 25+', duration_minutes: 25, description: 'Phiên làm việc tập trung 25 phút.', steps: [{ order: 1, text: 'Tắt thông báo.' }, { order: 2, text: 'Viết ra một nhiệm vụ.' }, { order: 3, text: 'Bắt đầu timer và làm việc.' }], active: true, created_at: '', updated_at: '' },
  { id: '3', slug: 'refresh-5-mindful-sip', category: 'REFRESH', title: 'Mindful Sip Break', duration_minutes: 5, description: 'Nghỉ ngơi có chủ đích 5 phút.', steps: [{ order: 1, text: 'Rời khỏi màn hình.' }, { order: 2, text: 'Uống từng ngụm chậm.' }, { order: 3, text: 'Nhìn ra cửa sổ 30 giây.' }], active: true, created_at: '', updated_at: '' },
]

interface PageProps {
  searchParams: Promise<{ fatigue?: string; state?: string }>
}

async function getProductsAndActions() {
  try {
    const supabase = await createClient()
    const [{ data: products }, { data: actions }] = await Promise.all([
      supabase.from('products').select('*').eq('active', true).order('sort_order'),
      supabase.from('micro_actions').select('*').eq('active', true).order('duration_minutes'),
    ])
    return {
      products: products && products.length > 0 ? products : STANDARD_PRODUCTS,
      actions: actions && actions.length > 0 ? actions : MOCK_ACTIONS,
    }
  } catch {
    return { products: STANDARD_PRODUCTS, actions: MOCK_ACTIONS }
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
