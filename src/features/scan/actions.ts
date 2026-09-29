'use server'

import { createClient } from '@/lib/supabase/server'
import type { Product, ConsumptionLog } from '@/types'
import { findStandardProduct } from '@/lib/constants/products'
import { saveLocalPassportLog, getLocalPassportLogs, type LocalLog } from '@/lib/passport/store'
import { cookies } from 'next/headers'

async function getOrCreateUserId(supabase: any): Promise<string> {
  // 1. Try Supabase Auth
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user.id

    const { data, error } = await supabase.auth.signInAnonymously()
    if (!error && data?.user?.id) {
      return data.user.id
    }
  } catch {
    // Supabase auth not available or anonymous disabled
  }

  // 2. Fallback to stable cookie guest ID
  const cookieStore = await cookies()
  let guestId = cookieStore.get('ep_guest_uid')?.value
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
    cookieStore.set('ep_guest_uid', guestId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    })
  }
  return guestId
}

export async function confirmConsumption(
  productId: string,
  productSlug: string
): Promise<{ success: boolean; logId?: string; duplicate?: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Resolve product: prioritize standard products or Supabase database
    const standardProduct = findStandardProduct(productSlug) || findStandardProduct(productId)
    let product: Pick<Product, 'id' | 'slug' | 'name' | 'caffeine_mg' | 'active'> | null = standardProduct

    try {
      const { data: dbProduct } = await supabase
        .from('products')
        .select('id, slug, name, caffeine_mg, active')
        .or(`slug.eq.${productSlug},id.eq.${productId}`)
        .maybeSingle()

      if (dbProduct) {
        product = dbProduct as Pick<Product, 'id' | 'slug' | 'name' | 'caffeine_mg' | 'active'>
      }
    } catch {
      // Supabase table not created yet, use standard product
    }

    if (!product) {
      return { success: false, error: 'Sản phẩm không tồn tại.' }
    }

    if (!product.active) {
      return { success: false, error: 'Sản phẩm hiện không còn hoạt động.' }
    }

    // 2. Resolve user ID
    const userId = await getOrCreateUserId(supabase)

    // 3. Duplicate check: same user + same product within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).getTime()

    // Check in local cookie store
    const localLogs = await getLocalPassportLogs()
    const recentLocal = localLogs.find(
      (l) =>
        (l.product?.slug === productSlug || l.product_id === productId || l.product?.id === product?.id) &&
        new Date(l.consumed_at).getTime() >= fiveMinutesAgo
    )

    if (recentLocal) {
      return { success: false, duplicate: true, logId: recentLocal.id }
    }

    // Check in Supabase if available
    try {
      const fiveMinutesIso = new Date(fiveMinutesAgo).toISOString()
      const { data: recentDb } = await supabase
        .from('consumption_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .gte('consumed_at', fiveMinutesIso)
        .limit(1)

      if (recentDb && (recentDb as any[]).length > 0) {
        return { success: false, duplicate: true, logId: (recentDb as any[])[0]?.id }
      }
    } catch {
      // Supabase table not available
    }

    // 4. Create log record
    const logId = 'log_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    const consumedAt = new Date().toISOString()

    const localLog: LocalLog = {
      id: logId,
      user_id: userId,
      product_id: product.id,
      product_slug: product.slug,
      caffeine_mg_snapshot: product.caffeine_mg,
      consumed_at: consumedAt,
      source: 'qr_scan',
    }

    // Always save to local cookie store for instant reliability
    await saveLocalPassportLog(localLog)

    // Also attempt saving to Supabase if database tables are active
    try {
      const payload: Record<string, any> = {
        user_id: userId,
        product_id: product.id,
        caffeine_mg_snapshot: product.caffeine_mg,
        source: 'qr_scan',
      }
      await (supabase.from('consumption_logs') as any).insert(payload)
    } catch {
      // Ignore Supabase failure, cookie storage already succeeded
    }

    return { success: true, logId }
  } catch (err: any) {
    console.error('Error confirming consumption:', err)
    return { success: false, error: err?.message || 'Lỗi không xác định. Vui lòng thử lại.' }
  }
}

export async function confirmConsumptionDespiteDuplicate(
  productId: string,
  productSlug?: string
): Promise<{ success: boolean; logId?: string; error?: string }> {
  try {
    const supabase = await createClient()

    const standardProduct = findStandardProduct(productSlug || '') || findStandardProduct(productId)
    let product: Pick<Product, 'id' | 'slug' | 'name' | 'caffeine_mg' | 'active'> | null = standardProduct

    try {
      const query = productSlug
        ? `slug.eq.${productSlug},id.eq.${productId}`
        : `id.eq.${productId}`
      const { data: dbProduct } = await supabase
        .from('products')
        .select('id, slug, name, caffeine_mg, active')
        .or(query)
        .maybeSingle()

      if (dbProduct) {
        product = dbProduct as Pick<Product, 'id' | 'slug' | 'name' | 'caffeine_mg' | 'active'>
      }
    } catch {
      // Supabase table not created yet
    }

    if (!product) {
      return { success: false, error: 'Sản phẩm không tồn tại.' }
    }

    const userId = await getOrCreateUserId(supabase)
    const logId = 'log_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
    const consumedAt = new Date().toISOString()

    const localLog: LocalLog = {
      id: logId,
      user_id: userId,
      product_id: product.id,
      product_slug: product.slug,
      caffeine_mg_snapshot: product.caffeine_mg,
      consumed_at: consumedAt,
      source: 'qr_scan',
    }

    await saveLocalPassportLog(localLog)

    try {
      const payload: Record<string, any> = {
        user_id: userId,
        product_id: product.id,
        caffeine_mg_snapshot: product.caffeine_mg,
        source: 'qr_scan',
      }
      await (supabase.from('consumption_logs') as any).insert(payload)
    } catch {
      // Fallback succeeded
    }

    return { success: true, logId }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Lỗi không xác định.' }
  }
}
