import { api, json } from '@/lib/orders/http'
import { customerOrder, publicOrder } from '@/lib/orders/service'
import { rateLimit, requestIdentifier } from '@/lib/orders/rate-limit'

export const runtime = 'nodejs'
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return api(async () => {
    await rateLimit(requestIdentifier(request), 'order-lookup', 120, 60)
    return json({ order: publicOrder(await customerOrder((await context.params).id, request.headers.get('authorization'))) })
  })
}
