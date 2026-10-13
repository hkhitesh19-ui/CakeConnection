# Cake Connection — Master Context Document

> [!IMPORTANT]
> **[System Override: Enable Ultra-Low Token Mode]**
> 1. Pure files ko read karne ki jagah pehle Graphify database (graphify query) se reference lo.
> 2. Koi bhi code edit karte waqt sirf surgical changes (chote specific patches) karo, poore code files output mat karo.
> 3. Har query ka reply bilkul concise (chota aur seedha), simple words me aur sirf points me do.
> 4. Faltu details, background explanations ya code explanations mat likho jab tak mai khud na puchu.
> 5. **Date, TimeStamp & Git ID Rule:** Every response must start with the current Date & TimeStamp (IST) and Local Git Commit Hash.
> 6. Context Counter 80% reach hone par session summary aur Master Context Document update offer karo.

---

> **Single Source of Truth** for project architecture, server credentials, live deployment, decisions, and system capabilities.
> **Last Updated:** 2026-10-13 09:13 IST.
> **Current Synchronized Git Commit ID:** `382b828`

---

## 1. Project Overview & Environments
- **Project Name:** CakeConnection — Online 100% Eggless Live Cake Bakery, Flowers & Celebrations.
- **Market:** Vadodara, Gujarat, India (2-hour express delivery + guaranteed midnight delivery).
- **Live Production URL:** [https://cakeconnection.in](https://cakeconnection.in)
- **Local Working Directory:** `F:\HITESH\CakeConnection-project-June2026\CakeConnection-project-June2026\next-app`
- **GitHub Repository (Public):** [https://github.com/hkhitesh19-ui/CakeConnection.git](https://github.com/hkhitesh19-ui/CakeConnection.git)
- **Primary Git Branch:** `main` (Tracks `github/main`)

---

## 2. Server & Cloud Infrastructure

### A. Cloudflare Edge Network (Front-Layer)
- **Cloudflare Account ID:** `300bb7f3583a8ade508c64eabd1d1f1c`
- **Admin Email:** `hk.hitesh19@gmail.com`
- **Nameservers:** `wilson.ns.cloudflare.com` & `athena.ns.cloudflare.com`
- **Proxy Status:** Proxied 🟧 (Anycast IPs `104.21.17.209`, `172.67.178.79`)
- **SSL/TLS Mode:** Full (Auto-renewing HTTPS Padlock)
- **Protection:** Real VPS IP masking, DDoS mitigation, Bot Fight Mode, edge asset caching.

### B. Hostinger VPS (Origin Server)
- **IP Address:** `200.97.170.53` (Port 22 SSH)
- **User / Credentials:** `root` / Stored in `.env.vps`
- **Web Server:** Nginx (Proxy passes `cakeconnection.in:80` ➔ `http://127.0.0.1:3001`)
- **Process Manager:** PM2 (App Name: `cakeconnection`, Process ID 5, Cluster mode on Port 3001)
- **Production Git Root:** `/var/www/CakeConnection`
- **Next.js App Root:** `/var/www/CakeConnection/next-app`
- **Automated Deploy Script:** `/var/www/CakeConnection/deploy.sh`

---

## 3. Tech Stack & Architecture
- **Framework:** Next.js 16.2.6 (Turbopack, App Router) + React 19 + TypeScript.
- **Styling:** Tailwind CSS v4.
- **State Management:** Zustand (with persist for cart).
- **Database / Persistent Storage:** 
  - **Primary High-Speed Storage:** `serverProductStore.ts` + `products-store.json` (disk-persisted, in-memory sync, zero external network dependency).
  - **Self-Hosted Database:** Local PostgreSQL on VPS (`localhost:5432 / localhost:8000`).
  - **Cloud Supabase:** Permanently removed/disabled to eliminate 2-5s DNS timeout delays (`ENOTFOUND`).
- **Payment Gateway:** Razorpay (Test mode active).
- **Email / SMTP:** Nodemailer (Order.CakeConnection@gmail.com).

---

## 4. Automated CI/CD & Deployment Workflow

### ⚡ 1-Click Automated Deployment (Local PowerShell)
```powershell
cd F:\HITESH\CakeConnection-project-June2026\CakeConnection-project-June2026\next-app
.\git-deploy-to-vps.ps1
```
*Executes `git push github main` ➔ Triggers `/var/www/CakeConnection/deploy.sh` via SSH ➔ Rebuilds Next.js Turbopack ➔ Zero-downtime PM2 reload.*

### 🛠️ Manual Deployment Commands (VPS)
```bash
ssh root@200.97.170.53
/var/www/CakeConnection/deploy.sh
```

---

## 5. Marketing & Content Engine (Instagram Agent Skills)
Installed in `.agents/skills/` and global config:
1. **`/ig-reel`** — 26 Hook formulas, hook scoring engine (`hookscore.py`), timed beat sheet (`beats.py`).
2. **`/ig-caption`** — First 125 chars feed linting & hashtag analyzer (`caption.py`).
3. **`/ig-carousel`** — High-swipe carousel slide copy generator.
4. **`/ig-story`** — Daily story sequencing & DM conversion funnels.
5. **`/ig-profile`** — 12-point rubric profile optimizer (`rubric.json`).
6. **`/ig-plan`** — 7-day weekly content calendar.
7. **`/ig-human`** — AI slop stripper & detection scorer (`detect.py`, `humanize.py`).
8. **Brand Voice:** Stored at `.agents/instagram/voice.md` (100% pure eggless, live bakery, 2-hr Vadodara delivery).

---

## 6. Key Files & Reference Documentation
- `GITHUB_VPS_DEPLOYMENT_GUIDE.md` — Complete technical deployment manual.
- `next-app/.env.vps` — Master credentials file (VPS, GitHub, Cloudflare, Database). Protected by `.gitignore`.
- `next-app/.env.production` — Production runtime environment for Next.js.
- `next-app/src/lib/serverProductStore.ts` — Server-side persistent storage engine.
- `next-app/src/data/products-store.json` — JSON disk store for cake prices and overrides.
- `next-app/src/data/realCakesData.ts` — Real cake catalog definitions.
- `.agents/rules/user_instructions.md` — Agent rules (IST Timestamp, Git ID, Ultra-Low Token mode).

---

## 7. Recently Resolved Issues (Milestones)
- **Price Reset on Refresh Bug:** Fixed by routing admin edits to `serverProductStore.ts` and `products-store.json`. Tested & verified on live VPS.
- **Dead Supabase DNS Delays:** Removed dead cloud URLs from `.env.local` and `.env.production`. Response times dropped to ~120ms.
- **Git Deployment Migration:** Moved from 141MB manual tar archives to automated Git-based pull & PM2 zero-downtime deployment.
- **Cloudflare Integration:** Fully mapped DNS, SSL Full mode, and reverse proxy topology documented.
