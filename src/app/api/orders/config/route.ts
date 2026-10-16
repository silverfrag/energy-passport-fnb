import { api, json } from '@/lib/orders/http'
import { getPaymentSettings } from '@/lib/orders/service'
import { sessionSecret } from '@/lib/orders/crypto'
import { OrderError } from '@/lib/orders/errors'

export const runtime = 'nodejs'
export async function GET() {
  return api(async () => {
    try {
      sessionSecret()
      const settings = await getPaymentSettings()
      return json({ orderingAvailable: settings.enabled, pickupAvailable: false, deliveryAvailable: settings.enabled, deliveryFee: 0, demo: true, paymentMethod: 'bank_transfer' })
    } catch (error) {
      if (error instanceof OrderError && error.status === 503) return json({ orderingAvailable: false, pickupAvailable: false, deliveryAvailable: false, deliveryFee: 0, demo: true, paymentMethod: 'bank_transfer', message: 'Cửa hàng chưa mở nhận đơn online.' })
      throw error
    }
  })
}
