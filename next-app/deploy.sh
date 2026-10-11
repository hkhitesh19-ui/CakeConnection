#!/bin/bash
set -e

echo "=========================================="
echo "🚀 CakeConnection Deployment Starting..."
echo "=========================================="

APP_DIR="/var/www/cakeconnection"
cd "$APP_DIR"

# 1. Check Node.js & PM2
echo "📦 Checking Node.js and PM2..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js 20 LTS first."
    exit 1
fi
if ! command -v pm2 &> /dev/null; then
    echo "⚡ Installing PM2 globally..."
    npm install -g pm2
fi

# 2. Setup .env.production if missing
if [ ! -f .env.production ] && [ -f .env.local ]; then
    echo "📋 Copying .env.local to .env.production..."
    cp .env.local .env.production
fi

# 3. Install dependencies
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

# 4. Build Next.js App
echo "🏗️ Building Next.js production build..."
npm run build

# 5. Start / Reload with PM2 on Port 3001
echo "🔄 Starting/Restarting CakeConnection PM2 process..."
if pm2 describe cakeconnection > /dev/null 2>&1; then
    pm2 reload cakeconnection --update-env
else
    pm2 start ecosystem.config.js
fi
pm2 save

# 6. Setup Nginx Virtual Host if not present
echo "🌐 Checking Nginx Configuration..."
if [ ! -f /etc/nginx/sites-available/cakeconnection ]; then
    echo "📝 Copying cakeconnection.nginx.conf to /etc/nginx/sites-available/cakeconnection..."
    cp cakeconnection.nginx.conf /etc/nginx/sites-available/cakeconnection
    ln -sf /etc/nginx/sites-available/cakeconnection /etc/nginx/sites-enabled/cakeconnection
    
    echo "🔍 Testing Nginx syntax..."
    nginx -t
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
else
    echo "✅ Nginx configuration already exists."
fi

echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "App running on http://127.0.0.1:3001"
echo "=========================================="
