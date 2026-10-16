import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname
  // Ordering and admin use their own signed sessions, not Passport authentication.
  if (['/api', '/admin', '/checkout', '/orders'].some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) return supabaseResponse
  const hasPassportSession = request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-') && cookie.name.includes('auth-token'))
  if (!hasPassportSession) return supabaseResponse

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  await supabase.auth.getUser()

  // Admin pages and mutations verify the signed, expiring session through lib/orders/auth.

  return supabaseResponse
}
