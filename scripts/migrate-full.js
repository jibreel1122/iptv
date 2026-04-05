import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  console.log('Starting full database migration...')

  // Settings table for editable content
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value TEXT,
      type VARCHAR(50) DEFAULT 'text',
      label VARCHAR(255),
      category VARCHAR(100) DEFAULT 'general',
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created settings table')

  // Stats table
  await sql`
    CREATE TABLE IF NOT EXISTS stats (
      id SERIAL PRIMARY KEY,
      channels INTEGER DEFAULT 8000,
      movies INTEGER DEFAULT 19000,
      series INTEGER DEFAULT 8500,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created stats table')

  // Offers/Plans table
  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      old_price DECIMAL(10,2),
      badge VARCHAR(100),
      sales_counter INTEGER DEFAULT 0,
      features TEXT[],
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created offers table')

  // Features table
  await sql`
    CREATE TABLE IF NOT EXISTS features (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created features table')

  // Content categories
  await sql`
    CREATE TABLE IF NOT EXISTS content_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created content_categories table')

  // Content items
  await sql`
    CREATE TABLE IF NOT EXISTS content_items (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES content_categories(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      poster_url TEXT,
      year VARCHAR(10),
      rating VARCHAR(10),
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created content_items table')

  // Reviews
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      avatar_url TEXT,
      rating INTEGER DEFAULT 5,
      text TEXT NOT NULL,
      country VARCHAR(100),
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created reviews table')

  // Orders
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      whatsapp_number VARCHAR(50) NOT NULL,
      offer_id INTEGER REFERENCES offers(id),
      offer_title VARCHAR(255),
      offer_price DECIMAL(10,2),
      message TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created orders table')

  // Particle themes
  await sql`
    CREATE TABLE IF NOT EXISTS themes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      particle_color VARCHAR(50),
      particle_shape VARCHAR(50),
      particle_count INTEGER DEFAULT 50,
      particle_speed DECIMAL(3,2) DEFAULT 1.0,
      glow_color VARCHAR(50),
      is_default BOOLEAN DEFAULT false,
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created themes table')

  // Admin users
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      last_login TIMESTAMP
    )
  `
  console.log('Created admin_users table')

  // Images/media storage references
  await sql`
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      alt_text VARCHAR(255),
      category VARCHAR(100),
      filename VARCHAR(255),
      size INTEGER,
      mime_type VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('Created images table')

  // Insert default settings
  const settingsExist = await sql`SELECT COUNT(*) FROM settings`
  if (settingsExist[0].count === '0') {
    await sql`
      INSERT INTO settings (key, value, type, label, category) VALUES
      ('hero_title', 'Experience Premium Entertainment', 'text', 'Hero Title', 'hero'),
      ('hero_subtitle', 'Stream 8000+ live channels, 19000+ movies, and 8500+ series in stunning 4K quality', 'textarea', 'Hero Subtitle', 'hero'),
      ('hero_cta_text', 'Start Watching Now', 'text', 'Hero CTA Button Text', 'hero'),
      ('whatsapp_number', '+1234567890', 'text', 'WhatsApp Contact Number', 'contact'),
      ('whatsapp_message', 'Hi, I want to order the {plan} subscription', 'textarea', 'WhatsApp Default Message', 'contact'),
      ('support_email', 'support@studo.com', 'text', 'Support Email', 'contact'),
      ('brand_name', 'Studo', 'text', 'Brand Name', 'branding'),
      ('brand_tagline', 'Unlimited Entertainment', 'text', 'Brand Tagline', 'branding'),
      ('footer_text', '© 2024 Studo IPTV. All rights reserved.', 'text', 'Footer Copyright', 'footer'),
      ('social_facebook', '', 'text', 'Facebook URL', 'social'),
      ('social_instagram', '', 'text', 'Instagram URL', 'social'),
      ('social_twitter', '', 'text', 'Twitter URL', 'social'),
      ('social_telegram', '', 'text', 'Telegram URL', 'social')
    `
    console.log('Inserted default settings')
  }

  // Insert default stats
  const statsExist = await sql`SELECT COUNT(*) FROM stats`
  if (statsExist[0].count === '0') {
    await sql`INSERT INTO stats (channels, movies, series) VALUES (8000, 19000, 8500)`
    console.log('Inserted default stats')
  }

  // Insert default offers
  const offersExist = await sql`SELECT COUNT(*) FROM offers`
  if (offersExist[0].count === '0') {
    await sql`
      INSERT INTO offers (title, duration, price, old_price, badge, features, position) VALUES
      ('Starter', '1 Month', 9.99, 14.99, NULL, ARRAY['All Live Channels', 'HD Quality', '1 Device', '24/7 Support'], 1),
      ('Popular', '3 Months', 24.99, 39.99, 'Most Popular', ARRAY['All Live Channels', '4K Quality', '2 Devices', '24/7 Support', 'VOD Access'], 2),
      ('Premium', '6 Months', 44.99, 69.99, 'Best Value', ARRAY['All Live Channels', '4K Quality', '3 Devices', 'Priority Support', 'Full VOD Library', 'PPV Events'], 3),
      ('Ultimate', '12 Months', 79.99, 119.99, 'Save 33%', ARRAY['All Live Channels', '4K Quality', '5 Devices', 'VIP Support', 'Full VOD Library', 'PPV Events', 'Adult Channels'], 4)
    `
    console.log('Inserted default offers')
  }

  // Insert default features
  const featuresExist = await sql`SELECT COUNT(*) FROM features`
  if (featuresExist[0].count === '0') {
    await sql`
      INSERT INTO features (title, description, icon, position) VALUES
      ('8000+ Live Channels', 'Access sports, news, entertainment and international channels from around the world', 'Tv', 1),
      ('4K Ultra HD', 'Crystal clear picture quality with support for 4K, Full HD and SD streams', 'Monitor', 2),
      ('Multi-Device Support', 'Watch on Smart TV, Android, iOS, Windows, Mac and streaming devices', 'Smartphone', 3),
      ('VOD Library', 'Massive collection of movies and TV series updated daily', 'Film', 4),
      ('Anti-Freeze Technology', 'Advanced servers ensure smooth, buffer-free streaming experience', 'Zap', 5),
      ('24/7 Support', 'Expert customer support team available around the clock', 'Headphones', 6)
    `
    console.log('Inserted default features')
  }

  // Insert default content categories
  const categoriesExist = await sql`SELECT COUNT(*) FROM content_categories`
  if (categoriesExist[0].count === '0') {
    await sql`
      INSERT INTO content_categories (name, description, icon, position) VALUES
      ('Live Sports', 'Premium sports channels including NFL, NBA, UFC, Soccer and more', 'Trophy', 1),
      ('Movies', 'Latest blockbusters and classic films in stunning quality', 'Film', 2),
      ('TV Series', 'Binge-worthy series from around the world', 'Tv', 3),
      ('Kids', 'Family-friendly content for children of all ages', 'Baby', 4),
      ('News', '24/7 news channels from across the globe', 'Newspaper', 5),
      ('International', 'Channels from 100+ countries in native languages', 'Globe', 6)
    `
    console.log('Inserted default content categories')
  }

  // Insert sample content items
  const itemsExist = await sql`SELECT COUNT(*) FROM content_items`
  if (itemsExist[0].count === '0') {
    // Get category IDs
    const categories = await sql`SELECT id, name FROM content_categories ORDER BY position`
    
    const sportsId = categories.find(c => c.name === 'Live Sports')?.id
    const moviesId = categories.find(c => c.name === 'Movies')?.id
    const seriesId = categories.find(c => c.name === 'TV Series')?.id

    if (sportsId) {
      await sql`
        INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
        (${sportsId}, 'ESPN', 'Live sports coverage', '2024', '9.5', 1),
        (${sportsId}, 'Sky Sports', 'Premier League & more', '2024', '9.3', 2),
        (${sportsId}, 'beIN Sports', 'Global sports network', '2024', '9.0', 3),
        (${sportsId}, 'NFL Network', 'American football', '2024', '9.2', 4),
        (${sportsId}, 'NBA TV', 'Basketball coverage', '2024', '9.1', 5),
        (${sportsId}, 'UFC Fight Pass', 'MMA & combat sports', '2024', '8.9', 6)
      `
    }

    if (moviesId) {
      await sql`
        INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
        (${moviesId}, 'Action Movies', 'Latest action blockbusters', '2024', '8.5', 1),
        (${moviesId}, 'Comedy Films', 'Laugh out loud comedies', '2024', '8.2', 2),
        (${moviesId}, 'Horror Collection', 'Spine-chilling horror', '2024', '8.0', 3),
        (${moviesId}, 'Sci-Fi Universe', 'Futuristic adventures', '2024', '8.7', 4),
        (${moviesId}, 'Drama Classics', 'Award-winning dramas', '2024', '8.8', 5),
        (${moviesId}, 'Family Movies', 'Fun for all ages', '2024', '8.3', 6)
      `
    }

    if (seriesId) {
      await sql`
        INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
        (${seriesId}, 'Breaking Bad', 'Crime drama series', '2013', '9.5', 1),
        (${seriesId}, 'Game of Thrones', 'Epic fantasy', '2019', '9.3', 2),
        (${seriesId}, 'The Office', 'Workplace comedy', '2013', '9.0', 3),
        (${seriesId}, 'Stranger Things', 'Sci-fi thriller', '2024', '8.7', 4),
        (${seriesId}, 'The Crown', 'Royal drama', '2024', '8.6', 5),
        (${seriesId}, 'Wednesday', 'Dark comedy', '2024', '8.4', 6)
      `
    }
    console.log('Inserted sample content items')
  }

  // Insert default reviews
  const reviewsExist = await sql`SELECT COUNT(*) FROM reviews`
  if (reviewsExist[0].count === '0') {
    await sql`
      INSERT INTO reviews (username, rating, text, country, position) VALUES
      ('Ahmed K.', 5, 'Best IPTV service I have ever used! Crystal clear quality and no buffering. Highly recommend!', 'UAE', 1),
      ('Sarah M.', 5, 'Amazing channel selection and the 4K quality is incredible. Customer support is very responsive.', 'USA', 2),
      ('Mohammed A.', 5, 'Been using for 6 months now. Very stable and reliable. Worth every penny!', 'Saudi Arabia', 3),
      ('Emma L.', 4, 'Great service with tons of content. Setup was easy and support helped me quickly.', 'UK', 4),
      ('Carlos R.', 5, 'Excellent sports coverage! Never miss a game now. The multi-device feature is perfect for my family.', 'Spain', 5),
      ('Fatima H.', 5, 'Love the variety of channels. Arabic content selection is the best I have found.', 'Morocco', 6)
    `
    console.log('Inserted default reviews')
  }

  // Insert default themes
  const themesExist = await sql`SELECT COUNT(*) FROM themes`
  if (themesExist[0].count === '0') {
    await sql`
      INSERT INTO themes (name, slug, description, icon, particle_color, particle_shape, particle_count, glow_color, is_default, position) VALUES
      ('Default', 'default', 'Classic purple glow particles', 'Sparkles', '#7B2EFF', 'circle', 50, '#7B2EFF', true, 1),
      ('Sports', 'sports', 'Energetic sports-themed particles', 'Trophy', '#22C55E', 'circle', 60, '#22C55E', false, 2),
      ('Cinema', 'cinema', 'Movie magic golden particles', 'Film', '#F59E0B', 'circle', 45, '#F59E0B', false, 3),
      ('Celebration', 'celebration', 'Festive colorful particles', 'PartyPopper', '#EC4899', 'circle', 70, '#EC4899', false, 4),
      ('Ocean', 'ocean', 'Calm blue water particles', 'Waves', '#0EA5E9', 'circle', 40, '#0EA5E9', false, 5)
    `
    console.log('Inserted default themes')
  }

  // Insert default admin user
  const adminExists = await sql`SELECT COUNT(*) FROM admin_users`
  if (adminExists[0].count === '0') {
    const hash = 'cacc5f9515869d03eede25a0515f6aa85122549d40052613d3da12f87fe14fd0'
    await sql`INSERT INTO admin_users (email, password_hash, name) VALUES ('jibreelemad@gmail.com', ${hash}, 'Admin')`
    console.log('Inserted default admin user')
  }

  console.log('Migration completed successfully!')
}

migrate().catch(console.error)
