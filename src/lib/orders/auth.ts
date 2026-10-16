import 'server-only'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, SESSION_SECONDS, createAdminSession, verifyAdminSession } from './crypto'
import { OrderError } from './errors'

export async function isOrderAdmin(): Promise<boolean> {
  return verifyAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)
}
export async function requireOrderAdmin(): Promise<void> {
  if (!await isOrderAdmin()) throw new OrderError(401, 'ADMIN_REQUIRED', 'Vui lòng đăng nhập quản trị để tiếp tục.')
}
export async function setAdminSession(): Promise<void> {
  ;(await cookies()).set(ADMIN_COOKIE, createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: SESSION_SECONDS })
}
export async function clearAdminSession(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  store.delete('ep_admin_session')
}
