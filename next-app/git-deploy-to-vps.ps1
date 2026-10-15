# 1-Click Deployment: Push to GitHub -> Auto-Deploy on Hostinger VPS
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 1. Pushing commits to GitHub..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

git push github main

Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host "🚀 2. Triggering automated deploy on VPS..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$pyScript = @"
import paramiko, sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.170.36', username='root', password='Nilsky@202627')
stdin, stdout, stderr = ssh.exec_command('/var/www/CakeConnection/deploy.sh')
for line in iter(stdout.readline, ''):
    print(line, end='', flush=True)
ssh.close()
"@

python -c $pyScript

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🎉 CAKECONNECTION IS LIVE ON VPS!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
