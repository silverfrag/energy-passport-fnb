import 'server-only'
import { OrderError } from './errors'

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store, private', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } })
}
export async function api(run: () => Promise<Response>): Promise<Response> {
  try { return await run() } catch (error) {
    if (error instanceof OrderError) return json({ error: error.message, code: error.code }, error.status)
    return json({ error: 'Không thể xử lý yêu cầu. Vui lòng thử lại.', code: 'INTERNAL_ERROR' }, 500)
  }
}
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get('origin')
  const url = new URL(request.url)
  // Next can reconstruct request.url using its internal hostname. The browser's
  // Host header retains the actual destination; never trust x-forwarded-host here.
  const host = request.headers.get('host') || url.host
  const expectedOrigin = `${url.protocol}//${host}`
  if (!origin || origin !== expectedOrigin || request.headers.get('sec-fetch-site') === 'cross-site') throw new OrderError(403, 'INVALID_ORIGIN', 'Yêu cầu không hợp lệ. Vui lòng thao tác trực tiếp trên website Fame Drink.')
}
export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new OrderError(415, 'JSON_REQUIRED', 'Yêu cầu cần có định dạng JSON.')
  const maxBytes = 16_384
  if (Number(request.headers.get('content-length') || '0') > maxBytes) throw new OrderError(413, 'BODY_TOO_LARGE', 'Nội dung yêu cầu quá dài.')
  const reader = request.body?.getReader()
  if (!reader) throw new OrderError(400, 'INVALID_JSON', 'Thiếu nội dung yêu cầu.')
  const decoder = new TextDecoder()
  let content = ''
  let length = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    length += value.byteLength
    if (length > maxBytes) { await reader.cancel(); throw new OrderError(413, 'BODY_TOO_LARGE', 'Nội dung yêu cầu quá dài.') }
    content += decoder.decode(value, { stream: true })
  }
  content += decoder.decode()
  try { return JSON.parse(content) } catch { throw new OrderError(400, 'INVALID_JSON', 'Nội dung yêu cầu chưa hợp lệ.') }
}
