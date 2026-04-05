# Hostinger VPS Deployment (Studo IPTV)

## 1. Clone and install

```bash
cd /opt
git clone https://github.com/jibreel1122/iptv.git iptv_studo
cd /opt/iptv_studo
npm ci
```

## 2. Configure environment (single easy place)

```bash
cp .env.production.example .env
nano .env
```

All keys are stored in one file:
- `/opt/iptv_studo/.env`

## 3. Build and run

```bash
npm run build
npm run start
```

## 4. Keep app running (PM2)

```bash
npm i -g pm2
pm2 start npm --name studo-iptv -- start
pm2 save
pm2 startup
```

## 5. Nginx reverse proxy (optional but recommended)

Use Nginx to route your domain to `http://127.0.0.1:3000`.

## 6. Update app

```bash
cd /opt/iptv_studo
git pull
npm ci
npm run build
pm2 restart studo-iptv
```

## 7. Database schema apply (Supabase SQL editor)

Run:
- `scripts/init-db.sql`

This script now creates/migrates schema without injecting default content each run.

## Security note

Do not commit `.env` or real keys to git.
Only keep them in `/opt/iptv_studo/.env` on VPS.
