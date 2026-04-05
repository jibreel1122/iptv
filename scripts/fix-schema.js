import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function fixSchema() {
  console.log('Fixing schema and seeding data...')

  // Add missing columns to content_categories
  try {
    await sql`ALTER TABLE content_categories ADD COLUMN IF NOT EXISTS icon VARCHAR(100)`
    console.log('Added icon to content_categories')
  } catch (e) { console.log(e.message) }

  // Add missing columns to content_items  
  try {
    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS description TEXT`
    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS year VARCHAR(10)`
    await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS rating VARCHAR(10)`
    console.log('Added columns to content_items')
  } catch (e) { console.log(e.message) }

  // Add missing columns to reviews
  try {
    await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS country VARCHAR(100)`
    await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS avatar_url TEXT`
    console.log('Added columns to reviews')
  } catch (e) { console.log(e.message) }

  // Add missing columns to themes
  try {
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS slug VARCHAR(100)`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS icon VARCHAR(100)`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS particle_color VARCHAR(50)`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS particle_shape VARCHAR(50)`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS particle_count INTEGER DEFAULT 50`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS particle_speed DECIMAL(3,2) DEFAULT 1.0`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS glow_color VARCHAR(50)`
    await sql`ALTER TABLE themes ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false`
    console.log('Added columns to themes')
  } catch (e) { console.log(e.message) }

  // Add missing columns to orders
  try {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS offer_title VARCHAR(255)`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS offer_price DECIMAL(10,2)`
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'`
    console.log('Added columns to orders')
  } catch (e) { console.log(e.message) }

  // Now seed the data
  // Categories
  const catCount = await sql`SELECT COUNT(*) FROM content_categories`
  if (catCount[0].count === '0') {
    await sql`INSERT INTO content_categories (name, description, icon, position) VALUES
      ('Live Sports', 'Premium sports channels including NFL, NBA, UFC, Soccer and more', 'Trophy', 1),
      ('Movies', 'Latest blockbusters and classic films in stunning quality', 'Film', 2),
      ('TV Series', 'Binge-worthy series from around the world', 'Tv', 3),
      ('Kids', 'Family-friendly content for children of all ages', 'Baby', 4),
      ('News', '24/7 news channels from across the globe', 'Newspaper', 5),
      ('International', 'Channels from 100+ countries in native languages', 'Globe', 6)`
    console.log('Inserted categories')
  }

  // Content items
  const itemCount = await sql`SELECT COUNT(*) FROM content_items`
  if (itemCount[0].count === '0') {
    const cats = await sql`SELECT id, name FROM content_categories ORDER BY position`
    
    for (const c of cats) {
      if (c.name === 'Live Sports') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${c.id}, 'ESPN', 'Live sports coverage', '2024', '9.5', 1),
          (${c.id}, 'Sky Sports', 'Premier League & more', '2024', '9.3', 2),
          (${c.id}, 'beIN Sports', 'Global sports network', '2024', '9.0', 3),
          (${c.id}, 'NFL Network', 'American football', '2024', '9.2', 4),
          (${c.id}, 'NBA TV', 'Basketball coverage', '2024', '9.1', 5),
          (${c.id}, 'UFC Fight Pass', 'MMA & combat sports', '2024', '8.9', 6)`
      }
      if (c.name === 'Movies') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${c.id}, 'Action Movies', 'Latest action blockbusters', '2024', '8.5', 1),
          (${c.id}, 'Comedy Films', 'Laugh out loud comedies', '2024', '8.2', 2),
          (${c.id}, 'Horror Collection', 'Spine-chilling horror', '2024', '8.0', 3),
          (${c.id}, 'Sci-Fi Universe', 'Futuristic adventures', '2024', '8.7', 4),
          (${c.id}, 'Drama Classics', 'Award-winning dramas', '2024', '8.8', 5),
          (${c.id}, 'Family Movies', 'Fun for all ages', '2024', '8.3', 6)`
      }
      if (c.name === 'TV Series') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${c.id}, 'Breaking Bad', 'Crime drama series', '2013', '9.5', 1),
          (${c.id}, 'Game of Thrones', 'Epic fantasy', '2019', '9.3', 2),
          (${c.id}, 'The Office', 'Workplace comedy', '2013', '9.0', 3),
          (${c.id}, 'Stranger Things', 'Sci-fi thriller', '2024', '8.7', 4),
          (${c.id}, 'The Crown', 'Royal drama', '2024', '8.6', 5),
          (${c.id}, 'Wednesday', 'Dark comedy', '2024', '8.4', 6)`
      }
      if (c.name === 'Kids') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${c.id}, 'Disney Channel', 'Family entertainment', '2024', '9.0', 1),
          (${c.id}, 'Cartoon Network', 'Animated shows', '2024', '8.8', 2),
          (${c.id}, 'Nickelodeon', 'Kids programming', '2024', '8.7', 3),
          (${c.id}, 'Nick Jr', 'Preschool content', '2024', '8.5', 4)`
      }
      if (c.name === 'News') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${c.id}, 'CNN', 'Breaking news 24/7', '2024', '8.5', 1),
          (${c.id}, 'BBC World', 'Global news coverage', '2024', '9.0', 2),
          (${c.id}, 'Al Jazeera', 'International perspective', '2024', '8.7', 3),
          (${c.id}, 'Sky News', 'UK and world news', '2024', '8.6', 4)`
      }
      if (c.name === 'International') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${c.id}, 'Arabic Channels', '500+ Arabic channels', '2024', '9.2', 1),
          (${c.id}, 'Hindi Channels', '300+ Indian channels', '2024', '9.0', 2),
          (${c.id}, 'Turkish Channels', '200+ Turkish channels', '2024', '8.8', 3),
          (${c.id}, 'Spanish Channels', '400+ Latino channels', '2024', '8.9', 4)`
      }
    }
    console.log('Inserted content items')
  }

  // Reviews
  const revCount = await sql`SELECT COUNT(*) FROM reviews`
  if (revCount[0].count === '0') {
    await sql`INSERT INTO reviews (username, rating, text, country, position) VALUES
      ('Ahmed K.', 5, 'Best IPTV service I have ever used! Crystal clear quality and no buffering. Highly recommend!', 'UAE', 1),
      ('Sarah M.', 5, 'Amazing channel selection and the 4K quality is incredible. Customer support is very responsive.', 'USA', 2),
      ('Mohammed A.', 5, 'Been using for 6 months now. Very stable and reliable. Worth every penny!', 'Saudi Arabia', 3),
      ('Emma L.', 4, 'Great service with tons of content. Setup was easy and support helped me quickly.', 'UK', 4),
      ('Carlos R.', 5, 'Excellent sports coverage! Never miss a game now. The multi-device feature is perfect for my family.', 'Spain', 5),
      ('Fatima H.', 5, 'Love the variety of channels. Arabic content selection is the best I have found.', 'Morocco', 6)`
    console.log('Inserted reviews')
  }

  // Themes
  const themeCount = await sql`SELECT COUNT(*) FROM themes`
  if (themeCount[0].count === '0') {
    await sql`INSERT INTO themes (name, slug, description, icon, particle_color, particle_shape, particle_count, glow_color, is_default, position) VALUES
      ('Default', 'default', 'Classic purple glow particles', 'Sparkles', '#7B2EFF', 'circle', 50, '#7B2EFF', true, 1),
      ('Sports', 'sports', 'Energetic sports-themed particles', 'Trophy', '#22C55E', 'circle', 60, '#22C55E', false, 2),
      ('Cinema', 'cinema', 'Movie magic golden particles', 'Film', '#F59E0B', 'circle', 45, '#F59E0B', false, 3),
      ('Celebration', 'celebration', 'Festive colorful particles', 'PartyPopper', '#EC4899', 'circle', 70, '#EC4899', false, 4),
      ('Ocean', 'ocean', 'Calm blue water particles', 'Waves', '#0EA5E9', 'circle', 40, '#0EA5E9', false, 5)`
    console.log('Inserted themes')
  }

  // Admin
  const adminCount = await sql`SELECT COUNT(*) FROM admin_users`
  if (adminCount[0].count === '0') {
    const hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
    await sql`INSERT INTO admin_users (email, password_hash, name) VALUES ('admin@studo.com', ${hash}, 'Admin')`
    console.log('Inserted admin user')
  }

  console.log('Schema fix complete!')
}

fixSchema().catch(console.error)
