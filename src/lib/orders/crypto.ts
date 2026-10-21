import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { OrderError } from './errors'

export const ADMIN_COOKIE = 'fd_admin_session'
export const SESSION_SECONDS = 8 * 60 * 60

export function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) throw new OrderError(503, 'ADMIN_NOT_CONFIGURED', 'Chưa cấu hình bảo mật quản trị trên máy chủ.')
  return secret
}
export function hash(value: string): string { return createHash('sha256').update(value).digest('hex') }
function sign(value: string): string { return createHmac('sha256', sessionSecret()).update(value).digest('base64url') }
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
export function validPasskey(value: string): boolean {
  const passkey = process.env.ADMIN_PASSKEY
  if (!passkey || passkey.length > 256 || (passkey.length < 12 && !/^\d{4}$/.test(passkey))) throw new OrderError(503, 'ADMIN_NOT_CONFIGURED', 'Chưa cấu hình mật khẩu hoặc PIN quản trị hợp lệ trên máy chủ.')
  return safeEqual(hash(value), hash(passkey))
}
export function createAdminSession(now = Date.now()): string {
  const value = Buffer.from(JSON.stringify({ role: 'owner', exp: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(16).toString('hex') })).toString('base64url')
  return `${value}.${sign(`admin-session:${value}`)}`
}
export function verifyAdminSession(token: string | undefined, now = Date.now()): boolean {
  if (!token || token.length > 1024) return false
  const [value, signature, extra] = token.split('.')
  if (!value || !signature || extra) return false
  try {
    if (!safeEqual(signature, sign(`admin-session:${value}`))) return false
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
    const seconds = Math.floor(now / 1000)
    return parsed.role === 'owner' && Number.isInteger(parsed.exp) && parsed.exp > seconds && parsed.exp <= seconds + SESSION_SECONDS
  } catch { return false }
}
export function orderAccessToken(idempotencyKey: string): string {
  return sign(`order-access:${idempotencyKey}`)
}
