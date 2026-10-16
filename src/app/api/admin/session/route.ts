import { clearAdminSession, isOrderAdmin, setAdminSession } from '@/lib/orders/auth'
import { validPasskey } from '@/lib/orders/crypto'
import { OrderError } from '@/lib/orders/errors'
import { api, assertSameOrigin, json, readJson } from '@/lib/orders/http'
import { rateLimit, requestIdentifier } from '@/lib/orders/rate-limit'
import { isRecord } from '@/lib/orders/validation'

export const runtime = 'nodejs'
export async function GET() { return api(async () => json({ authenticated: await isOrderAdmin() })) }
export async function POST(request: Request) {
  return api(async () => {
    assertSameOrigin(request)
    await rateLimit(requestIdentifier(request), 'admin-login', 5, 900)
    const body = await readJson(request)
    if (!isRecord(body) || typeof body.passkey !== 'string' || body.passkey.length > 256 || !validPasskey(body.passkey)) throw new OrderError(401, 'INVALID_CREDENTIALS', 'Mật khẩu quản trị không chính xác.')
    await setAdminSession()
    return json({ authenticated: true })
  })
}
export async function DELETE(request: Request) {
  return api(async () => { assertSameOrigin(request); await clearAdminSession(); return json({ authenticated: false }) })
}
