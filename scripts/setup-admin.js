import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const sql = neon(databaseUrl)

function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password)
    .digest('hex')
}

async function setupAdmin() {
  try {
    console.log('Setting up admin user...')

    const email = 'admin@studo.com'
    const password = 'admin123'
    const passwordHash = hashPassword(password)

    // Check if admin already exists
    const existing = await sql`
      SELECT * FROM admin_users WHERE email = ${email}
    `

    if (existing.length > 0) {
      console.log('✓ Admin user already exists')
      return
    }

    // Create admin user
    await sql`
      INSERT INTO admin_users (email, password_hash)
      VALUES (${email}, ${passwordHash})
    `

    console.log('✓ Admin user created successfully')
    console.log('')
    console.log('Login Credentials:')
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${password}`)
    console.log('')
    console.log('Admin Dashboard: http://localhost:3000/admin/dashboard')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setupAdmin()
