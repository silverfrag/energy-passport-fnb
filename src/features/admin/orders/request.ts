import type { AdminFailure } from './shared'

export class AdminRequestError extends Error {
  constructor(public failure: AdminFailure) { super(failure.message) }
}

export function failureFrom(error: unknown): AdminFailure {
  return error instanceof AdminRequestError ? error.failure : {
    status: 0, code: 'NETWORK_ERROR', message: 'Mất kết nối. Chưa xác định được kết quả thao tác; hãy tải lại dữ liệu trước khi thử tiếp.',
  }
}

export async function adminRequest<T>(url: string, method: 'GET' | 'PATCH' | 'PUT' = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method, cache: 'no-store', credentials: 'same-origin',
    ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
  })
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const value = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
    throw new AdminRequestError({
      status: response.status,
      code: typeof value.code === 'string' ? value.code : 'REQUEST_FAILED',
      message: typeof value.error === 'string' ? value.error : 'Không thể tải dữ liệu. Vui lòng thử lại.',
    })
  }
  if (!payload || typeof payload !== 'object') throw new AdminRequestError({
    status: 502, code: 'INVALID_RESPONSE', message: 'Máy chủ trả về dữ liệu chưa hợp lệ. Hãy tải lại trước khi thao tác.',
  })
  return payload as T
}
