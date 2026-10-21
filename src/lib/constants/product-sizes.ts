export const PRODUCT_SIZES = ['S', 'M', 'L'] as const
export type ProductSize = (typeof PRODUCT_SIZES)[number]
export const DEFAULT_SIZE: ProductSize = 'M'

export function isProductSize(value: unknown): value is ProductSize {
  return value === 'S' || value === 'M' || value === 'L'
}

export function getSizePrice(base: number | null, size: ProductSize): number | null {
  if (base === null || !Number.isSafeInteger(base) || base <= 0 || base > 10_000_000 || !isProductSize(size)) return null
  const price = size === 'S' ? Math.max(1_000, base - 5_000) : size === 'L' ? base + 5_000 : base
  return price <= 10_000_000 ? price : null
}
