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

-- NOTE:
-- This script intentionally does NOT seed default stats/features/content/reviews/themes/settings.
-- It only creates/migrates schema and keeps admin credentials up to date.

-- Insert default admin user
DELETE FROM admin_users WHERE email = 'admin@studo.com';

INSERT INTO admin_users (email, password_hash)
VALUES ('jibreelemad@gmail.com', 'cacc5f9515869d03eede25a0515f6aa85122549d40052613d3da12f87fe14fd0')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash;
