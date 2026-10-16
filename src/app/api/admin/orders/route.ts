import { requireOrderAdmin } from '@/lib/orders/auth'
import { api, json } from '@/lib/orders/http'
import { OrderError } from '@/lib/orders/errors'
import { listOrders } from '@/lib/orders/service'

export const runtime = 'nodejs'
export async function GET(request: Request) {
  return api(async () => {
    await requireOrderAdmin()
    const params = new URL(request.url).searchParams
    const offset = Number(params.get('offset') || '0')
    const limit = Number(params.get('limit') || '30')
    if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10_000 || !Number.isInteger(limit) || limit < 1 || limit > 100) throw new OrderError(400, 'INVALID_PAGINATION', 'Thông số phân trang chưa hợp lệ.')
    return json(await listOrders(offset, limit))
  })
}
