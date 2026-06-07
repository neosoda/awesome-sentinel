import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const emailHeader = process.env.AUTHENTIK_EMAIL_HEADER ?? 'x-authentik-email'
    const email = request.headers.get(emailHeader)

    if (!email) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    if (!adminEmails.includes(email.toLowerCase())) {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    // Pass email info to headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-email', email)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
