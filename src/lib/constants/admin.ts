export const DEFAULT_ADMIN_EMAILS: string[] = [
  'nhathung121225@gmail.com',
  'quocanhnguyencoffee@gmail.com',
  'quocanh.dev@gmail.com',
]

export const ADMIN_PASSKEY = '1212'

export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : []
  
  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...envEmails]))
}

export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false
  const cleanEmail = email.trim().toLowerCase()
  return getAdminEmails().includes(cleanEmail)
}
