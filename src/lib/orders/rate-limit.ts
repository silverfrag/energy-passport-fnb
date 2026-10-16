import 'server-only'
import { createHmac } from 'node:crypto'
import { sessionSecret } from './crypto'
import { orderDatabase } from './db'
import { OrderError, unavailable } from './errors'

/** Shared database counters survive serverless cold starts. No raw IP/phone is stored. */
export async function rateLimit(identifier: string, scope: string, limit: number, seconds: number): Promise<void> {
  const key = createHmac('sha256', sessionSecret()).update(`${scope}:${identifier}`).digest('hex')
  const { data, error } = await orderDatabase().rpc('fd_consume_rate_limit', { p_key: key, p_limit: limit, p_seconds: seconds })
  if (error) unavailable()
  if (data !== true) throw new OrderError(429, 'TOO_MANY_REQUESTS', 'Bạn thao tác quá nhiều lần. Vui lòng chờ vài phút rồi thử lại.')
}
export function requestIdentifier(request: Request): string {
  // Vercel sets x-real-ip at the edge. Outside a trusted proxy use a shared bucket.
  return process.env.VERCEL ? request.headers.get('x-real-ip') || 'unknown' : 'local'
}
