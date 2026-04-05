import { NextResponse } from 'next/server'
import { getAdminEmailFromSession } from '@/lib/admin-session'

export async function GET() {
  try {
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
