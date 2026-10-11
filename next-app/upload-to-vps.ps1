# PowerShell Script to Upload CakeConnection to Hostinger VPS
$ErrorActionPreference = "Stop"

$VPS_IP = "200.97.170.53"
$VPS_USER = "root"
$REMOTE_DIR = "/var/www/cakeconnection"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📦 Packaging CakeConnection Next.js..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Remove old archive if exists
if (Test-Path "project.tar.gz") {
    Remove-Item "project.tar.gz" -Force
}

# Create tar.gz archive excluding bulky and build directories
tar -czf project.tar.gz --exclude="node_modules" --exclude=".next" --exclude=".git" .

Write-Host "✅ Archive created: project.tar.gz" -ForegroundColor Green
Write-Host "🚀 Uploading to VPS ($VPS_IP)..." -ForegroundColor Yellow

# Ensure remote folder exists and transfer
ssh ${VPS_USER}@${VPS_IP} "mkdir -p ${REMOTE_DIR}"
scp project.tar.gz ${VPS_USER}@${VPS_IP}:${REMOTE_DIR}/

Write-Host "✅ File uploaded successfully!" -ForegroundColor Green
Write-Host "📂 Extracting files on VPS and launching deployment..." -ForegroundColor Yellow

ssh ${VPS_USER}@${VPS_IP} "cd ${REMOTE_DIR} && tar -xzf project.tar.gz && rm project.tar.gz && chmod +x deploy.sh && ./deploy.sh"

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎉 CAKECONNECTION IS LIVE ON VPS PORT 3001!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
