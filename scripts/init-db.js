import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const sql = neon(databaseUrl)

async function initializeDatabase() {
  try {
    console.log('Initializing Studo IPTV database...')

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        channels INTEGER DEFAULT 8000,
        movies INTEGER DEFAULT 19000,
        series INTEGER DEFAULT 8500,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created stats table')

    await sql`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        old_price DECIMAL(10, 2),
        badge VARCHAR(255),
        features TEXT[],
        sales_counter INTEGER DEFAULT 0,
        position INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created offers table')

    await sql`
      CREATE TABLE IF NOT EXISTS features (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255),
        position INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created features table')

    await sql`
      CREATE TABLE IF NOT EXISTS content_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255),
        position INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created content_categories table')

    await sql`
      CREATE TABLE IF NOT EXISTS content_items (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES content_categories(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        poster_url TEXT,
        thumbnail_url TEXT,
        year VARCHAR(10),
        rating VARCHAR(10),
        position INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created content_items table')

    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        text TEXT NOT NULL,
        position INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created reviews table')

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255),
        whatsapp_number VARCHAR(20) NOT NULL,
        offer_id INTEGER REFERENCES offers(id),
        offer_title VARCHAR(255),
        offer_price DECIMAL(10,2),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created orders table')

    await sql`
      CREATE TABLE IF NOT EXISTS themes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        particles_config JSONB,
        position INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created themes table')

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        value TEXT,
        type VARCHAR(50) DEFAULT 'text',
        label VARCHAR(255),
        category VARCHAR(100) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created settings table')

    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS description TEXT`
    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS thumbnail_url TEXT`
    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS year VARCHAR(10)`
    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS rating VARCHAR(10)`
    await sql`ALTER TABLE content_categories ADD COLUMN IF NOT EXISTS icon VARCHAR(255)`
    await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'text'`
    await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS label VARCHAR(255)`
    await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general'`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)`
    console.log('✓ Applied schema compatibility migrations')

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✓ Created admin_users table')

    // Insert default data
    const statsCheck = await sql`SELECT COUNT(*) as count FROM stats`
    if (statsCheck[0].count === 0) {
      await sql`INSERT INTO stats (channels, movies, series) VALUES (8000, 19000, 8500)`
      console.log('✓ Inserted default stats')
    }

    const offersCheck = await sql`SELECT COUNT(*) as count FROM offers`
    if (offersCheck[0].count === 0) {
      await sql`INSERT INTO offers (title, duration, price, badge, position) VALUES ('اشتراك 3 أشهر', '3 أشهر', 39.00, 'الأكثر طلباً', 0), ('اشتراك 6 أشهر', '6 أشهر', 70.00, 'أفضل سعر', 1), ('اشتراك سنة + 3 أشهر مجاناً', '15 شهر', 119.00, 'عرض قوي', 2), ('اشتراك سنتين', '24 شهر', 220.00, 'الأوفر', 3)`
      console.log('✓ Inserted default offers')
    }

    const featuresCheck = await sql`SELECT COUNT(*) as count FROM features`
    if (featuresCheck[0].count === 0) {
      await sql`INSERT INTO features (title, description, position) VALUES ('Works on all devices', 'Stream on phone, tablet, TV, and more', 0), ('4K / HD quality', 'Watch in stunning HD and 4K resolution', 1), ('No ads', 'Enjoy uninterrupted entertainment', 2), ('Daily updates', 'Fresh content added every day', 3), ('Multi-language', 'Available in multiple languages', 4), ('Sports coverage', 'Live sports and exclusive events', 5)`
      console.log('✓ Inserted default features')
    }

    const categoriesCheck = await sql`SELECT COUNT(*) as count FROM content_categories`
    if (categoriesCheck[0].count === 0) {
      await sql`INSERT INTO content_categories (name, description, position) VALUES ('Movies', 'Stream thousands of movies', 0), ('Series', 'Binge-watch your favorite series', 1), ('Live TV', 'Watch live television channels', 2), ('Sports', 'Live sports events and coverage', 3)`
      console.log('✓ Inserted default content categories')
    }

    const reviewsCheck = await sql`SELECT COUNT(*) as count FROM reviews`
    if (reviewsCheck[0].count === 0) {
      await sql`INSERT INTO reviews (username, rating, text, position) VALUES ('user1234', 5, 'Amazing service! Works perfectly on all my devices.', 0), ('user5678', 5, 'Best IPTV service I''ve ever used. Highly recommended!', 1), ('user9012', 4, 'Great streaming quality and huge content library.', 2), ('user3456', 5, 'Excellent support and fast streaming. Worth every penny.', 3), ('user7890', 5, 'Crystal clear picture quality. Very happy with this!', 4)`
      console.log('✓ Inserted default reviews')
    }

    const themesCheck = await sql`SELECT COUNT(*) as count FROM themes`
    if (themesCheck[0].count === 0) {
      await sql`INSERT INTO themes (name, description, position) VALUES ('Sports', 'Sports themed particles', 0), ('Cinema', 'Cinema themed particles', 1), ('Celebration', 'Celebration themed particles', 2), ('Custom', 'Custom user-uploaded particles', 3)`
      console.log('✓ Inserted default themes')
    }

    const settingsCheck = await sql`SELECT COUNT(*) as count FROM settings`
    if (settingsCheck[0].count === 0) {
      await sql`INSERT INTO settings (key, value, type, label, category) VALUES ('hero_title', 'عيش الترفيه بجودة ممتازة', 'text', 'Hero Title', 'hero'), ('hero_subtitle', 'شاهد آلاف القنوات والأفلام والمسلسلات بجودة 4K', 'textarea', 'Hero Subtitle', 'hero'), ('hero_cta_text', 'اطلب الآن', 'text', 'Hero CTA', 'hero'), ('brand_name', 'Studo', 'text', 'Brand Name', 'branding'), ('whatsapp_number', '+970599765211', 'text', 'WhatsApp Number', 'contact')`
      console.log('✓ Inserted default settings')
    }

    const adminCheck = await sql`SELECT COUNT(*) as count FROM admin_users`
    if (adminCheck[0].count === 0) {
      await sql`INSERT INTO admin_users (email, password_hash) VALUES ('admin@studo.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')`
      console.log('✓ Inserted default admin user')
    }

    console.log('✅ Database initialization complete!')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

initializeDatabase()
