# ============================================================
#  CakeConnection — Dev Server Clean Boot Script
#  Turbopack Cache Wipe + Webpack Fallback + Auto Restart
#  Run: Right-click → "Run with PowerShell"  OR  in terminal:
#       powershell -ExecutionPolicy Bypass -File .\scripts\dev-clean-start.ps1
# ============================================================

# ── STEP 0: Execution Policy Bypass (embedded, no manual step needed) ──
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# ── STEP 1: Lock path to project folder ──
$ProjectPath = "F:\HITESH\CakeConnection-project-June2026\CakeConnection-project-June2026\next-app"
Set-Location -LiteralPath $ProjectPath
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  CakeConnection Dev Clean Boot" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/5] Working Directory: $ProjectPath" -ForegroundColor Green

# ── STEP 2: Kill all Node.js processes (releases file locks on .next cache) ──
Write-Host ""
Write-Host "[2/5] Killing all Node.js processes to release file locks..." -ForegroundColor Yellow
$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcs) {
    $nodeProcs | ForEach-Object {
        Write-Host "    Killing PID $($_.Id) ($($_.ProcessName))" -ForegroundColor Red
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "    All Node.js processes terminated." -ForegroundColor Green
} else {
    Write-Host "    No Node.js processes found (already stopped)." -ForegroundColor Green
}

# ── STEP 3: Wipe BOTH cache locations ──
Write-Host ""
Write-Host "[3/5] Wiping build caches..." -ForegroundColor Yellow

# Old F-drive .next (legacy – may still exist)
$nextFolder = Join-Path $ProjectPath ".next"
if (Test-Path $nextFolder) {
    cmd /c "rd /s /q `"$nextFolder`"" 2>&1 | Out-Null
    Write-Host "    Wiped: $nextFolder" -ForegroundColor Green
} else {
    Write-Host "    F-drive .next: already clean." -ForegroundColor Green
}

# New fast cache on C: drive (set via distDir in next.config.ts)
$fastCache = "C:\tmp\cakeconnection-next"
if (Test-Path $fastCache) {
    cmd /c "rd /s /q `"$fastCache`"" 2>&1 | Out-Null
    Write-Host "    Wiped: $fastCache (fast C: cache)" -ForegroundColor Green
} else {
    Write-Host "    C: cache: already clean." -ForegroundColor Green
}

# Ensure the fast-cache parent dir exists
New-Item -ItemType Directory -Force -Path "C:\tmp" | Out-Null
Write-Host "    C:\tmp ready for next build." -ForegroundColor Green

# ── STEP 4: Verify next.config.ts is the only active config (no duplicate .js conflict) ──
Write-Host ""
Write-Host "[4/5] Checking for duplicate Next.js config files..." -ForegroundColor Yellow
$jsConfig = Join-Path $ProjectPath "next.config.js"
$tsConfig = Join-Path $ProjectPath "next.config.ts"
if ((Test-Path $jsConfig) -and (Test-Path $tsConfig)) {
    $bakName = "next.config.js.conflict-bak"
    Rename-Item -Path $jsConfig -NewName $bakName -Force -ErrorAction SilentlyContinue
    Write-Host "    FIXED: next.config.js renamed to $bakName (conflict resolved)" -ForegroundColor Green
    Write-Host "    Using: next.config.ts (primary config)" -ForegroundColor Green
} elseif (Test-Path $tsConfig) {
    Write-Host "    OK: Only next.config.ts found (no conflict)" -ForegroundColor Green
} elseif (Test-Path $jsConfig) {
    Write-Host "    OK: Only next.config.js found (no conflict)" -ForegroundColor Green
} else {
    Write-Host "    WARNING: No Next.js config file found!" -ForegroundColor Red
}

# ── STEP 5: Force Webpack mode via environment variable (Next.js 16+ fix) ──
Write-Host ""
Write-Host "[5/5] Setting NEXT_TURBOPACK=0 to force Webpack mode (Next.js 16+ fix)..." -ForegroundColor Yellow
$env:NEXT_TURBOPACK = "0"
Write-Host "    OK: NEXT_TURBOPACK=0 set (Webpack will be used instead of Turbopack)" -ForegroundColor Green

# ── LAUNCH ──
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  All checks passed! Launching server" -ForegroundColor Cyan
Write-Host "  Bundler : Webpack (Turbopack DISABLED via env)" -ForegroundColor Cyan
Write-Host "  URL     : http://localhost:3000" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Fix for UNABLE_TO_VERIFY_LEAF_SIGNATURE (Supabase SSL Error)
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
$env:NODE_OPTIONS = "--use-system-ca"
$env:NEXT_TURBOPACK = "0"

npm run dev
