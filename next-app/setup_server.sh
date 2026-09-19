#!/bin/bash
set -e

echo '--- Phase B: System Update & Node.js Installation ---'
sudo dnf update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs git tar

echo '--- Phase C: PM2 Process Manager Install ---'
sudo npm install -g pm2

echo '--- Phase D: Project Setup & Extraction ---'
cd /home/ec2-user
mkdir -p cakeconnection-website
tar -xzf project.tar.gz -C cakeconnection-website
cd cakeconnection-website
npm install

echo '--- Phase E: Next.js Production Build ---'
npm run build

echo '--- Phase F: Environment Variables Setup ---'
cat <<EOT > .env.production
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://www.cakeconnection.in
EOT

echo '--- Phase G: PM2 Start ---'
cat <<EOT > ecosystem.config.js
module.exports = {
  apps: [{
    name: 'cakeconnection',
    script: 'npm',
    args: 'start',
    cwd: '/home/ec2-user/cakeconnection-website',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: { NODE_ENV: 'production', PORT: 3000 }
  }]
};
EOT
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo '--- Phase H: Nginx Reverse Proxy Setup (AL2023 FIXED) ---'
sudo dnf install -y nginx
cat <<'EOT' | sudo tee /etc/nginx/conf.d/cakeconnection.conf
server {
    listen 80;
    server_name cakeconnection.in www.cakeconnection.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOT
sudo systemctl restart nginx
sudo systemctl enable nginx

echo '--- Phase L: SSL Certificate Setup (AL2023 Supported Pip Method) ---'
sudo dnf install -y python3 augeas-libs
sudo python3 -m venv /opt/certbot
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot

echo '========================================='
echo 'SERVER SETUP COMPLETED SUCCESSFULLY!'
echo '========================================='
