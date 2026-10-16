export const FANPAGE_URL = 'https://www.facebook.com/profile.php?id=61594444034582'

export interface OrderConfig {
  orderingAvailable: boolean
  deliveryAvailable: boolean
  pickupAvailable: boolean
  deliveryFee: number | null
  paymentMethod: 'bank_transfer'
  message?: string
}

export class OrderApiError extends Error {
  constructor(message: string, public status: number, public code: string) { super(message) }
}

export async function orderRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  try {
    const response = await fetch(url, { ...options, cache: 'no-store', signal: options.signal ?? controller.signal })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new OrderApiError(data?.error || 'Chưa thể xử lý yêu cầu. Vui lòng thử lại.', response.status, data?.code || 'REQUEST_FAILED')
    if (!data) throw new OrderApiError('Phản hồi chưa đầy đủ. Vui lòng tải lại.', 502, 'INVALID_RESPONSE')
    return data as T
  } finally { clearTimeout(timer) }
}
