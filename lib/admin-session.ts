import { cookies } from 'next/headers'
import { verifyAdminSessionToken } from '@/lib/auth'

export async function getAdminEmailFromSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return null

  const payload = verifyAdminSessionToken(token)
  return payload?.email || null
}

export async function isAdminAuthenticated() {
  const email = await getAdminEmailFromSession()
  return !!email
}
