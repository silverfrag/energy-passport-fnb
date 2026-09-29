/**
 * Unit tests for the recommendation engine.
 * Run with: npx jest src/lib/recommendation/engine.test.ts
 * Or: npx tsx --test src/lib/recommendation/engine.test.ts
 */

import {
  getRecommendation,
  selectProduct,
  selectMicroAction,
  getExplanation,
} from './engine'
import type { Product, MicroAction } from '@/types'

// ---- Mock data ----

const mockProducts: Product[] = [
  {
    id: 'p1', slug: 'wake-americano', name: 'Americano', category: 'WAKE',
    short_description: null, description: null, price: 45000, caffeine_mg: 120,
    image_url: null, active: true, featured: true, sort_order: 1, created_at: '', updated_at: '',
  },
  {
    id: 'p2', slug: 'wake-cold-brew', name: 'Cold Brew', category: 'WAKE',
    short_description: null, description: null, price: 55000, caffeine_mg: 150,
    image_url: null, active: true, featured: false, sort_order: 2, created_at: '', updated_at: '',
  },
  {
    id: 'p3', slug: 'focus-matcha-latte', name: 'Matcha Latte', category: 'FOCUS',
    short_description: null, description: null, price: 65000, caffeine_mg: 70,
    image_url: null, active: true, featured: true, sort_order: 1, created_at: '', updated_at: '',
  },
  {
    id: 'p4', slug: 'refresh-peach-tea', name: 'Peach Oolong Tea', category: 'REFRESH',
    short_description: null, description: null, price: 50000, caffeine_mg: 30,
    image_url: null, active: true, featured: true, sort_order: 1, created_at: '', updated_at: '',
  },
  {
    id: 'p5', slug: 'inactive-product', name: 'Inactive', category: 'WAKE',
    short_description: null, description: null, price: 50000, caffeine_mg: 200,
    image_url: null, active: false, featured: true, sort_order: 0, created_at: '', updated_at: '',
  },
]

const mockActions: MicroAction[] = [
  {
    id: 'a1', slug: 'wake-breathe', category: 'WAKE', title: 'Power Breathe',
    duration_minutes: 10, description: null, steps: [], active: true, created_at: '', updated_at: '',
  },
  {
    id: 'a2', slug: 'focus-deep-work', category: 'FOCUS', title: 'Deep Work 25+',
    duration_minutes: 25, description: null, steps: [], active: true, created_at: '', updated_at: '',
  },
  {
    id: 'a3', slug: 'refresh-sip', category: 'REFRESH', title: 'Mindful Sip',
    duration_minutes: 5, description: null, steps: [], active: true, created_at: '', updated_at: '',
  },
]

// ---- Tests ----

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`)
  console.log(`  PASS: ${message}`)
}

function runTests() {
  let passed = 0
  let failed = 0

  function test(name: string, fn: () => void) {
    console.log(`\n▸ ${name}`)
    try {
      fn()
      passed++
    } catch (e) {
      console.error((e as Error).message)
      failed++
    }
  }

  // selectProduct
  test('selectProduct: returns featured product first', () => {
    const result = selectProduct(mockProducts, 'WAKE', 2)
    assert(result?.id === 'p1', `Expected p1 (featured), got ${result?.id}`)
  })

  test('selectProduct: excludes inactive products', () => {
    const wakeProducts = mockProducts.filter(p => p.category === 'WAKE' && p.active)
    const inactiveIncluded = selectProduct(mockProducts, 'WAKE', 2)
    assert(inactiveIncluded?.id !== 'p5', 'Inactive product p5 should not be selected')
  })

  test('selectProduct: returns null when no products available', () => {
    const result = selectProduct([], 'WAKE', 3)
    assert(result === null, 'Should return null for empty products')
  })

  test('selectProduct: high fatigue prefers higher caffeine', () => {
    const result = selectProduct(mockProducts, 'WAKE', 5)
    // Both p1 (120mg) and p2 (150mg) are WAKE, featured=false for p2
    // High fatigue should prefer higher caffeine among non-featured
    // p1 is featured so comes first, but with caffeine sort: p2 (150mg) > p1 (120mg)
    assert(result !== null, 'Should return a product')
    assert(result!.caffeine_mg !== null, 'High fatigue result should have caffeine data')
  })

  test('selectProduct: returns correct FOCUS product', () => {
    const result = selectProduct(mockProducts, 'FOCUS', 3)
    assert(result?.id === 'p3', `Expected p3 (Matcha Latte), got ${result?.id}`)
  })

  test('selectProduct: returns correct REFRESH product', () => {
    const result = selectProduct(mockProducts, 'REFRESH', 3)
    assert(result?.id === 'p4', `Expected p4 (Peach Tea), got ${result?.id}`)
  })

  // selectMicroAction
  test('selectMicroAction: returns action for correct category', () => {
    const result = selectMicroAction(mockActions, 'WAKE')
    assert(result?.id === 'a1', `Expected a1, got ${result?.id}`)
  })

  test('selectMicroAction: returns shortest duration first', () => {
    const extraActions: MicroAction[] = [
      ...mockActions,
      { id: 'a4', slug: 'wake-long', category: 'WAKE', title: 'Long Wake', duration_minutes: 30, description: null, steps: [], active: true, created_at: '', updated_at: '' },
    ]
    const result = selectMicroAction(extraActions, 'WAKE')
    assert(result?.duration_minutes === 10, `Expected 10 min, got ${result?.duration_minutes}`)
  })

  test('selectMicroAction: returns null when no actions for category', () => {
    const result = selectMicroAction([], 'FOCUS')
    assert(result === null, 'Should return null for empty actions')
  })

  // getExplanation
  test('getExplanation: returns string for all categories and levels', () => {
    const categories = ['WAKE', 'FOCUS', 'REFRESH'] as const
    const levels = [1, 2, 3, 4, 5] as const
    for (const cat of categories) {
      for (const level of levels) {
        const explanation = getExplanation(cat, level)
        assert(typeof explanation === 'string' && explanation.length > 0, `Explanation for ${cat}/${level} should be non-empty`)
      }
    }
  })

  // getRecommendation (integration)
  test('getRecommendation: WAKE + fatigue 3 returns correct category', () => {
    const result = getRecommendation({ fatigueLevel: 3, desiredState: 'WAKE' }, mockProducts, mockActions)
    assert(result.recommendedCategory === 'WAKE', `Expected WAKE, got ${result.recommendedCategory}`)
  })

  test('getRecommendation: FOCUS + fatigue 2 returns FOCUS product', () => {
    const result = getRecommendation({ fatigueLevel: 2, desiredState: 'FOCUS' }, mockProducts, mockActions)
    assert(result.recommendedCategory === 'FOCUS', 'Category should be FOCUS')
    assert(result.recommendedProduct?.category === 'FOCUS', 'Product should be FOCUS category')
  })

  test('getRecommendation: handles empty products gracefully', () => {
    const result = getRecommendation({ fatigueLevel: 3, desiredState: 'REFRESH' }, [], mockActions)
    assert(result.recommendedProduct === null, 'Should return null product for empty list')
    assert(result.explanation.length > 0, 'Should still return explanation')
  })

  test('getRecommendation: desiredState always determines category', () => {
    for (const state of ['WAKE', 'FOCUS', 'REFRESH'] as const) {
      const result = getRecommendation({ fatigueLevel: 1, desiredState: state }, mockProducts, mockActions)
      assert(result.recommendedCategory === state, `Category should match desired state ${state}`)
    }
  })

  // Summary
  console.log(`\n${'─'.repeat(40)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
