import { NextResponse } from 'next/server'
import { getAdminEmailFromSession } from '@/lib/admin-session'
import { hasDatabase } from '@/lib/db'

export async function GET() {
  try {
    if (!hasDatabase) {
      return NextResponse.json({ authenticated: true, email: 'admin@studo.com' })
    }
    const email = await getAdminEmailFromSession()
    if (!email) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      email,
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
