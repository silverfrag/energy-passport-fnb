import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Product } from '@/types'
import CategoryBadge from '@/components/CategoryBadge'
import { deleteProduct } from '@/features/admin/product-actions'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })

  const allProducts = (products ?? []) as Product[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>
          Sản phẩm ({allProducts.length})
        </h1>
        <Link href="/admin/products/new" className="btn btn-primary-wake" style={{ padding: '10px 18px' }}>
          + Thêm mới
        </Link>
      </div>

      {allProducts.length === 0 ? (
        <div className="surface p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
          Chưa có sản phẩm. Thêm sản phẩm đầu tiên.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="surface flex items-center gap-4 p-4"
              style={{ opacity: product.active ? 1 : 0.5 }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'var(--color-surface-2)' }}
              >
                {product.category === 'WAKE' ? '☕' : product.category === 'FOCUS' ? '🍵' : '🧃'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryBadge category={product.category} showEmoji={false} />
                  {!product.active && (
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,70,70,0.15)', color: '#FF6B6B' }}
                    >
                      Ẩn
                    </span>
                  )}
                  {product.featured && (
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255,200,70,0.15)', color: '#FFD700' }}
                    >
                      ★ Nổi bật
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                  {product.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                  {product.slug}
                  {product.caffeine_mg !== null && ` · ~${product.caffeine_mg}mg caffeine`}
                  {product.price && ` · ${new Intl.NumberFormat('vi-VN').format(product.price)}đ`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="btn btn-ghost text-xs"
                  style={{ padding: '8px 14px', minHeight: 36 }}
                >
                  Sửa
                </Link>
                <Link
                  href={`/menu/${product.slug}`}
                  className="text-xs"
                  style={{ color: 'var(--color-text-dim)' }}
                  target="_blank"
                >
                  Xem →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
