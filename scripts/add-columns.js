import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function addColumns() {
  console.log('Adding missing columns...')

  // Add features column to offers
  try {
    await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS features TEXT[]`
    console.log('Added features column to offers')
  } catch (e) {
    console.log('offers.features:', e.message)
  }

  // Update offers with features
  await sql`UPDATE offers SET features = ARRAY['All Live Channels', 'HD Quality', '1 Device', '24/7 Support'] WHERE title = 'Starter' AND features IS NULL`
  await sql`UPDATE offers SET features = ARRAY['All Live Channels', '4K Quality', '2 Devices', '24/7 Support', 'VOD Access'] WHERE title = 'Popular' AND features IS NULL`
  await sql`UPDATE offers SET features = ARRAY['All Live Channels', '4K Quality', '3 Devices', 'Priority Support', 'Full VOD Library', 'PPV Events'] WHERE title = 'Premium' AND features IS NULL`
  await sql`UPDATE offers SET features = ARRAY['All Live Channels', '4K Quality', '5 Devices', 'VIP Support', 'Full VOD Library', 'PPV Events', 'Adult Channels'] WHERE title = 'Ultimate' AND features IS NULL`
  console.log('Updated offers with features')

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
    
    for (const cat of categories) {
      if (cat.name === 'Live Sports') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${cat.id}, 'ESPN', 'Live sports coverage', '2024', '9.5', 1),
          (${cat.id}, 'Sky Sports', 'Premier League & more', '2024', '9.3', 2),
          (${cat.id}, 'beIN Sports', 'Global sports network', '2024', '9.0', 3),
          (${cat.id}, 'NFL Network', 'American football', '2024', '9.2', 4),
          (${cat.id}, 'NBA TV', 'Basketball coverage', '2024', '9.1', 5),
          (${cat.id}, 'UFC Fight Pass', 'MMA & combat sports', '2024', '8.9', 6)`
      }
      if (cat.name === 'Movies') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${cat.id}, 'Action Movies', 'Latest action blockbusters', '2024', '8.5', 1),
          (${cat.id}, 'Comedy Films', 'Laugh out loud comedies', '2024', '8.2', 2),
          (${cat.id}, 'Horror Collection', 'Spine-chilling horror', '2024', '8.0', 3),
          (${cat.id}, 'Sci-Fi Universe', 'Futuristic adventures', '2024', '8.7', 4),
          (${cat.id}, 'Drama Classics', 'Award-winning dramas', '2024', '8.8', 5),
          (${cat.id}, 'Family Movies', 'Fun for all ages', '2024', '8.3', 6)`
      }
      if (cat.name === 'TV Series') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${cat.id}, 'Breaking Bad', 'Crime drama series', '2013', '9.5', 1),
          (${cat.id}, 'Game of Thrones', 'Epic fantasy', '2019', '9.3', 2),
          (${cat.id}, 'The Office', 'Workplace comedy', '2013', '9.0', 3),
          (${cat.id}, 'Stranger Things', 'Sci-fi thriller', '2024', '8.7', 4),
          (${cat.id}, 'The Crown', 'Royal drama', '2024', '8.6', 5),
          (${cat.id}, 'Wednesday', 'Dark comedy', '2024', '8.4', 6)`
      }
      if (cat.name === 'Kids') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${cat.id}, 'Disney Channel', 'Family entertainment', '2024', '9.0', 1),
          (${cat.id}, 'Cartoon Network', 'Animated shows', '2024', '8.8', 2),
          (${cat.id}, 'Nickelodeon', 'Kids programming', '2024', '8.7', 3),
          (${cat.id}, 'Nick Jr', 'Preschool content', '2024', '8.5', 4)`
      }
      if (cat.name === 'News') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${cat.id}, 'CNN', 'Breaking news 24/7', '2024', '8.5', 1),
          (${cat.id}, 'BBC World', 'Global news coverage', '2024', '9.0', 2),
          (${cat.id}, 'Al Jazeera', 'International perspective', '2024', '8.7', 3),
          (${cat.id}, 'Sky News', 'UK and world news', '2024', '8.6', 4)`
      }
      if (cat.name === 'International') {
        await sql`INSERT INTO content_items (category_id, title, description, year, rating, position) VALUES
          (${cat.id}, 'Arabic Channels', '500+ Arabic channels', '2024', '9.2', 1),
          (${cat.id}, 'Hindi Channels', '300+ Indian channels', '2024', '9.0', 2),
          (${cat.id}, 'Turkish Channels', '200+ Turkish channels', '2024', '8.8', 3),
          (${cat.id}, 'Spanish Channels', '400+ Latino channels', '2024', '8.9', 4)`
      }
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
    console.log('Inserted admin user')
  }

  console.log('Done!')
}

addColumns().catch(console.error)
