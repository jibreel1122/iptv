-- Studo IPTV Database Schema

-- Safe migrations for existing databases
ALTER TABLE IF EXISTS settings ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'text';
ALTER TABLE IF EXISTS settings ADD COLUMN IF NOT EXISTS label VARCHAR(255);
ALTER TABLE IF EXISTS settings ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'general';
ALTER TABLE IF EXISTS settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE IF EXISTS content_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE IF EXISTS content_items ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE IF EXISTS content_items ADD COLUMN IF NOT EXISTS year VARCHAR(10);
ALTER TABLE IF EXISTS content_items ADD COLUMN IF NOT EXISTS rating VARCHAR(10);

ALTER TABLE IF EXISTS content_categories ADD COLUMN IF NOT EXISTS icon VARCHAR(255);
ALTER TABLE IF EXISTS orders ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Stats table (hero section numbers)
CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  channels INTEGER DEFAULT 8000,
  movies INTEGER DEFAULT 19000,
  series INTEGER DEFAULT 8500,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offers table
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
);

-- Features table
CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  position INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content categories
CREATE TABLE IF NOT EXISTS content_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  position INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content items
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
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
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
);

-- Themes (particle themes)
CREATE TABLE IF NOT EXISTS themes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  particles_config JSONB,
  position INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text',
  label VARCHAR(255),
  category VARCHAR(100) DEFAULT 'general',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supabase permissions (URL + anon key mode)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

ALTER TABLE IF EXISTS stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS features DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS content_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS content_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS themes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;

-- Insert default stats
INSERT INTO stats (channels, movies, series)
SELECT 8000, 19000, 8500
WHERE NOT EXISTS (SELECT 1 FROM stats);

-- Insert default features (only for missing positions)
INSERT INTO features (title, description, position)
SELECT v.title, v.description, v.position
FROM (
  VALUES
    ('Works on all devices', 'Stream on phone, tablet, TV, and more', 0),
    ('4K / HD quality', 'Watch in stunning HD and 4K resolution', 1),
    ('No ads', 'Enjoy uninterrupted entertainment', 2),
    ('Daily updates', 'Fresh content added every day', 3),
    ('Multi-language', 'Available in multiple languages', 4),
    ('Sports coverage', 'Live sports and exclusive events', 5)
) AS v(title, description, position)
WHERE NOT EXISTS (
  SELECT 1
  FROM features f
  WHERE f.position = v.position
);

-- Insert default content categories (only for missing positions)
INSERT INTO content_categories (name, description, position)
SELECT v.name, v.description, v.position
FROM (
  VALUES
    ('Movies', 'Stream thousands of movies', 0),
    ('Series', 'Binge-watch your favorite series', 1),
    ('Live TV', 'Watch live television channels', 2),
    ('Sports', 'Live sports events and coverage', 3)
) AS v(name, description, position)
WHERE NOT EXISTS (
  SELECT 1
  FROM content_categories c
  WHERE c.position = v.position
);

-- Insert default reviews (only for missing positions)
INSERT INTO reviews (username, rating, text, position)
SELECT v.username, v.rating, v.text, v.position
FROM (
  VALUES
    ('user1234', 5, 'Amazing service! Works perfectly on all my devices.', 0),
    ('user5678', 5, 'Best IPTV service I''ve ever used. Highly recommended!', 1),
    ('user9012', 4, 'Great streaming quality and huge content library.', 2),
    ('user3456', 5, 'Excellent support and fast streaming. Worth every penny.', 3),
    ('user7890', 5, 'Crystal clear picture quality. Very happy with this!', 4)
) AS v(username, rating, text, position)
WHERE NOT EXISTS (
  SELECT 1
  FROM reviews r
  WHERE r.position = v.position
);

-- Insert default themes (only for missing positions)
INSERT INTO themes (name, description, position)
SELECT v.name, v.description, v.position
FROM (
  VALUES
    ('Sports', 'Sports themed particles', 0),
    ('Cinema', 'Cinema themed particles', 1),
    ('Celebration', 'Celebration themed particles', 2),
    ('Custom', 'Custom user-uploaded particles', 3)
) AS v(name, description, position)
WHERE NOT EXISTS (
  SELECT 1
  FROM themes t
  WHERE t.position = v.position
);

-- Insert default settings
INSERT INTO settings (key, value, type, label, category) VALUES
('hero_title', 'عيش الترفيه بجودة ممتازة', 'text', 'Hero Title', 'hero'),
('hero_subtitle', 'شاهد آلاف القنوات والأفلام والمسلسلات بجودة 4K', 'textarea', 'Hero Subtitle', 'hero'),
('hero_cta_text', 'اطلب الآن', 'text', 'Hero CTA', 'hero'),
('brand_name', 'Studo', 'text', 'Brand Name', 'branding'),
('whatsapp_number', '+970599765211', 'text', 'WhatsApp Number', 'contact')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  label = EXCLUDED.label,
  category = EXCLUDED.category,
  updated_at = CURRENT_TIMESTAMP;

-- Insert default admin user
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@studo.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
ON CONFLICT (email) DO NOTHING;
