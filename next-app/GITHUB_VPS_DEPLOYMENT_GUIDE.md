# CakeConnection: Complete Technical Deployment Guide (GitHub ➔ VPS)

This guide documents the automated CI/CD pipeline connecting the GitHub repository to the Hostinger VPS production environment for **CakeConnection** (`cakeconnection.in`), fronted by Cloudflare CDN, DNS, and DDoS protection.

---

## 1. Credentials & Server Architecture

> **Security Note:** Never commit sensitive credentials to public repositories. Environment variables and secrets are maintained in `.env.vps` and `.env.production` (both protected under `.gitignore`).

| Component | Value / Location | Notes |
| :--- | :--- | :--- |
| **Domain** | `https://cakeconnection.in` | Live Production URL |
| **Cloudflare Dashboard** | `dash.cloudflare.com` | Account ID: `300bb7f3583a8ade508c64eabd1d1f1c` |
| **Cloudflare Account Email** | `hk.hitesh19@gmail.com` | Primary Admin Email |
| **Cloudflare Nameservers** | `wilson.ns.cloudflare.com`<br>`athena.ns.cloudflare.com` | Active Anycast DNS |
| **Cloudflare Proxy (CDN)** | Enabled (Proxied 🟧) | Masking real VPS IP (`104.21.17.209`, etc.) |
| **Cloudflare SSL/TLS Mode** | Full (or Flexible) | Provides free auto-renewing HTTPS certificate |
| **Hostinger VPS IP** | `200.97.170.53` | Hostinger Linux VPS (Origin Server) |
| **SSH User / Port** | `root` / Port `22` | Standard SSH Access |
| **VPS Root Password** | Stored securely in `.env.vps` | Used for SSH / SFTP authentication |
| **GitHub Repo** | `https://github.com/hkhitesh19-ui/CakeConnection.git` | Public Repository |
| **GitHub User** | `hkhitesh19-ui` | Repository Owner |
| **GitHub Token (PAT)** | Stored securely in `.env.vps` | Classic PAT with `repo` scope |
| **VPS App Root** | `/var/www/CakeConnection` | Cloned Git repository |
| **Next.js Project** | `/var/www/CakeConnection/next-app` | Production runtime folder |
| **PM2 Process** | `cakeconnection` (Process ID 5) | Port `3001` (Internal) |
| **Nginx Reverse Proxy** | `/etc/nginx/sites-available/cakeconnection` | Proxies `cakeconnection.in:80` ➔ `127.0.0.1:3001` |
| **VPS Deploy Script** | `/var/www/CakeConnection/deploy.sh` | Automated pull, build & reload script |
| **Local 1-Click Script**| `next-app/git-deploy-to-vps.ps1` | Local PowerShell automated deployment |

---

## 2. Cloudflare Network Architecture & Traffic Flow

The production traffic follows a 3-layer enterprise flow:

```
[Customer Browser / Mobile]
            │
            ▼ (HTTPS : 443)
[Cloudflare Edge Network]
  ├── Anycast DNS (`athena` & `wilson.ns.cloudflare.com`)
  ├── Real VPS IP Masking (Hides `200.97.170.53` from attackers)
  ├── Edge Caching (Photos, CSS, JS cached in Mumbai/Ahmedabad edge nodes)
  ├── Web Application Firewall (WAF) & Bot Fight Mode
  └── Free SSL/TLS Padlock (HTTPS Certificate)
            │
            ▼ (Proxy Pass to Origin IP: 200.97.170.53)
[Hostinger VPS (Ubuntu)]
  ├── Nginx Web Server (Listens on Port 80, routes traffic to localhost:3001)
  └── PM2 Process Manager (`cakeconnection` running Next.js App on Port 3001)
```

---

## 3. Quick Deploy: 1-Click Automated (Recommended)

When you make changes in your local development environment:

1. Open PowerShell and navigate to `next-app`:
   ```powershell
   cd F:\HITESH\CakeConnection-project-June2026\CakeConnection-project-June2026\next-app
   ```
2. Run the deployment script:
   ```powershell
   .\git-deploy-to-vps.ps1
   ```

### What this script does automatically:
1. Pushes all local commits to GitHub (`github main`).
2. Connects to the VPS via SSH using credentials from `.env.vps`.
3. Executes `/var/www/CakeConnection/deploy.sh` on the VPS.
4. Streams the build output live to your PowerShell console.
5. Re-loads the PM2 service with zero downtime in ~30–40 seconds.
6. Cloudflare automatically picks up the fresh app routes without downtime.

---

## 4. Manual Deployment Steps

If you need to deploy manually or troubleshoot:

### Step 4.1: Push from Local to GitHub
```bash
cd F:\HITESH\CakeConnection-project-June2026\CakeConnection-project-June2026\next-app
git add .
git commit -m "feat/fix: your commit message"
git push github main
```

### Step 4.2: Connect to VPS via SSH
```bash
ssh root@200.97.170.53
# Enter VPS root password when prompted
```

### Step 4.3: Execute Deployment Script on VPS
```bash
/var/www/CakeConnection/deploy.sh
```

---

## 5. Under the Hood: What `/var/www/CakeConnection/deploy.sh` Executes

```bash
#!/bin/bash
set -e

# 1. Fetch latest changes from GitHub
echo '=== 1. Pulling latest commits from GitHub ==='
cd /var/www/CakeConnection
git pull origin main

# 2. Build the Next.js Production App
echo '=== 2. Building Next.js App ==='
cd /var/www/CakeConnection/next-app
npm install --legacy-peer-deps
npm run build

# 3. Reload PM2 with Zero-Downtime
echo '=== 3. Zero-downtime PM2 reload ==='
pm2 reload cakeconnection --update-env
pm2 save
echo '=== CAKECONNECTION IS LIVE FROM GITHUB! ==='
```

---

## 6. Health Check & Diagnostics

Run these commands to verify complete system status:

```bash
# 1. Check PM2 status
pm2 list
pm2 describe cakeconnection

# 2. View real-time application logs
pm2 logs cakeconnection --lines 30

# 3. Verify internal Next.js response on VPS
curl -I http://127.0.0.1:3001

# 4. Check Nginx proxy status
systemctl status nginx
nginx -t

# 5. Check Cloudflare DNS resolution (from any terminal)
nslookup cakeconnection.in
# Should return Cloudflare Anycast IPs (e.g., 104.21.17.209), NOT the VPS IP
```
