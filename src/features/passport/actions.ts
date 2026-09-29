'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updatePhoneNumber(
  phone: string
): Promise<{ success: boolean; error?: string }> {
  const cleanPhone = phone.trim().replace(/\s+/g, '')
  if (!cleanPhone || cleanPhone.length < 9 || cleanPhone.length > 12) {
    return { success: false, error: 'Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số).' }
  }

  // 1. Save to persistent cookie (so both guest and members retain their phone)
  const cookieStore = await cookies()
  cookieStore.set('ep_user_phone', cleanPhone, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  })

  // 2. Also save to Supabase profile if user is authenticated
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Upsert profile with phone_number
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          phone_number: cleanPhone,
          updated_at: new Date().toISOString(),
        } as any)
    }
  } catch (err) {
    console.error('Failed to update phone number in Supabase:', err)
  }

  revalidatePath('/passport')
  revalidatePath('/admin/customers')
  return { success: true }
}
