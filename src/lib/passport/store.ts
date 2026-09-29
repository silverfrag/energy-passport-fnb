import { cookies } from 'next/headers'
import type { ConsumptionLog, Product } from '@/types'
import { findStandardProduct } from '@/lib/constants/products'

const COOKIE_NAME = 'ep_guest_passport_logs'

export interface LocalLog {
  id: string
  user_id: string
  product_id: string
  product_slug: string
  caffeine_mg_snapshot: number | null
  consumed_at: string
  source: string
}

export async function getLocalPassportLogs(): Promise<ConsumptionLog[]> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(COOKIE_NAME)?.value
    if (!raw) return []

    const parsed: LocalLog[] = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.map((item) => {
      const product =
        findStandardProduct(item.product_slug) ||
        findStandardProduct(item.product_id) ||
        ({
          id: item.product_id,
          slug: item.product_slug,
          name: item.product_slug,
          category: 'WAKE',
          price: 50000,
          caffeine_mg: item.caffeine_mg_snapshot,
          active: true,
          featured: false,
          sort_order: 1,
          created_at: item.consumed_at,
          updated_at: item.consumed_at,
        } as Product)

      return {
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        caffeine_mg_snapshot: item.caffeine_mg_snapshot,
        consumed_at: item.consumed_at,
        created_at: item.consumed_at,
        state_checkin_id: null,
        source: item.source as 'qr_scan' | 'manual',
        product,
      }
    })
  } catch {
    return []
  }
}

export async function saveLocalPassportLog(log: LocalLog): Promise<void> {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get(COOKIE_NAME)?.value
    let logs: LocalLog[] = []
    if (raw) {
      try {
        logs = JSON.parse(raw)
      } catch {
        logs = []
      }
    }

    // Prepend new log
    logs.unshift(log)

    // Keep max 50 logs in cookie
    if (logs.length > 50) logs = logs.slice(0, 50)

    cookieStore.set(COOKIE_NAME, JSON.stringify(logs), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'lax',
    })
  } catch (err) {
    console.error('Failed to save local passport log:', err)
  }
}
