import { api, assertSameOrigin, json, readJson } from '@/lib/orders/http'
import { parseCreateOrder } from '@/lib/orders/validation'
import { rateLimit, requestIdentifier } from '@/lib/orders/rate-limit'
import { createOrder } from '@/lib/orders/service'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  return api(async () => {
    assertSameOrigin(request)
    const input = parseCreateOrder(await readJson(request))
    await rateLimit(requestIdentifier(request), 'create-order-ip', 30, 600)
    await rateLimit(input.customer.phone, 'create-order-phone', 10, 600)
    const result = await createOrder(input)
    return json(result, result.replayed ? 200 : 201)
  })
}
