# Studo IPTV - Premium Entertainment Streaming Platform

A modern, fully-featured IPTV subscription platform built with Next.js 16, React 19, Framer Motion, Neon PostgreSQL, and Tailwind CSS.

## ✨ Features

### 🎬 Frontend
- **Premium Dark Theme**: Sophisticated purple/slate gradient design with glow effects
- **Animated Particle Background**: Dynamic particle systems with 4 themes (Sports, Cinema, Celebration, Custom)
- **Smooth Animations**: Framer Motion animations throughout for premium feel
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Multiple Content Sections**:
  - Hero section with animated CTAs
  - Dynamic pricing plans (Offers)
  - Feature showcase with icons
  - Content carousel (Movies, Series, Channels)
  - Customer reviews with star ratings
  - Contact/Order form with WhatsApp integration
  - SEO-optimized footer

### 💼 Admin Dashboard
- **Complete Content Management**: Manage all platform content
  - Orders tracking and management
  - Pricing plans (Offers) CRUD
  - Features editor
  - Reviews management
  - Content items (movies, series, channels)
  - Theme management
  - Settings configuration
- **Real-time Statistics**: Dashboard with key metrics
  - Total orders
  - Revenue tracking
  - Active subscriptions
  - Content breakdown

### 🗄️ Database
- **Neon PostgreSQL**: Serverless PostgreSQL with full feature set
- **11 Core Tables**:
  - `admin_users` - Admin authentication
  - `settings` - Platform configuration
  - `stats` - Platform statistics
  - `offers` - Subscription plans
  - `features` - Service features
  - `content_categories` - Content organization
  - `content_items` - Movies, series, channels
  - `reviews` - Customer testimonials
  - `orders` - Order tracking
  - `themes` - Particle themes
  - `images` - Image management

### 🔌 API Routes
All API routes follow RESTful conventions with proper error handling and validation.

#### Public Routes
- `GET /api/stats` - Platform statistics
- `GET /api/settings` - Public settings
- `GET /api/offers` - Available subscription plans
- `GET /api/features` - Platform features
- `GET /api/content` - Content items
- `GET /api/reviews` - Customer reviews
- `GET /api/themes` - Available particle themes
- `POST /api/orders` - Create new order

#### Admin Routes (Protected)
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Check session status
- `GET /api/admin/stats` - Get/Update statistics
- `GET/POST/DELETE /api/admin/offers` - Manage offers
- `GET/POST/DELETE /api/admin/features` - Manage features
- `GET/POST/DELETE /api/admin/reviews` - Manage reviews
- `GET/POST/DELETE /api/admin/content` - Manage content
- `POST /api/admin/settings` - Update settings

### 🎨 Design System
- **Color Palette**:
  - Primary: Purple (#7B2EFF)
  - Accent: Pink (#EC4899) & Cyan
  - Neutral: Slate/Black gradients
- **Typography**: Inter font with semantic sizing
- **Spacing**: Tailwind spacing scale (4px base)
- **Animations**: Framer Motion with preset easing curves
- **Visual Effects**: Glow, blur, shadows with gradient backgrounds

### 🔐 Security
- **Authentication**: Session-based admin auth with HTTP-only cookies
- **Authorization**: Admin route protection via session checks
- **Data Validation**: Server-side input validation
- **SQL Injection Prevention**: Parameterized queries via Neon
- **CORS**: Configured for safe API access

### 📱 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Neon PostgreSQL account

### Environment Variables
Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host/database
```

### Installation Steps

1. **Install Dependencies**
```bash
pnpm install
```

2. **Setup Database**
```bash
# The database should be automatically initialized
# If needed, run migrations:
node scripts/migrate-full.js
node scripts/seed-data.js
node scripts/setup-admin.js
```

3. **Run Development Server**
```bash
pnpm dev
```

4. **Access the Platform**
- Homepage: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

### Default Admin Credentials
- **Email**: admin@studo.com
- **Password**: admin123

⚠️ **IMPORTANT**: Change these in production!

## 📁 Project Structure

```
studo-iptv/
├── app/
│   ├── api/                   # API routes
│   │   ├── stats/
│   │   ├── settings/
│   │   ├── offers/
│   │   ├── features/
│   │   ├── content/
│   │   ├── reviews/
│   │   ├── themes/
│   │   ├── orders/
│   │   └── admin/             # Admin protected routes
│   ├── admin/
│   │   ├── layout.tsx         # Admin sidebar layout
│   │   ├── login/             # Admin login page
│   │   └── dashboard/         # Dashboard pages
│   │       ├── page.tsx       # Main dashboard
│   │       ├── orders/
│   │       ├── offers/
│   │       ├── features/
│   │       ├── reviews/
│   │       ├── content/
│   │       ├── themes/
│   │       └── settings/
│   ├── layout.tsx             # Root layout with SEO
│   ├── globals.css            # Global styles & design tokens
│   └── page.tsx               # Homepage
├── components/
│   ├── admin/                 # Admin-specific components
│   ├── particle-background.tsx    # Animated particle canvas
│   ├── theme-switcher.tsx         # Theme selector
│   ├── hero-section.tsx           # Hero with CTA
│   ├── offers-section.tsx         # Pricing cards
│   ├── features-section.tsx       # Feature grid
│   ├── content-showcase.tsx       # Content carousel
│   ├── reviews-section.tsx        # Reviews carousel
│   ├── contact-section.tsx        # Order form
│   ├── footer.tsx                 # Footer
│   ├── error-boundary.tsx         # Error handling
│   └── skeleton-card.tsx          # Loading states
├── lib/
│   ├── db.ts                  # Database client & types
│   ├── animations.ts          # Framer Motion presets
│   ├── seo.ts                 # SEO utilities & schemas
│   └── auth.ts                # Auth utilities
├── public/
│   ├── robots.txt             # SEO robots directive
│   └── sitemap.xml            # XML sitemap
├── scripts/
│   ├── migrate-full.js        # Full schema migration
│   ├── seed-data.js           # Data seeding
│   ├── setup-admin.js         # Admin user setup
│   ├── add-columns.js         # Schema updates
│   └── fix-schema.js          # Schema fixes
└── package.json
```

## 🎯 Admin Dashboard Navigation

### Main Dashboard
- Real-time metrics (orders, revenue, subscriptions)
- Content breakdown (channels, movies, series)
- Quick stats overview

### Orders Management
- View all customer orders
- Track order status
- Monitor revenue
- See customer WhatsApp numbers

### Offers (Pricing Plans)
- Create new subscription plans
- Edit plan details and pricing
- Delete inactive plans
- Set duration and features

### Features Management
- Add platform features
- Edit feature descriptions
- Delete old features
- Organize feature list

### Reviews Management
- Add customer testimonials
- Set star ratings
- Remove fake/spam reviews
- Showcase customer feedback

### Content Management
- Add movies, series, channels
- Organize by category
- Add descriptions
- Manage content library

### Themes Management
- View available particle themes
- Preview theme effects
- Configure theme options
- View theme descriptions

### Settings
- Edit platform text content
- Configure social links
- Manage WhatsApp contact
- Update platform settings

## 🎨 Customization

### Changing Colors
Edit `app/globals.css` design tokens:

```css
@theme inline {
  --color-primary: #7B2EFF;
  --color-accent: #EC4899;
  --color-background: #050019;
}
```

### Adding Content via API
```bash
# Create an offer
curl -X POST http://localhost:3000/api/admin/offers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Premium Plus",
    "price": 29.99,
    "description": "All channels + 4K"
  }'
```

### Modifying Particle Themes
Create new theme in admin dashboard or database:

```sql
INSERT INTO themes (name, particle_type, description)
VALUES ('Love', 'hearts', 'Heart-shaped particles');
```

## 📊 Database Schema

### stats
```sql
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  total_channels INTEGER,
  total_movies INTEGER,
  total_series INTEGER,
  updated_at TIMESTAMP
);
```

### offers
```sql
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  price DECIMAL(10, 2),
  description TEXT,
  duration_days INTEGER
);
```

### orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  whatsapp_number VARCHAR(20),
  offer_id INTEGER REFERENCES offers(id),
  offer_title VARCHAR(255),
  offer_price DECIMAL(10, 2),
  message TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

For full schema, see migration scripts in `/scripts`.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add `DATABASE_URL` environment variable
3. Deploy automatically on push

```bash
vercel env add DATABASE_URL
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Self-Hosted

1. Build the project: `pnpm build`
2. Start production server: `pnpm start`
3. Use reverse proxy (nginx) for SSL
4. Setup PostgreSQL database
5. Configure environment variables

## 🔍 SEO Features

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ JSON-LD structured data (Organization, Product)
- ✅ Sitemap (sitemap.xml)
- ✅ Robots.txt with crawl rules
- ✅ Canonical tags
- ✅ Semantic HTML structure
- ✅ Alt text for images
- ✅ Mobile-friendly viewport

## 📦 Dependencies

### Core
- `next`: ^16.0.0
- `react`: ^19.0.0
- `typescript`: ^5.0.0

### UI & Animations
- `framer-motion`: ^11.15.0
- `tailwindcss`: ^4.0.0
- `lucide-react`: Icons

### Database
- `@neondatabase/serverless`: PostgreSQL client

### Forms & Validation
- `react-hook-form`: Form management

### Utilities
- `sonner`: Toast notifications
- `@vercel/analytics`: Analytics

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Admin Login Issues
- Clear browser cookies
- Verify admin user exists: `SELECT * FROM admin_users;`
- Check password is correct (case-sensitive)
- Try login with different browser

### Styling Issues
```bash
# Clear cache and rebuild
rm -rf .next
pnpm build
```

### Animation Performance
- Check if GPU acceleration is enabled
- Reduce particle count in particle-background.tsx
- Use `will-change` CSS property sparingly

## 📖 API Examples

### Get All Offers
```javascript
const response = await fetch('/api/offers');
const offers = await response.json();
```

### Create Order
```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    whatsapp_number: '+970599765211',
    offer_id: 1,
    offer_title: 'Premium',
    offer_price: 19.99,
    message: 'Start my subscription'
  })
});
```

### Admin: Create Offer
```javascript
const response = await fetch('/api/admin/offers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Ultra Premium',
    price: 49.99,
    description: 'Everything + VIP support'
  })
});
```

## 🤝 Contributing

Contributions are welcome! Follow the existing code style and conventions:

- Use TypeScript for type safety
- Follow Tailwind CSS conventions
- Use Framer Motion for animations
- Keep components small and reusable
- Write semantic HTML

## 📝 License

Proprietary - Studo IPTV 2024

## 📞 Support

- **Website**: https://studo.tv
- **WhatsApp**: +970599765211
- **Email**: support@studo.tv
- **Admin Email**: admin@studo.com

---

**Built with ❤️ for premium entertainment streaming.**

Last Updated: 2024 | Version: 1.0.0
