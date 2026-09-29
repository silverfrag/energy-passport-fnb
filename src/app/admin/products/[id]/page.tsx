import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductForm from '@/features/admin/ProductForm'
import { updateProduct } from '@/features/admin/product-actions'
import Link from 'next/link'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: productRaw } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  const product = productRaw as Product | null
  if (!product) notFound()

  const updateWithId = updateProduct.bind(null, id)

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="text-sm mb-6 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
        ← Danh sách sản phẩm
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: 'var(--color-text)' }}>
        Chỉnh sửa: {product.name}
      </h1>
      <ProductForm product={product} onSubmit={updateWithId} submitLabel="Cập nhật sản phẩm" />
    </div>
  )
}
