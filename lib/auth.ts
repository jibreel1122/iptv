import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

function base64Url(input: string) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export function createAdminSessionToken(email: string): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.DATABASE_URL || 'studo-admin-secret'
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64Url(JSON.stringify({ email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  const data = `${header}.${payload}`
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${data}.${signature}`
}

export function verifyAdminSessionToken(token: string): { email: string } | null {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.DATABASE_URL || 'studo-admin-secret'
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [header, payload, signature] = parts
  const data = `${header}.${payload}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  if (expected !== signature) return null

  try {
    const decoded = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    if (!decoded.email || !decoded.exp || Date.now() > decoded.exp) return null
    return { email: decoded.email }
  } catch {
    return null
  }
}
