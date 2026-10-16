import { requireOrderAdmin } from '@/lib/orders/auth'
import { api, assertSameOrigin, json, readJson } from '@/lib/orders/http'
import { getPaymentSettings, savePaymentSettings } from '@/lib/orders/service'
import { parsePaymentSettings } from '@/lib/orders/validation'

export const runtime = 'nodejs'
export async function GET() {
  return api(async () => { await requireOrderAdmin(); return json({ settings: await getPaymentSettings() }) })
}
export async function PUT(request: Request) {
  return api(async () => {
    assertSameOrigin(request)
    await requireOrderAdmin()
    return json({ settings: await savePaymentSettings(parsePaymentSettings(await readJson(request))) })
  })
}
