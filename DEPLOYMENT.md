# Studo IPTV - Deployment & Setup Guide

## 🚀 Quick Deployment to Vercel

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial Studo IPTV commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/studo-iptv.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in or create account
3. Click "New Project"
4. Import your GitHub repository
5. Select the repository

### Step 3: Configure Environment Variables

In Vercel Project Settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string

```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/studo
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

Your app will be live at: `https://your-project.vercel.app`

---

## 🗄️ Database Setup (Neon)

### 1. Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create new project
3. Select PostgreSQL version 15+
4. Get your connection string:
   ```
   postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/database
   ```

### 2. Initialize Database

After deploying to Vercel:

```bash
# Option 1: Via API call (if setup script is enabled)
curl -X POST https://your-app.vercel.app/api/admin/session

# Option 2: Run locally before deploying
DATABASE_URL="your_connection_string" node scripts/migrate-full.js
DATABASE_URL="your_connection_string" node scripts/setup-admin.js
```

### 3. Verify Database

```bash
# Connect to your Neon database
psql "postgresql://user:password@host/database"

# Check tables
\dt

# Check admin user
SELECT * FROM admin_users;
```

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Update WhatsApp contact number
- [ ] Configure CORS for your domain
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up rate limiting for APIs
- [ ] Configure firewall rules
- [ ] Backup database regularly
- [ ] Monitor error logs
- [ ] Setup email notifications

### Change Admin Password

1. Login to admin dashboard
2. Go to Settings
3. Update admin credentials in database:

```bash
# Via psql
UPDATE admin_users SET password_hash = 'hashed_password' WHERE email = 'admin@studo.com';
```

---

## 🎨 Customization Guide

### Update Branding

**Update WhatsApp Contact:**
```typescript
// components/contact-section.tsx
const whatsappContact = '+1234567890' // Change this
```

**Update Colors:**
```css
/* app/globals.css */
@theme inline {
  --color-primary: #7B2EFF;
  --color-accent: #EC4899;
  --color-background: #050019;
}
```

**Update Company Info:**
Use the admin dashboard to update:
- Platform name
- Contact email
- Social links
- Support information

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel Dashboard
2. Select your project
3. Navigate to **Analytics**
4. View real-time metrics:
   - Page views
   - Response times
   - Error rates

### Application Monitoring

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/next'

// Already included in the project
<Analytics />
```

### Database Monitoring

Via Neon Console:

1. Login to Neon
2. Select your project
3. View:
   - Query performance
   - Connection metrics
   - Storage usage

---

## 🔄 Continuous Integration

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Get Required Tokens

1. Visit [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create new token → `VERCEL_TOKEN`
3. Get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from project settings
4. Add to GitHub Secrets

---

## 📈 Scaling & Performance

### Database Optimization

```sql
-- Create indexes for faster queries
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_content_category ON content_items(category);
```

### CDN & Image Optimization

The project uses Next.js Image component automatically:

```typescript
<Image
  src="/image.jpg"
  alt="Description"
  width={1200}
  height={630}
  priority
/>
```

### Caching Strategy

- Static pages: 60 seconds
- API routes: 30 seconds
- Images: 365 days

---

## 🆘 Troubleshooting

### Database Connection Errors

**Error**: `ECONNREFUSED`

```bash
# Solution: Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Admin Login Not Working

**Error**: `401 Unauthorized`

```bash
# Check admin user exists
psql $DATABASE_URL -c "SELECT * FROM admin_users;"

# Recreate admin user if needed
node scripts/setup-admin.js
```

### Images Not Loading

**Solution**: 
1. Check Vercel Image Optimization is enabled
2. Verify image paths are correct
3. Check CORS headers

### Slow API Responses

**Solutions**:
1. Add database indexes
2. Optimize queries
3. Enable query caching
4. Check Neon dashboard for slowlog

---

## 📞 Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Community
- [Next.js Discord](https://discord.gg/bUG33z4NWc)
- [Vercel Community](https://github.com/vercel)
- [Neon Community](https://discord.gg/wmjNHFtV)

### Contact
- Website: https://studo.tv
- Email: support@studo.tv
- WhatsApp: +970599765211

---

## 🔄 Backup & Recovery

### Database Backup

```bash
# Backup to file
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

### Environment Variables Backup

Keep a secure copy of:
- DATABASE_URL
- Admin credentials
- API keys

### Code Backup

Always keep your code in GitHub:

```bash
git push origin main
```

---

## 📋 Pre-Launch Checklist

- [ ] Database is initialized
- [ ] Admin user is created
- [ ] Environment variables are set
- [ ] WhatsApp integration is configured
- [ ] Content is added (offers, features, reviews)
- [ ] Contact information is updated
- [ ] SEO metadata is customized
- [ ] Admin password is changed
- [ ] Email notifications are configured
- [ ] Analytics are enabled
- [ ] SSL/HTTPS is verified
- [ ] Domain is pointing to Vercel
- [ ] Database backups are configured
- [ ] Monitoring alerts are set
- [ ] Rate limiting is configured

---

## 🎉 Post-Launch

### Monitor Performance

1. Check Vercel Analytics daily for first week
2. Monitor error logs for issues
3. Track user engagement
4. Monitor database performance

### Gather Feedback

- Add feedback form
- Monitor customer reviews
- Track support inquiries
- Analyze user behavior

### Iterate & Improve

- A/B test CTAs
- Optimize conversion funnel
- Add new features
- Improve performance

---

Last Updated: 2024
Version: 1.0.0
