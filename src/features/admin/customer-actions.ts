'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { clearAdminSession, requireOrderAdmin, setAdminSession } from '@/lib/orders/auth'
import { sessionSecret, validPasskey } from '@/lib/orders/crypto'
import { rateLimit } from '@/lib/orders/rate-limit'
import { OrderError } from '@/lib/orders/errors'
import { orderDatabase } from '@/lib/orders/db'
import type { ConsumptionLog, Product, Profile } from '@/types'

type CustomerProfileRow = Profile & { email?: string | null }
type CustomerConsumptionRow = Pick<ConsumptionLog, 'user_id' | 'consumed_at' | 'caffeine_mg_snapshot'> & {
  product: Pick<Product, 'name' | 'category'> | null
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' && error.message
    ? error.message
    : fallback
}

export interface CustomerSummary {
  id: string
  displayName: string
  email?: string | null
  phone?: string | null
  avatarUrl?: string | null
  totalDrinks: number
  sevenDayDrinks: number
  loyaltyClaimed: number
  currentCycleDrinks: number
  qualifiesForReward: boolean
  lastVisitedAt: string | null
  recentDrinks: {
    productName: string
    category: string
    caffeine: number | null
    consumedAt: string
  }[]
}

const EMPTY_CUSTOMERS: CustomerSummary[] = []

export async function getCustomersData(): Promise<{
  customers: CustomerSummary[]
  totalCustomers: number
  rewardEligibleCount: number
  activeWeeklyCount: number
  withPhoneCount: number
}> {
  await requireOrderAdmin()
  try {
    const supabase = orderDatabase()

    // 1. Fetch profiles
    const { data: profiles, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (profileErr || !profiles || profiles.length === 0) {
      return {
        customers: EMPTY_CUSTOMERS,
        totalCustomers: EMPTY_CUSTOMERS.length,
        rewardEligibleCount: EMPTY_CUSTOMERS.filter((c) => c.qualifiesForReward).length,
        activeWeeklyCount: EMPTY_CUSTOMERS.filter((c) => c.sevenDayDrinks > 0).length,
        withPhoneCount: EMPTY_CUSTOMERS.filter((c) => !!c.phone).length,
      }
    }

    // 2. Fetch all consumption logs with products
    const { data: logsRaw } = await supabase
      .from('consumption_logs')
      .select('*, product:products(*)')
      .order('consumed_at', { ascending: false })
      .limit(500)

    const logs = (logsRaw as CustomerConsumptionRow[] | null) || []
    const now = Date.now()
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

    // 3. Map logs by user_id
    const logsByUser = new Map<string, CustomerConsumptionRow[]>()
    for (const log of logs) {
      if (!log.user_id) continue
      const list = logsByUser.get(log.user_id) || []
      list.push(log)
      logsByUser.set(log.user_id, list)
    }

    // 4. Combine into CustomerSummary
    const customers: CustomerSummary[] = (profiles as CustomerProfileRow[]).map((p) => {
      const userLogs = logsByUser.get(p.id) || []
      const totalDrinks = userLogs.length
      const sevenDayLogs = userLogs.filter((l) => new Date(l.consumed_at) >= sevenDaysAgo)
      const loyaltyClaimed = p.loyalty_drinks_claimed || 0
      const currentCycleDrinks = Math.max(0, totalDrinks - loyaltyClaimed * 10)
      const qualifiesForReward = currentCycleDrinks >= 10
      const lastVisitedAt = userLogs.length > 0 ? userLogs[0].consumed_at : p.created_at

      const recentDrinks = userLogs.slice(0, 5).map((l) => ({
        productName: l.product?.name || 'Đồ uống Fame Drink',
        category: l.product?.category || 'WAKE',
        caffeine: l.caffeine_mg_snapshot,
        consumedAt: l.consumed_at,
      }))

      return {
        id: p.id,
        displayName: p.display_name || 'Khách Hàng Fame',
        email: p.email || null,
        phone: p.phone_number || null,
        avatarUrl: p.avatar_url || null,
        totalDrinks,
        sevenDayDrinks: sevenDayLogs.length,
        loyaltyClaimed,
        currentCycleDrinks,
        qualifiesForReward,
        lastVisitedAt,
        recentDrinks,
      }
    })

    const finalCustomers = customers

    return {
      customers: finalCustomers,
      totalCustomers: finalCustomers.length,
      rewardEligibleCount: finalCustomers.filter((c) => c.qualifiesForReward).length,
      activeWeeklyCount: finalCustomers.filter((c) => c.sevenDayDrinks > 0).length,
      withPhoneCount: finalCustomers.filter((c) => !!c.phone).length,
    }
  } catch (err) {
    console.error('Error fetching customers:', err)
    return {
      customers: EMPTY_CUSTOMERS,
      totalCustomers: EMPTY_CUSTOMERS.length,
      rewardEligibleCount: EMPTY_CUSTOMERS.filter((c) => c.qualifiesForReward).length,
      activeWeeklyCount: EMPTY_CUSTOMERS.filter((c) => c.sevenDayDrinks > 0).length,
      withPhoneCount: EMPTY_CUSTOMERS.filter((c) => !!c.phone).length,
    }
  }
}

/**
 * Barista action: Record a manual drink for a customer (e.g. walk-in or delivery order)
 */
export async function recordManualDrink(
  userId: string,
  productSlug: string = 'ca-phe-sot-biscoff'
): Promise<{ success: boolean; message: string }> {
  await requireOrderAdmin()
  try {
    const supabase = orderDatabase()

    // 1. Get product by slug
    const { data: productRaw, error: productError } = await supabase
      .from('products')
      .select('id, caffeine_mg, name')
      .eq('slug', productSlug)
      .maybeSingle()

    if (productError || !productRaw) return { success: false, message: 'Chưa tìm thấy món trong cơ sở dữ liệu. Chưa ghi nhận ly nào.' }
    const product = productRaw
    const productId = product.id
    const caffeine = product.caffeine_mg

    // 2. Insert into consumption_logs
    const { error } = await supabase.from('consumption_logs').insert({
      user_id: userId,
      product_id: productId,
      caffeine_mg_snapshot: caffeine,
      source: 'manual',
      consumed_at: new Date().toISOString(),
    })
    if (error) return { success: false, message: 'Chưa ghi nhận được ly vào cơ sở dữ liệu. Vui lòng kiểm tra hồ sơ khách.' }

    revalidatePath('/admin/customers')
    revalidatePath('/admin')
    revalidatePath('/passport')
    return { success: true, message: `Đã ghi nhận +1 ly cho khách hàng thành công!` }
  } catch (err: unknown) {
    return { success: false, message: getErrorMessage(err, 'Có lỗi khi ghi nhận đồ uống.') }
  }
}

/**
 * Barista action: Claim loyalty reward (applied discount or free drink at counter)
 */
export async function claimCustomerReward(
  userId: string
): Promise<{ success: boolean; message: string }> {
  await requireOrderAdmin()
  try {
    const supabase = orderDatabase()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('loyalty_drinks_claimed')
      .eq('id', userId)
      .maybeSingle()

    if (profileError || !profile) return { success: false, message: 'Không tìm thấy hồ sơ khách trong cơ sở dữ liệu.' }
    const claimed = profile.loyalty_drinks_claimed || 0
    const { count, error: countError } = await supabase.from('consumption_logs').select('id', { head: true, count: 'exact' }).eq('user_id', userId)
    if (countError || (count || 0) - claimed * 10 < 10) return { success: false, message: 'Chưa đủ lượt hợp lệ để áp dụng ưu đãi.' }
    const nextClaimed = claimed + 1

    const { data: updated, error: updateError } = await supabase.from('profiles')
      .update({
        loyalty_drinks_claimed: nextClaimed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .eq('loyalty_drinks_claimed', claimed)
      .select('id')
      .maybeSingle()
    if (updateError || !updated) return { success: false, message: 'Chưa lưu được ưu đãi hoặc hồ sơ vừa thay đổi. Vui lòng tải lại.' }

    revalidatePath('/admin/customers')
    revalidatePath('/admin')
    revalidatePath('/passport')
    return { 
      success: true, 
      message: '✓ Đã kích hoạt ưu đãi tri ân thành công! Chu kỳ tích lũy đã được cập nhật.' 
    }
  } catch (err: unknown) {
    return { success: false, message: getErrorMessage(err, 'Có lỗi khi áp dụng ưu đãi.') }
  }
}

/**
 * Barista action: Quick register walk-in or delivery customer with Phone and Name
 */
export async function quickCreateCustomer(
  displayName: string,
  phone: string
): Promise<{ success: boolean; message: string }> {
  await requireOrderAdmin()
  const cleanPhone = phone.trim().replace(/\s+/g, '')
  if (!cleanPhone || cleanPhone.length < 9) {
    return { success: false, message: 'Số điện thoại không hợp lệ (tối thiểu 9 số).' }
  }

  void displayName
  // profiles.id is a foreign key to auth.users; inventing a phone-based ID cannot create a valid profile.
  return { success: false, message: 'Hồ sơ Passport cần được khách liên kết tài khoản trước. Thông tin khách đặt giao hàng được lưu riêng trong đơn hàng.' }
}

/** Existing login form now uses the same secure session as order management. */
export async function verifyAdminPasskey(
  passkey: string
): Promise<{ success: boolean; message: string }> {
  try {
    sessionSecret()
    const headerList = await headers()
    await rateLimit(process.env.VERCEL ? headerList.get('x-real-ip') || 'unknown' : 'local', 'admin-login', 5, 900)
    if (typeof passkey !== 'string' || passkey.length > 256 || !validPasskey(passkey)) return { success: false, message: 'Mật khẩu quản trị không chính xác.' }
    await setAdminSession()

    revalidatePath('/admin')
    revalidatePath('/admin/customers')
    revalidatePath('/admin/products')
    revalidatePath('/admin/actions')
    return { success: true, message: 'Xác thực thành công! Đang mở trang quản trị...' }
  } catch (err: unknown) {
    return { success: false, message: err instanceof OrderError ? err.message : 'Không thể đăng nhập quản trị. Vui lòng thử lại.' }
  }
}

/**
 * Lock/Logout from admin session (clears cookie)
 */
export async function logoutAdminPasskey(): Promise<void> {
  await clearAdminSession()
  revalidatePath('/admin')
}
