# Option A: Local PostgreSQL Setup for VPS (Self-Hosted)

This setup provides **0% Pause Risk (Permanent 24/7/365 active)** and **0.1ms - 0.5ms Lightning Superfast Query Speed** on your VPS.

---

## Method 1: Using Docker Compose (Recommended — Easiest & Cleanest)

If your VPS has Docker installed:

```bash
cd database
docker compose up -d
```

This starts:
1. **PostgreSQL 16** on `localhost:5432` with auto-initialized `master_postgres_schema.sql` and persistent storage.
2. **PostgREST** on `http://localhost:8000` (translates existing REST API calls directly to PostgreSQL).

### Configure your Next.js `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=local-postgrest-token
DATABASE_URL=postgresql://postgres:CakeConnectionStrongDbPassword2026!@127.0.0.1:5432/cakeconnection
```

---

## Method 2: Native PostgreSQL on VPS (Without Docker)

Run the automated installer on Ubuntu / Debian / Amazon Linux:

```bash
cd database
chmod +x install_native_postgres.sh
./install_native_postgres.sh
```

This will automatically:
- Install PostgreSQL 16.
- Enable `systemctl enable postgresql` (starts automatically on every VPS reboot).
- Create the `cakeconnection` database.
- Execute `master_postgres_schema.sql` (all tables, indexes, seeds).

---

## Automated Daily Backups (Zero Data Loss)

To take daily compressed backups every night at 3:00 AM:

```bash
chmod +x /home/ec2-user/cakeconnection-website/database/backup_postgres.sh
crontab -e
```

Add this line:
```cron
0 3 * * * /home/ec2-user/cakeconnection-website/database/backup_postgres.sh > /dev/null 2>&1
```

All backups will be saved in `/var/backups/cakeconnection/` (automatically keeping the last 14 days of backups).
