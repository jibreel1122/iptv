import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function seed() {
  console.log('Starting data seeding...')

  // Add missing columns to settings if they don't exist
  try {
    await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'text'`
    await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS label VARCHAR(255)`
    await sql`ALTER TABLE settings ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general'`
    console.log('Updated settings table schema')
  } catch (e) {
    console.log('Settings columns already exist or error:', e.message)
  }

  // Clear and insert fresh settings
  await sql`DELETE FROM settings`
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
  console.log('Inserted settings')

  // Insert stats if empty
  const statsCount = await sql`SELECT COUNT(*) FROM stats`
  if (statsCount[0].count === '0') {
    await sql`INSERT INTO stats (channels, movies, series) VALUES (8000, 19000, 8500)`
    console.log('Inserted stats')
  }

  // Insert offers if empty
  const offersCount = await sql`SELECT COUNT(*) FROM offers`
  if (offersCount[0].count === '0') {
    await sql`
      INSERT INTO offers (title, duration, price, old_price, badge, features, position) VALUES
      ('اشتراك 3 أشهر', '3 أشهر', 39.00, 49.00, 'الأكثر طلباً', ARRAY['كل القنوات المباشرة', 'جودة HD/4K', 'دعم 24/7'], 1),
      ('اشتراك 6 أشهر', '6 أشهر', 70.00, 89.00, 'أفضل سعر', ARRAY['مكتبة محتوى كبيرة', 'تحديثات يومية', 'دعم 24/7'], 2),
      ('اشتراك سنة + 3 أشهر مجاناً', '15 شهر', 119.00, 159.00, 'عرض قوي', ARRAY['تفعيل سريع', 'ثبات ممتاز', 'أولوية دعم'], 3),
      ('اشتراك سنتين', '24 شهر', 220.00, 299.00, 'الأوفر', ARRAY['أفضل قيمة', 'محتوى متجدد', 'دعم كامل'], 4)
    `
    console.log('Inserted offers')
  }

  // Insert features if empty
  const featuresCount = await sql`SELECT COUNT(*) FROM features`
  if (featuresCount[0].count === '0') {
    await sql`
      INSERT INTO features (title, description, icon, position) VALUES
      ('8000+ Live Channels', 'Access sports, news, entertainment and international channels from around the world', 'Tv', 1),
      ('4K Ultra HD', 'Crystal clear picture quality with support for 4K, Full HD and SD streams', 'Monitor', 2),
      ('Multi-Device Support', 'Watch on Smart TV, Android, iOS, Windows, Mac and streaming devices', 'Smartphone', 3),
      ('VOD Library', 'Massive collection of movies and TV series updated daily', 'Film', 4),
      ('Anti-Freeze Technology', 'Advanced servers ensure smooth, buffer-free streaming experience', 'Zap', 5),
      ('24/7 Support', 'Expert customer support team available around the clock', 'Headphones', 6)
    `
    console.log('Inserted features')
  }

  // Insert content categories if empty
  const categoriesCount = await sql`SELECT COUNT(*) FROM content_categories`
  if (categoriesCount[0].count === '0') {
    await sql`
      INSERT INTO content_categories (name, description, icon, position) VALUES
      ('Live Sports', 'Premium sports channels including NFL, NBA, UFC, Soccer and more', 'Trophy', 1),
      ('Movies', 'Latest blockbusters and classic films in stunning quality', 'Film', 2),
      ('TV Series', 'Binge-worthy series from around the world', 'Tv', 3),
      ('Kids', 'Family-friendly content for children of all ages', 'Baby', 4),
      ('News', '24/7 news channels from across the globe', 'Newspaper', 5),
      ('International', 'Channels from 100+ countries in native languages', 'Globe', 6)
    `
    console.log('Inserted content categories')
  }

  // Insert content items if empty
  const itemsCount = await sql`SELECT COUNT(*) FROM content_items`
  if (itemsCount[0].count === '0') {
    const categories = await sql`SELECT id, name FROM content_categories ORDER BY position`
    
    const sportsId = categories.find(c => c.name === 'Live Sports')?.id
    const moviesId = categories.find(c => c.name === 'Movies')?.id
    const seriesId = categories.find(c => c.name === 'TV Series')?.id
    const kidsId = categories.find(c => c.name === 'Kids')?.id
    const newsId = categories.find(c => c.name === 'News')?.id
    const intlId = categories.find(c => c.name === 'International')?.id

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

    if (kidsId) {
      await sql`
        INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
        (${kidsId}, 'Disney Channel', 'Family entertainment', '2024', '9.0', 1),
        (${kidsId}, 'Cartoon Network', 'Animated shows', '2024', '8.8', 2),
        (${kidsId}, 'Nickelodeon', 'Kids programming', '2024', '8.7', 3),
        (${kidsId}, 'Nick Jr', 'Preschool content', '2024', '8.5', 4)
      `
    }

    if (newsId) {
      await sql`
        INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
        (${newsId}, 'CNN', 'Breaking news 24/7', '2024', '8.5', 1),
        (${newsId}, 'BBC World', 'Global news coverage', '2024', '9.0', 2),
        (${newsId}, 'Al Jazeera', 'International perspective', '2024', '8.7', 3),
        (${newsId}, 'Sky News', 'UK and world news', '2024', '8.6', 4)
      `
    }

    if (intlId) {
      await sql`
        INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
        (${intlId}, 'Arabic Channels', '500+ Arabic channels', '2024', '9.2', 1),
        (${intlId}, 'Hindi Channels', '300+ Indian channels', '2024', '9.0', 2),
        (${intlId}, 'Turkish Channels', '200+ Turkish channels', '2024', '8.8', 3),
        (${intlId}, 'Spanish Channels', '400+ Latino channels', '2024', '8.9', 4)
      `
    }
    console.log('Inserted content items')
  }

  // Insert reviews if empty
  const reviewsCount = await sql`SELECT COUNT(*) FROM reviews`
  if (reviewsCount[0].count === '0') {
    await sql`
      INSERT INTO reviews (username, rating, text, country, position) VALUES
      ('Ahmed K.', 5, 'Best IPTV service I have ever used! Crystal clear quality and no buffering. Highly recommend!', 'UAE', 1),
      ('Sarah M.', 5, 'Amazing channel selection and the 4K quality is incredible. Customer support is very responsive.', 'USA', 2),
      ('Mohammed A.', 5, 'Been using for 6 months now. Very stable and reliable. Worth every penny!', 'Saudi Arabia', 3),
      ('Emma L.', 4, 'Great service with tons of content. Setup was easy and support helped me quickly.', 'UK', 4),
      ('Carlos R.', 5, 'Excellent sports coverage! Never miss a game now. The multi-device feature is perfect for my family.', 'Spain', 5),
      ('Fatima H.', 5, 'Love the variety of channels. Arabic content selection is the best I have found.', 'Morocco', 6)
    `
    console.log('Inserted reviews')
  }

  // Insert themes if empty
  const themesCount = await sql`SELECT COUNT(*) FROM themes`
  if (themesCount[0].count === '0') {
    await sql`
      INSERT INTO themes (name, slug, description, icon, particle_color, particle_shape, particle_count, glow_color, is_default, position) VALUES
      ('Default', 'default', 'Classic purple glow particles', 'Sparkles', '#7B2EFF', 'circle', 50, '#7B2EFF', true, 1),
      ('Sports', 'sports', 'Energetic sports-themed particles', 'Trophy', '#22C55E', 'circle', 60, '#22C55E', false, 2),
      ('Cinema', 'cinema', 'Movie magic golden particles', 'Film', '#F59E0B', 'circle', 45, '#F59E0B', false, 3),
      ('Celebration', 'celebration', 'Festive colorful particles', 'PartyPopper', '#EC4899', 'circle', 70, '#EC4899', false, 4),
      ('Ocean', 'ocean', 'Calm blue water particles', 'Waves', '#0EA5E9', 'circle', 40, '#0EA5E9', false, 5)
    `
    console.log('Inserted themes')
  }

  // Insert admin user if empty
  const adminCount = await sql`SELECT COUNT(*) FROM admin_users`
  if (adminCount[0].count === '0') {
    const hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
    await sql`INSERT INTO admin_users (email, password_hash, name) VALUES ('admin@studo.com', ${hash}, 'Admin')`
    console.log('Inserted admin user (admin@studo.com / admin123)')
  }

  console.log('Seeding completed successfully!')
}

seed().catch(console.error)
