import type { DrinkCategory, Product, MicroAction, RecommendationInput, RecommendationResult } from '@/types'

// ============================================================
// RECOMMENDATION ENGINE — Deterministic, rule-based
// No AI/LLM. No randomness unless tie-breaking required.
// ============================================================

/**
 * Rules:
 * - desiredState always determines category
 * - fatigueLevel is used to select best-fit product within category
 *   and to craft the explanation
 *
 * fatigueLevel scale:
 *   1 = Very alert / energized
 *   2 = Slightly tired
 *   3 = Moderately tired
 *   4 = Quite tired
 *   5 = Exhausted
 */

const EXPLANATIONS: Record<DrinkCategory, Record<number, string>> = {
  WAKE: {
    1: 'Bạn đang khá tỉnh táo, một ly nhẹ sẽ giữ năng lượng ổn định suốt buổi.',
    2: 'Chút mệt mỏi? Một ly WAKE sẽ giúp bạn khởi động lại đúng lúc.',
    3: 'Đã đến lúc cần boost nhẹ — WAKE phù hợp với trạng thái của bạn lúc này.',
    4: 'Bạn đang khá mệt. Hãy để WAKE giúp bạn lấy lại năng lượng.',
    5: 'Mệt nhiều rồi — một ly đậm đà sẽ là khởi đầu tốt để bật dậy.',
  },
  FOCUS: {
    1: 'Trạng thái tốt để tập trung. FOCUS giúp bạn duy trì sự ổn định.',
    2: 'Cần giữ sự tỉnh táo lâu hơn? FOCUS chính là lựa chọn của bạn.',
    3: 'FOCUS cung cấp năng lượng vừa đủ để giữ bạn vào guồng công việc.',
    4: 'Hơi uể oải nhưng vẫn cần tập trung? FOCUS sẽ không làm bạn bị "cao" quá mức.',
    5: 'Dù mệt, bạn cần tập trung — hãy thử FOCUS và kết hợp một micro-action nhỏ.',
  },
  REFRESH: {
    1: 'Bạn tươi tắn rồi — REFRESH sẽ giữ bạn mát mẻ và dễ chịu.',
    2: 'Cần thoải mái hơn một chút? REFRESH là lựa chọn nhẹ nhàng hoàn hảo.',
    3: 'Muốn thư giãn một chút? Để REFRESH làm mới năng lượng của bạn.',
    4: 'Cần nghỉ ngơi và làm mới? REFRESH giúp bạn hạ nhiệt và tái tạo.',
    5: 'Bạn cần nghỉ ngơi thực sự. REFRESH nhẹ nhàng, không caffeine cao, phù hợp lúc này.',
  },
}

/**
 * Product selection priority within a category:
 * - Prefer featured products
 * - Then sort by sort_order ascending
 * - Only include active products
 * fatigueLevel can be used to prefer stronger/lighter options
 * via sort_order convention (lower sort_order = lighter / more default)
 */
function selectProduct(
  products: Product[],
  category: DrinkCategory,
  fatigueLevel: number
): Product | null {
  const candidates = products
    .filter((p) => p.category === category && p.active)
    .sort((a, b) => {
      // Featured products first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      // Then sort_order ascending
      return a.sort_order - b.sort_order
    })

  if (candidates.length === 0) return null

  // For high fatigue (4-5) prefer products with more caffeine (if data available)
  // Otherwise just return the first (most featured/sorted)
  if (fatigueLevel >= 4) {
    const withCaffeine = candidates.filter((p) => p.caffeine_mg !== null)
    if (withCaffeine.length > 0) {
      withCaffeine.sort((a, b) => (b.caffeine_mg ?? 0) - (a.caffeine_mg ?? 0))
      return withCaffeine[0]
    }
  }

  return candidates[0]
}

function selectMicroAction(
  actions: MicroAction[],
  category: DrinkCategory
): MicroAction | null {
  const candidates = actions
    .filter((a) => a.category === category && a.active)
    .sort((a, b) => a.duration_minutes - b.duration_minutes)
  return candidates[0] ?? null
}

function getExplanation(category: DrinkCategory, fatigueLevel: number): string {
  const level = Math.max(1, Math.min(5, fatigueLevel)) as 1 | 2 | 3 | 4 | 5
  return EXPLANATIONS[category][level]
}

/**
 * Main recommendation function.
 * Returns deterministic result based on input + available products/actions.
 */
export function getRecommendation(
  input: RecommendationInput,
  products: Product[],
  actions: MicroAction[]
): RecommendationResult {
  const { fatigueLevel, desiredState } = input
  const category = desiredState // desiredState IS the category

  const recommendedProduct = selectProduct(products, category, fatigueLevel)
  const microAction = selectMicroAction(actions, category)
  const explanation = getExplanation(category, fatigueLevel)

  return {
    recommendedCategory: category,
    recommendedProduct,
    microAction,
    explanation,
  }
}

// ============================================================
// UNIT-TESTABLE EXPORTS
// ============================================================

export { selectProduct, selectMicroAction, getExplanation }
