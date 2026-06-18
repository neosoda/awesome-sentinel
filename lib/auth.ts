import { headers } from 'next/headers'

/**
 * Server-side admin authorization.
 *
 * The reverse proxy (Authentik) injects the authenticated user's email via a
 * configurable header, and `proxy.ts` mirrors it to `x-admin-email` for admin
 * routes. Because Next.js Server Actions are executed as POST requests to the
 * route where they are defined — NOT necessarily an `/admin` route — the proxy
 * matcher alone is not a reliable authorization boundary.
 *
 * Every mutating server action must therefore re-verify admin access via
 * `requireAdmin()` (defense in depth). See:
 * https://nextjs.org/docs/app/api-reference/file-conventions/proxy#execution-order
 */

const ADMIN_EMAIL_HEADER = 'x-admin-email'
const AUTHENTIK_EMAIL_HEADER = process.env.AUTHENTIK_EMAIL_HEADER ?? 'x-authentik-email'

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Reads the authenticated admin email from request headers.
 * Returns null when no authenticated admin can be proven.
 */
export async function getAdminEmail(): Promise<string | null> {
  const headerList = await headers()
  // Prefer the header set by proxy.ts, fall back to the raw Authentik header.
  const email =
    headerList.get(ADMIN_EMAIL_HEADER) ?? headerList.get(AUTHENTIK_EMAIL_HEADER)
  if (!email) return null

  const normalized = email.trim().toLowerCase()
  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) return null
  return adminEmails.includes(normalized) ? normalized : null
}

/**
 * Returns true when the current request is from a configured admin.
 */
export async function isAdmin(): Promise<boolean> {
  return (await getAdminEmail()) !== null
}

/**
 * Throws when the current request is not from a configured admin.
 * Use at the top of every mutating server action.
 */
export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail()
  if (!email) {
    // Throwing here ensures the action can never proceed, even if a caller
    // forgets to check the return value.
    throw new Error('UNAUTHORIZED')
  }
  return email
}
