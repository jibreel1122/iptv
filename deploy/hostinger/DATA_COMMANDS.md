# Data Backup / Restore Commands

## Supabase (preferred)
Use Supabase dashboard backups for safest full backups.

## Postgres direct backup (if DATABASE_URL is used)

### Export
```bash
pg_dump "$DATABASE_URL" > /opt/iptv_studo/backups/studo_$(date +%F_%H-%M).sql
```

### Import
```bash
psql "$DATABASE_URL" < /opt/iptv_studo/backups/studo_YYYY-MM-DD_HH-MM.sql
```

## Quick admin data check
```sql
SELECT id, full_name, whatsapp_number, offer_title, offer_price, status, created_at
FROM orders
ORDER BY created_at DESC;
```
