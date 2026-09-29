import ProductForm from '@/features/admin/ProductForm'
import { createProduct } from '@/features/admin/product-actions'
import Link from 'next/link'

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm mb-6 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
        ← Danh sách sản phẩm
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: 'var(--color-text)' }}>
        Thêm sản phẩm mới
      </h1>
      <ProductForm onSubmit={createProduct} submitLabel="Tạo sản phẩm" />
    </div>
  )
}
