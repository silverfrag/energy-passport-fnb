import fs from 'fs'
import path from 'path'
import { createClient } from '@/lib/supabase/server'
import type { Product, MicroAction } from '@/types'
import { STANDARD_PRODUCTS } from '@/lib/constants/products'
import { STANDARD_ACTIONS } from '@/lib/constants/actions'
import { orderDatabase } from '@/lib/orders/db'

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products-store.json')
const ACTIONS_FILE = path.join(process.cwd(), 'src', 'data', 'actions-store.json')

// In-memory fallback if filesystem is read-only
let memoryProducts: Product[] | null = null
let memoryActions: MicroAction[] | null = null
const CATALOG_WRITE_ERROR = 'Chưa lưu được vào cơ sở dữ liệu. Kiểm tra cấu hình máy chủ và bảng danh mục; thay đổi chưa được áp dụng.'
const identifierColumn = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ? 'id' : 'slug'

// Helper to read local JSON file safely
function readLocalProducts(): Product[] {
  if (memoryProducts) return memoryProducts
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8')
      const parsed = JSON.parse(raw) as Product[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProducts = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('[catalog-service] Failed to read products-store.json:', err)
  }
  memoryProducts = [...STANDARD_PRODUCTS]
  return memoryProducts
}

function writeLocalProducts(products: Product[]): void {
  memoryProducts = products
  try {
    const dir = path.dirname(PRODUCTS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[catalog-service] Could not write products to file (read-only environment):', err)
  }
}

function readLocalActions(): MicroAction[] {
  if (memoryActions) return memoryActions
  try {
    if (fs.existsSync(ACTIONS_FILE)) {
      const raw = fs.readFileSync(ACTIONS_FILE, 'utf-8')
      const parsed = JSON.parse(raw) as MicroAction[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryActions = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('[catalog-service] Failed to read actions-store.json:', err)
  }
  memoryActions = [...STANDARD_ACTIONS]
  return memoryActions
}

function writeLocalActions(actions: MicroAction[]): void {
  memoryActions = actions
  try {
    const dir = path.dirname(ACTIONS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(ACTIONS_FILE, JSON.stringify(actions, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[catalog-service] Could not write actions to file (read-only environment):', err)
  }
}

// ==========================================
// PRODUCTS
// ==========================================

export async function getAdminProductsList(): Promise<{
  products: Product[]
  isDatabaseSource: boolean
}> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      return { products: data as Product[], isDatabaseSource: true }
    }
  } catch {
    // Supabase query failed or table not found
  }

  const local = readLocalProducts()
  return { products: local, isDatabaseSource: false }
}

export async function getAdminProduct(idOrSlug: string): Promise<Product | null> {
  // 1. Try Supabase
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq(identifierColumn(idOrSlug), idOrSlug)
      .maybeSingle()

    if (data) return data as Product
  } catch {
    // table doesn't exist yet or query error
  }

  // 2. Try local store
  const local = readLocalProducts()
  const found = local.find((p) => p.slug === idOrSlug || p.id === idOrSlug)
  if (found) return found

  // 3. Try standard products
  return STANDARD_PRODUCTS.find((p) => p.slug === idOrSlug || p.id === idOrSlug) ?? null
}

export async function saveAdminProduct(
  productData: Partial<Product> & { slug: string; name: string }
): Promise<{ success: boolean; product?: Product; error?: string }> {
  const local = readLocalProducts()
  const existingIdx = local.findIndex(
    (p) => p.slug === productData.slug || (productData.id && p.id === productData.id)
  )

  const updatedProduct: Product = {
    id: productData.id || productData.slug,
    slug: productData.slug,
    name: productData.name,
    category: productData.category ?? 'WAKE',
    short_description: productData.short_description ?? null,
    description: productData.description ?? null,
    price: productData.price !== undefined ? productData.price : null,
    caffeine_mg: productData.caffeine_mg !== undefined ? productData.caffeine_mg : null,
    image_url: productData.image_url ?? null,
    active: productData.active !== undefined ? productData.active : true,
    featured: productData.featured !== undefined ? productData.featured : false,
    sort_order: productData.sort_order ?? 0,
    created_at: existingIdx >= 0 ? local[existingIdx].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Persist first. A serverless in-memory/local write cannot count as a successful catalog update.
  try {
    const supabase = orderDatabase()
    const { data, error } = await supabase.from('products').upsert(
      {
        slug: updatedProduct.slug,
        name: updatedProduct.name,
        category: updatedProduct.category,
        short_description: updatedProduct.short_description,
        description: updatedProduct.description,
        price: updatedProduct.price,
        caffeine_mg: updatedProduct.caffeine_mg,
        image_url: updatedProduct.image_url,
        active: updatedProduct.active,
        featured: updatedProduct.featured,
        sort_order: updatedProduct.sort_order,
      },
      { onConflict: 'slug' }
    ).select('*').single()
    if (error || !data) return { success: false, error: CATALOG_WRITE_ERROR }
    if (existingIdx >= 0) local[existingIdx] = data as Product
    else local.push(data as Product)
    writeLocalProducts(local)
    return { success: true, product: data as Product }
  } catch {
    return { success: false, error: CATALOG_WRITE_ERROR }
  }
}

export async function deleteOrToggleAdminProduct(
  idOrSlug: string,
  newActiveState?: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = orderDatabase()
    const query = newActiveState !== undefined ? supabase.from('products').update({ active: newActiveState }) : supabase.from('products').delete()
    const { data, error } = await query.eq(identifierColumn(idOrSlug), idOrSlug).select('id')
    if (error || !data?.length) return { success: false, error: CATALOG_WRITE_ERROR }
  } catch { return { success: false, error: CATALOG_WRITE_ERROR } }
  const local = readLocalProducts()
  const idx = local.findIndex((p) => p.slug === idOrSlug || p.id === idOrSlug)

  if (idx >= 0) {
    if (newActiveState !== undefined) {
      local[idx].active = newActiveState
      local[idx].updated_at = new Date().toISOString()
    } else {
      local.splice(idx, 1)
    }
    writeLocalProducts(local)
  }

  return { success: true }
}

export async function syncProductsToSupabase(): Promise<{
  success: boolean
  count: number
  error?: string
}> {
  try {
    const supabase = orderDatabase()
    const products = readLocalProducts()

    const payloads = products.map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      short_description: p.short_description,
      description: p.description,
      price: p.price,
      caffeine_mg: p.caffeine_mg,
      image_url: p.image_url,
      active: p.active,
      featured: p.featured,
      sort_order: p.sort_order,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('products') as any).upsert(payloads, {
      onConflict: 'slug',
    })

    if (error) {
      return { success: false, count: 0, error: CATALOG_WRITE_ERROR }
    }

    return { success: true, count: payloads.length }
  } catch {
    return { success: false, count: 0, error: CATALOG_WRITE_ERROR }
  }
}

// ==========================================
// MICRO ACTIONS
// ==========================================

export async function getAdminActionsList(): Promise<{
  actions: MicroAction[]
  isDatabaseSource: boolean
}> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('micro_actions')
      .select('*')
      .order('duration_minutes', { ascending: true })

    if (!error && data && data.length > 0) {
      return { actions: data as MicroAction[], isDatabaseSource: true }
    }
  } catch {
    // Supabase query failed or table not found
  }

  const local = readLocalActions()
  return { actions: local, isDatabaseSource: false }
}

export async function getAdminAction(idOrSlug: string): Promise<MicroAction | null> {
  // 1. Try Supabase
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('micro_actions')
      .select('*')
      .eq(identifierColumn(idOrSlug), idOrSlug)
      .maybeSingle()

    if (data) return data as MicroAction
  } catch {
    // table doesn't exist yet
  }

  // 2. Try local store
  const local = readLocalActions()
  const found = local.find((a) => a.slug === idOrSlug || a.id === idOrSlug)
  if (found) return found

  // 3. Try standard actions
  return STANDARD_ACTIONS.find((a) => a.slug === idOrSlug || a.id === idOrSlug) ?? null
}

export async function saveAdminAction(
  actionData: Partial<MicroAction> & { slug: string; title: string }
): Promise<{ success: boolean; action?: MicroAction; error?: string }> {
  const local = readLocalActions()
  const existingIdx = local.findIndex(
    (a) => a.slug === actionData.slug || (actionData.id && a.id === actionData.id)
  )

  const updatedAction: MicroAction = {
    id: actionData.id || actionData.slug,
    slug: actionData.slug,
    category: actionData.category ?? 'WAKE',
    title: actionData.title,
    duration_minutes: actionData.duration_minutes ?? 5,
    description: actionData.description ?? null,
    steps: actionData.steps ?? [],
    active: actionData.active !== undefined ? actionData.active : true,
    created_at: existingIdx >= 0 ? local[existingIdx].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Persist first, using a server-only credential after the server-action authorization guard.
  try {
    const supabase = orderDatabase()
    const { data, error } = await supabase.from('micro_actions').upsert(
      {
        slug: updatedAction.slug,
        category: updatedAction.category,
        title: updatedAction.title,
        duration_minutes: updatedAction.duration_minutes,
        description: updatedAction.description,
        steps: updatedAction.steps,
        active: updatedAction.active,
      },
      { onConflict: 'slug' }
    ).select('*').single()
    if (error || !data) return { success: false, error: CATALOG_WRITE_ERROR }
    if (existingIdx >= 0) local[existingIdx] = data as MicroAction
    else local.push(data as MicroAction)
    writeLocalActions(local)
    return { success: true, action: data as MicroAction }
  } catch {
    return { success: false, error: CATALOG_WRITE_ERROR }
  }
}

export async function deleteOrToggleAdminAction(
  idOrSlug: string,
  newActiveState?: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = orderDatabase()
    const query = newActiveState !== undefined ? supabase.from('micro_actions').update({ active: newActiveState }) : supabase.from('micro_actions').delete()
    const { data, error } = await query.eq(identifierColumn(idOrSlug), idOrSlug).select('id')
    if (error || !data?.length) return { success: false, error: CATALOG_WRITE_ERROR }
  } catch { return { success: false, error: CATALOG_WRITE_ERROR } }
  const local = readLocalActions()
  const idx = local.findIndex((a) => a.slug === idOrSlug || a.id === idOrSlug)

  if (idx >= 0) {
    if (newActiveState !== undefined) {
      local[idx].active = newActiveState
      local[idx].updated_at = new Date().toISOString()
    } else {
      local.splice(idx, 1)
    }
    writeLocalActions(local)
  }

  return { success: true }
}

export async function syncActionsToSupabase(): Promise<{
  success: boolean
  count: number
  error?: string
}> {
  try {
    const supabase = orderDatabase()
    const actions = readLocalActions()

    const payloads = actions.map((a) => ({
      slug: a.slug,
      category: a.category,
      title: a.title,
      duration_minutes: a.duration_minutes,
      description: a.description,
      steps: a.steps,
      active: a.active,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('micro_actions') as any).upsert(payloads, {
      onConflict: 'slug',
    })

    if (error) {
      return { success: false, count: 0, error: CATALOG_WRITE_ERROR }
    }

    return { success: true, count: payloads.length }
  } catch {
    return { success: false, count: 0, error: CATALOG_WRITE_ERROR }
  }
}
