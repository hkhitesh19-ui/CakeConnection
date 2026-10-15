# CakeConnection.in — VPS Server Technical Deployment & Operations Guide

> **Production Server**: Hostinger KVM 1 VPS  
> **Operating System**: Ubuntu 22.04 LTS (x86_64)  
> **Server IP**: `187.127.170.36`  
> **Domain**: `cakeconnection.in` (and `www.cakeconnection.in`)  
> **Application Port**: `127.0.0.1:3001`  
> **Database**: Native PostgreSQL 14 (Port 5432)  
> **Last Updated**: 15 October 2026

---

## 1. System Architecture & Topology

```
                   Internet / Visitors
                           │
                           ▼
                  Cloudflare Anycast DNS
             (athena.ns / wilson.ns.cloudflare.com)
            [Edge SSL: Full / CDN & WAF / Proxied]
                           │
                           ▼
              Hostinger KVM 1 VPS (187.127.170.36)
               UFW Firewall (Ports 22, 80, 443)
                           │
                           ▼
                   Nginx Reverse Proxy
        (/etc/nginx/sites-available/cakeconnection.in)
           Port 80 / 443  ➔  http://127.0.0.1:3001
                           │
                           ▼
              PM2 Process Manager (PID 14612)
                 Process: `cakeconnection`
             Dir: `/var/www/CakeConnection/next-app`
                 Command: `npm start -- -p 3001`
                           │
                           ▼
              Native PostgreSQL 14 Database
                  Host: `127.0.0.1:5432`
                 Database: `cakeconnection`
                 User: `postgres` (Superuser)
              10 Core Tables & Master Catalog Seed
```

---

## 2. Server Specifications & Technical Stack

| Component | Technology | Version | Detail |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.2.6` | React 19 Frontend & Server Actions |
| **Runtime** | Node.js LTS | `v22.23.3` | High performance V8 engine |
| **Process Daemon** | PM2 | `7.0.4` | Cluster/fork daemon with systemd reboot |
| **Database** | PostgreSQL | `14.13` | Native Linux package with `uuid-ossp` |
| **Reverse Proxy** | Nginx | `1.18.0` | SSL termination & reverse proxy to `:3001` |
| **SSL / TLS** | Let's Encrypt & Cloudflare | TLS 1.3 / Certbot | Origin SSL + Universal Edge Cloudflare SSL |
| **DNS** | Cloudflare Anycast | Global Edge | Nameservers: `athena.ns`, `wilson.ns` |

---

## 3. Zero-to-One Server Provisioning Steps

To deploy CakeConnection on a fresh Ubuntu 22.04 LTS server:

### 3.1. Install System Dependencies & PostgreSQL 14
```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git build-essential ufw nginx certbot python3-certbot-nginx
apt-get install -y postgresql postgresql-contrib

# Enable and start PostgreSQL service
systemctl enable postgresql
systemctl start postgresql
```

### 3.2. Configure PostgreSQL User & Database
```bash
# Set strong production password for postgres superuser
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'CakeConnectionStrongDbPassword2026!';"

# Create cakeconnection production database
sudo -u postgres psql -c "CREATE DATABASE cakeconnection;"
```

### 3.3. Initialize PostgreSQL Database Schema & Seed Data
```bash
# Execute master schema with 10 tables and catalog seed
sudo -u postgres psql -d cakeconnection -f /var/www/CakeConnection/database/master_postgres_schema.sql
```

The database includes the following 10 core tables:
1. `cake_categories` — Eggless, Premium, Fondant, Pinata, Cheesecakes
2. `products` — Cake catalog items, prices, flavors, tags
3. `product_variants` — Weight sizes (0.5 kg, 1 kg, 1.5 kg, 2 kg)
4. `product_images` — High-resolution cake photos and thumbnails
5. `orders` — Customer checkout orders, delivery address, time slot, delivery date
6. `coupons` — Promotional discount codes & validity rules
7. `reviews` — Customer 5-star testimonials and ratings
8. `site_settings` — Delivery charges, store hours, contact phones
9. `cms_content` — Homepage hero banners, notice ribbons, announcements
10. `user_roles` — Admin and staff role-based permissions

---

## 4. Codebase Deployment & Next.js Build Pipeline

### 4.1. Clone Codebase from GitHub
```bash
mkdir -p /var/www/CakeConnection
cd /var/www/CakeConnection
git clone https://github.com/hkhitesh19-ui/CakeConnection.git .
```

### 4.2. Configure Production Environment File
Path: `/var/www/CakeConnection/next-app/.env.production` (and `.env`):
```bash
cat << 'EOF' > /var/www/CakeConnection/next-app/.env.production
# Database Settings (Local High-Performance PostgreSQL 14)
DATABASE_URL=postgresql://postgres:CakeConnectionStrongDbPassword2026!@127.0.0.1:5432/cakeconnection

# Razorpay Live / Test Settings
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_T65MlFfUSQY1Gp
RAZORPAY_KEY_SECRET=lXyBsTH1AoZ15vXKjaNQvpmD

# Mail Settings (Gmail App Password)
EMAIL_USER=Order.CakeConnection@gmail.com
EMAIL_PASS=ykgjziwnulhnsvag

# Production Site Settings
NEXT_PUBLIC_SITE_URL=https://www.cakeconnection.in
SITE_URL=https://cakeconnection.in
PORT=3001

# Admin Authentication Credentials
ADMIN_EMAIL=admin@cakeconnection.in
ADMIN_PASSWORD=CakeAdmin@2026
EOF

cp /var/www/CakeConnection/next-app/.env.production /var/www/CakeConnection/next-app/.env
```

### 4.3. Install Dependencies & Build Next.js Production Bundle
```bash
cd /var/www/CakeConnection/next-app
npm install --legacy-peer-deps --no-audit
npm run build
```

### 4.4. PM2 Daemon Configuration & Systemd Persistence
```bash
cd /var/www/CakeConnection/next-app
pm2 delete cakeconnection 2>/dev/null || true
PORT=3001 pm2 start npm --name cakeconnection -- start -- -p 3001
pm2 save
pm2 startup systemd -u root --hp /root
```

---

## 5. Nginx Reverse Proxy Configuration

File: `/etc/nginx/sites-available/cakeconnection.in`

```nginx
# CakeConnection Nginx Reverse Proxy (Port 3001)
server {
    listen 80;
    listen [::]:80;
    server_name cakeconnection.in www.cakeconnection.in;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name cakeconnection.in www.cakeconnection.in;

    ssl_certificate /etc/letsencrypt/live/cakeconnection.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cakeconnection.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3001;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### 5.1. Enable Site and Issue Let's Encrypt SSL
```bash
ln -sf /etc/nginx/sites-available/cakeconnection.in /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Issue Let's Encrypt SSL Certificate
certbot --nginx -d cakeconnection.in -d www.cakeconnection.in --non-interactive --agree-tos -m admin@cakeconnection.in
```

---

## 6. Cloudflare DNS & SSL Settings

### 6.1. Cloudflare DNS Records
| Type | Name | Content / Target | Proxy Status | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `cakeconnection.in` | `187.127.170.36` | **Proxied (Orange Cloud)** | Auto |
| **CNAME** | `www` | `cakeconnection.in` | **Proxied (Orange Cloud)** | Auto |

### 6.2. Cloudflare SSL/TLS Settings
- **Encryption Mode**: `Full` (Cloudflare connects to VPS port 443 via Let's Encrypt).
- **Edge Certificates**: Universal SSL Active.
- **Always Use HTTPS**: `ON`.
- **Minimum TLS Version**: `TLS 1.2`.

---

## 7. Admin Dashboard Access & Operational Roles

| Detail | Value |
| :--- | :--- |
| **Admin Login URL** | `https://cakeconnection.in/admin` (or `https://www.cakeconnection.in/admin`) |
| **Admin Email** | `admin@cakeconnection.in` |
| **Admin Password** | `CakeAdmin@2026` |
| **Admin Capabilities**| Manage Orders, Update Products, Add Coupons, Edit Banners, Track Deliveries |

---

## 8. Daily Operations & Maintenance Commands

| Task | Command |
| :--- | :--- |
| **Check PM2 Status** | `pm2 status` |
| **View Live Logs** | `pm2 logs cakeconnection --lines 50` |
| **Restart Application** | `pm2 restart cakeconnection` |
| **Reload with New Env** | `pm2 restart cakeconnection --update-env` |
| **PostgreSQL Shell Access**| `sudo -u postgres psql -d cakeconnection` |
| **PostgreSQL Backup** | `sudo -u postgres pg_dump cakeconnection > /root/backups/cakeconnection_$(date +%Y%m%d).sql` |
| **Check Nginx Config** | `nginx -t` |
| **Reload Nginx** | `systemctl reload nginx` |
| **Restart PostgreSQL** | `systemctl restart postgresql` |

---

## 9. Rollback & Emergency Disaster Recovery

1. **Restore PostgreSQL Database**:
   ```bash
   sudo -u postgres psql -d cakeconnection -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
   sudo -u postgres psql -d cakeconnection -f /root/backups/cakeconnection_latest.sql
   ```
2. **Re-apply Master Seed Data**:
   ```bash
   sudo -u postgres psql -d cakeconnection -f /var/www/CakeConnection/database/master_postgres_schema.sql
   ```
3. **Emergency App Restart**:
   ```bash
   pm2 restart cakeconnection
   ```
