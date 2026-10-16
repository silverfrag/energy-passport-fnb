import 'server-only'
import { OrderError } from '@/lib/orders/errors'
import type { AdminFailure } from './shared'

export function serverFailure(error: unknown): AdminFailure {
  return error instanceof OrderError
    ? { status: error.status, code: error.code, message: error.message }
    : { status: 503, code: 'ORDERING_UNAVAILABLE', message: 'Chưa kết nối được dữ liệu đơn hàng. Vui lòng kiểm tra cấu hình máy chủ rồi tải lại.' }
}
