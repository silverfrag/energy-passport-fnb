'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { DrinkCategory } from '@/types'
import {
  saveAdminProduct,
  deleteOrToggleAdminProduct,
  syncProductsToSupabase,
} from '@/lib/store/catalog-service'

export async function createProduct(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const slug = formData.get('slug')?.toString().trim().toLowerCase().replace(/\s+/g, '-')
  const name = formData.get('name')?.toString().trim()
  const category = formData.get('category')?.toString() as DrinkCategory
  const shortDescription = formData.get('short_description')?.toString()
  const description = formData.get('description')?.toString()
  const price = parseFloat(formData.get('price')?.toString() ?? '0')
  const caffeineMg = formData.get('caffeine_mg')?.toString()
  const imageUrl = formData.get('image_url')?.toString()
  const active = formData.get('active') === 'true'
  const featured = formData.get('featured') === 'true'
  const sortOrder = parseInt(formData.get('sort_order')?.toString() ?? '0')

  if (!slug || !name || !category) {
    return { error: 'Slug, tên và danh mục là bắt buộc.' }
  }

  const result = await saveAdminProduct({
    slug,
    name,
    category,
    short_description: shortDescription || null,
    description: description || null,
    price: isNaN(price) ? null : price,
    caffeine_mg: caffeineMg ? parseInt(caffeineMg) : null,
    image_url: imageUrl || null,
    active,
    featured,
    sort_order: sortOrder,
  })

  if (!result.success) {
    return { error: result.error || 'Không thể lưu sản phẩm' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/menu')
  revalidatePath('/recommendation')
  redirect('/admin/products')
}

export async function updateProduct(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const slug = formData.get('slug')?.toString().trim().toLowerCase().replace(/\s+/g, '-') || id
  const name = formData.get('name')?.toString().trim()
  const category = formData.get('category')?.toString() as DrinkCategory
  const shortDescription = formData.get('short_description')?.toString()
  const description = formData.get('description')?.toString()
  const price = parseFloat(formData.get('price')?.toString() ?? '0')
  const caffeineMg = formData.get('caffeine_mg')?.toString()
  const imageUrl = formData.get('image_url')?.toString()
  const active = formData.get('active') === 'true'
  const featured = formData.get('featured') === 'true'
  const sortOrder = parseInt(formData.get('sort_order')?.toString() ?? '0')

  if (!name || !category) {
    return { error: 'Tên và danh mục là bắt buộc.' }
  }

  const result = await saveAdminProduct({
    id,
    slug,
    name,
    category,
    short_description: shortDescription || null,
    description: description || null,
    price: isNaN(price) ? null : price,
    caffeine_mg: caffeineMg ? parseInt(caffeineMg) : null,
    image_url: imageUrl || null,
    active,
    featured,
    sort_order: sortOrder,
  })

  if (!result.success) {
    return { error: result.error || 'Không thể cập nhật sản phẩm' }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath(`/admin/products/${slug}`)
  revalidatePath('/menu')
  revalidatePath(`/menu/${slug}`)
  revalidatePath(`/scan/${slug}`)
  revalidatePath('/recommendation')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  await deleteOrToggleAdminProduct(id, false)
  revalidatePath('/admin/products')
  revalidatePath('/menu')
  redirect('/admin/products')
}

export async function toggleProductActive(id: string, currentActive: boolean) {
  await deleteOrToggleAdminProduct(id, !currentActive)
  revalidatePath('/admin/products')
  revalidatePath('/menu')
}

export async function handleSyncProducts(): Promise<{
  success: boolean
  count: number
  error?: string
}> {
  const res = await syncProductsToSupabase()
  revalidatePath('/admin/products')
  revalidatePath('/menu')
  return res
}
