import { api, assertSameOrigin, json } from '@/lib/orders/http'
import { customerOrder, markPaymentReview } from '@/lib/orders/service'
import { rateLimit, requestIdentifier } from '@/lib/orders/rate-limit'

export const runtime = 'nodejs'
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return api(async () => {
    assertSameOrigin(request)
    await rateLimit(requestIdentifier(request), 'payment-review', 20, 300)
    const order = await customerOrder((await context.params).id, request.headers.get('authorization'))
    return json({ order: await markPaymentReview(order) })
  })
}
