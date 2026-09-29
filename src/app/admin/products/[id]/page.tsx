import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/features/admin/ProductForm'
import { updateProduct } from '@/features/admin/product-actions'
import { getAdminProduct } from '@/lib/store/catalog-service'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await getAdminProduct(id)

  if (!product) {
    notFound()
  }

  const updateWithId = updateProduct.bind(null, product.id || product.slug)

  return (
    <div className="max-w-2xl space-y-6 fade-in">
      <div>
        <Link
          href="/admin/products"
          className="text-xs text-muted hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 mb-3"
        >
          <span>← Quay lại Danh sách sản phẩm</span>
        </Link>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400 font-mono block">
          CHỈNH SỬA THỰC ĐƠN
        </span>
        <h1 className="text-2xl font-black text-white mt-1">
          {product.name}
        </h1>
        <p className="text-xs text-muted mt-1 font-mono">
          Slug: {product.slug} · Danh mục: {product.category}
        </p>
      </div>

      <div className="surface p-6 rounded-3xl border border-white/10 shadow-lg">
        <ProductForm product={product} onSubmit={updateWithId} submitLabel="Lưu Thay Đổi Món" />
      </div>
    </div>
  )
}
