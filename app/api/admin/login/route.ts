import { sql } from '@/lib/db'
import { createAdminSessionToken, verifyPassword } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { hasDatabase } from '@/lib/db'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

function verifyFallbackAdminCredentials(email: string, password: string): boolean {
  const fallbackEmail = process.env.ADMIN_EMAIL
  const fallbackPassword = process.env.ADMIN_PASSWORD
  const fallbackPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!fallbackEmail) return false
  if (email !== fallbackEmail) return false

  if (fallbackPasswordHash) {
    return verifyPassword(password, fallbackPasswordHash)
  }

  if (fallbackPassword) {
    return password === fallbackPassword
  }

  return false
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('email,password_hash')
        .eq('email', email)
        .maybeSingle()

      if (error || !user || !verifyPassword(password, user.password_hash)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const cookieStore = await cookies()
      const token = createAdminSessionToken(email)
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      })
      return NextResponse.json({ success: true, email })
    }

    if (!hasDatabase && !hasSupabasePublicConfig) {
      if (!verifyFallbackAdminCredentials(email, password)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const cookieStore = await cookies()
      const token = createAdminSessionToken(email)
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
      })
      return NextResponse.json({ success: true, email })
    }

    // Find admin user
    const users = await sql`
      SELECT * FROM admin_users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Set session cookie
    const cookieStore = await cookies()
    const token = createAdminSessionToken(email)
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({ success: true, email })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
