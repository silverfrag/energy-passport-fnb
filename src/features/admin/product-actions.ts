'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { DrinkCategory } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export async function createProduct(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

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

  const payload: AnyRecord = {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('products') as any).insert(payload)

  if (error) return { error: error.message }
  redirect('/admin/products')
}

export async function updateProduct(
  id: string,
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

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

  const payload: AnyRecord = {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('products') as any).update(payload).eq('id', id)

  if (error) return { error: error.message }
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('products') as any).update({ active: false }).eq('id', id)
  redirect('/admin/products')
}
