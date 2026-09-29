import Link from 'next/link'
import Image from 'next/image'
import CategoryBadge from '@/components/CategoryBadge'
import { getAdminProductsList } from '@/lib/store/catalog-service'
import { handleSyncProducts } from '@/features/admin/product-actions'
import SyncCatalogBanner from '@/features/admin/SyncCatalogBanner'
import ProductRowActions from '@/features/admin/ProductRowActions'
import { IconCoffeeBean, IconCeremonialMatcha, IconDrink } from '@/components/icons'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const { products: allProducts, isDatabaseSource } = await getAdminProductsList()

  const activeCount = allProducts.filter((p) => p.active).length
  const featuredCount = allProducts.filter((p) => p.featured).length

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400 font-mono">
            FAME DRINK • THỰC ĐƠN & BẢNG GIÁ
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Quản Lý Mặt Hàng ({allProducts.length})
          </h1>
          <p className="text-xs text-muted mt-1">
            Kiểm soát danh mục WAKE, FOCUS, REFRESH, giá bán thực tế (20.000₫ – 40.000₫), hình ảnh và caffeine.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="btn btn-primary-wake py-2.5 px-5 font-bold rounded-xl flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg"
        >
          <span>+ Thêm Món Mới</span>
        </Link>
      </div>

      {/* Sync Status Banner */}
      <SyncCatalogBanner
        type="products"
        isDatabaseSource={isDatabaseSource}
        count={allProducts.length}
        onSync={handleSyncProducts}
      />

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Tổng sản phẩm</span>
          <p className="text-xl font-bold font-mono text-white mt-0.5">{allProducts.length}</p>
        </div>
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Đang mở bán</span>
          <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{activeCount}</p>
        </div>
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Tạm ngưng phục vụ</span>
          <p className="text-xl font-bold font-mono text-rose-400 mt-0.5">
            {allProducts.length - activeCount}
          </p>
        </div>
        <div className="surface p-3.5 rounded-xl border border-white/5">
          <span className="text-[11px] text-muted block">Món nổi bật (★)</span>
          <p className="text-xl font-bold font-mono text-amber-300 mt-0.5">{featuredCount}</p>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {allProducts.map((product) => {
          const formattedPrice = product.price
            ? `${new Intl.NumberFormat('vi-VN').format(product.price)}₫`
            : 'Chưa đặt giá'

          return (
            <div
              key={product.id || product.slug}
              className="surface flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 hover:border-amber-400/30 transition-all shadow-sm"
              style={{ opacity: product.active ? 1 : 0.6 }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden relative border border-white/10 flex items-center justify-center text-2xl font-bold"
                  style={{ background: 'var(--color-surface-2)' }}
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : product.category === 'WAKE' ? (
                    <IconCoffeeBean className="w-6 h-6 text-amber-500" />
                  ) : product.category === 'FOCUS' ? (
                    <IconCeremonialMatcha className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <IconDrink className="w-6 h-6 text-cyan-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <CategoryBadge category={product.category} showEmoji={false} />
                    {!product.active && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Tạm ẩn
                      </span>
                    )}
                    {product.featured && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ★ Nổi bật
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-white/40">
                      Thứ tự: {product.sort_order ?? 0}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white truncate">{product.name}</h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-0.5">
                    <span className="font-mono text-amber-400 font-bold">{formattedPrice}</span>
                    {product.caffeine_mg !== null && (
                      <span>· ~{product.caffeine_mg}mg caffeine</span>
                    )}
                    <span className="text-white/40 font-mono">· {product.slug}</span>
                  </div>

                  {product.short_description && (
                    <p className="text-xs text-white/60 line-clamp-1 mt-1 max-w-xl">
                      {product.short_description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 shrink-0">
                <ProductRowActions
                  id={product.id || product.slug}
                  slug={product.slug}
                  active={product.active}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
