import { requireOrderAdmin } from '@/lib/orders/auth'
import { api, assertSameOrigin, json, readJson } from '@/lib/orders/http'
import { findOrder, publicOrder, updateAdminOrder } from '@/lib/orders/service'
import { parseAdminAction } from '@/lib/orders/state'

export const runtime = 'nodejs'
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  return api(async () => { await requireOrderAdmin(); return json({ order: publicOrder(await findOrder((await context.params).id)) }) })
}
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return api(async () => {
    assertSameOrigin(request)
    await requireOrderAdmin()
    const action = parseAdminAction(await readJson(request))
    return json({ order: await updateAdminOrder((await context.params).id, action) })
  })
}
