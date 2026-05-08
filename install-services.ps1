# ============================================================
#   AeroFarm AI Platform - Windows Service Installer
#   Run this script as Administrator!
# ============================================================

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host ""
    Write-Host "❌ ERROR: Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell → 'Run as administrator', then run this script again." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

$ProjectRoot = "C:\Users\Mehul\OneDrive\Desktop\aeroponic"
$NssmDir     = "$ProjectRoot\tools\nssm"
$NssmExe     = "$NssmDir\nssm.exe"
$LogsDir     = "$ProjectRoot\logs"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AeroFarm AI - Windows Service Installer  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Create folders ───────────────────────────────────
Write-Host "[1/5] Creating required folders..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $NssmDir  | Out-Null
New-Item -ItemType Directory -Force -Path $LogsDir  | Out-Null
Write-Host "      ✅ Done" -ForegroundColor Green

# ── Step 2: Download NSSM ───────────────────────────────────
Write-Host "[2/5] Downloading NSSM (service manager)..." -ForegroundColor Yellow

if (Test-Path $NssmExe) {
    Write-Host "      ✅ NSSM already downloaded, skipping." -ForegroundColor Green
} else {
    try {
        $NssmZip = "$NssmDir\nssm.zip"
        Invoke-WebRequest -Uri "https://nssm.cc/release/nssm-2.24.zip" -OutFile $NssmZip -UseBasicParsing
        Expand-Archive -Path $NssmZip -DestinationPath $NssmDir -Force

        # Find the nssm.exe inside the extracted folder (64-bit)
        $Extracted = Get-ChildItem -Path $NssmDir -Recurse -Filter "nssm.exe" | Where-Object { $_.FullName -like "*win64*" } | Select-Object -First 1
        if ($null -eq $Extracted) {
            $Extracted = Get-ChildItem -Path $NssmDir -Recurse -Filter "nssm.exe" | Select-Object -First 1
        }
        Copy-Item -Path $Extracted.FullName -Destination $NssmExe -Force
        Remove-Item $NssmZip -Force
        Write-Host "      ✅ NSSM downloaded successfully." -ForegroundColor Green
    } catch {
        Write-Host "      ❌ Failed to download NSSM: $_" -ForegroundColor Red
        Write-Host "      Please check your internet connection and try again." -ForegroundColor Yellow
        pause
        exit 1
    }
}

# ── Step 3: Detect node & mvn paths ─────────────────────────
Write-Host "[3/5] Detecting Node.js and Maven paths..." -ForegroundColor Yellow

$NodeCmd  = Get-Command node -ErrorAction SilentlyContinue
$NpmCmd   = Get-Command npm  -ErrorAction SilentlyContinue
$MvnCmd   = Get-Command mvn  -ErrorAction SilentlyContinue
$NodePath = if ($NodeCmd) { $NodeCmd.Source } else { $null }
$NpmPath  = if ($NpmCmd)  { $NpmCmd.Source  } else { $null }
$MvnPath  = if ($MvnCmd)  { $MvnCmd.Source  } else { $null }

if (-not $NodePath) { Write-Host "      ❌ Node.js not found in PATH! Install Node.js first." -ForegroundColor Red; pause; exit 1 }
if (-not $MvnPath)  { Write-Host "      ❌ Maven (mvn) not found in PATH! Install Maven first." -ForegroundColor Red; pause; exit 1 }

$NodeDir = Split-Path $NodePath
Write-Host "      ✅ Node : $NodePath" -ForegroundColor Green
Write-Host "      ✅ npm  : $NpmPath"  -ForegroundColor Green
Write-Host "      ✅ mvn  : $MvnPath"  -ForegroundColor Green

# ── Step 4: Create wrapper batch files ──────────────────────
Write-Host "[4/5] Creating service launcher scripts..." -ForegroundColor Yellow

# Backend launcher
$BackendBat = "$ProjectRoot\run-backend.bat"
@"
@echo off
cd /d "$ProjectRoot\backend"
call mvn spring-boot:run
"@ | Set-Content -Path $BackendBat -Encoding ASCII

# Frontend launcher  
$FrontendBat = "$ProjectRoot\run-frontend.bat"
@"
@echo off
cd /d "$ProjectRoot\frontend"
call npm run dev
"@ | Set-Content -Path $FrontendBat -Encoding ASCII

Write-Host "      ✅ Launcher scripts created." -ForegroundColor Green

# ── Step 5: Register Windows Services ───────────────────────
Write-Host "[5/5] Registering Windows Services..." -ForegroundColor Yellow

$CmdExe = "$env:SystemRoot\System32\cmd.exe"

# ── Backend Service ──────────────────────────────────────────
$BackendService = "AeroFarm-Backend"
Write-Host ""
Write-Host "      → Installing: $BackendService" -ForegroundColor Cyan

# Remove if already exists
$existing = Get-Service -Name $BackendService -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "        Removing old service..." -ForegroundColor Gray
    & $NssmExe stop   $BackendService | Out-Null
    & $NssmExe remove $BackendService confirm | Out-Null
    Start-Sleep -Seconds 2
}

& $NssmExe install $BackendService $CmdExe "/c `"$BackendBat`""
& $NssmExe set     $BackendService AppDirectory "$ProjectRoot\backend"
& $NssmExe set     $BackendService DisplayName  "AeroFarm AI - Backend (Spring Boot)"
& $NssmExe set     $BackendService Description  "AeroFarm AI Platform Spring Boot backend server"
& $NssmExe set     $BackendService Start        SERVICE_AUTO_START
& $NssmExe set     $BackendService AppStdout    "$LogsDir\backend-stdout.log"
& $NssmExe set     $BackendService AppStderr    "$LogsDir\backend-stderr.log"
& $NssmExe set     $BackendService AppRotateFiles 1
& $NssmExe set     $BackendService AppRotateSeconds 86400
& $NssmExe set     $BackendService AppEnvironmentExtra "JAVA_OPTS=-Xmx512m"
Write-Host "        ✅ Backend service installed." -ForegroundColor Green

# ── Frontend Service ─────────────────────────────────────────
$FrontendService = "AeroFarm-Frontend"
Write-Host ""
Write-Host "      → Installing: $FrontendService" -ForegroundColor Cyan

$existing = Get-Service -Name $FrontendService -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "        Removing old service..." -ForegroundColor Gray
    & $NssmExe stop   $FrontendService | Out-Null
    & $NssmExe remove $FrontendService confirm | Out-Null
    Start-Sleep -Seconds 2
}

& $NssmExe install $FrontendService $CmdExe "/c `"$FrontendBat`""
& $NssmExe set     $FrontendService AppDirectory "$ProjectRoot\frontend"
& $NssmExe set     $FrontendService DisplayName  "AeroFarm AI - Frontend (Vite/React)"
& $NssmExe set     $FrontendService Description  "AeroFarm AI Platform Vite React frontend server"
& $NssmExe set     $FrontendService Start        SERVICE_AUTO_START
& $NssmExe set     $FrontendService AppStdout    "$LogsDir\frontend-stdout.log"
& $NssmExe set     $FrontendService AppStderr    "$LogsDir\frontend-stderr.log"
& $NssmExe set     $FrontendService AppRotateFiles 1
& $NssmExe set     $FrontendService AppRotateSeconds 86400
Write-Host "        ✅ Frontend service installed." -ForegroundColor Green

# ── Start Services ───────────────────────────────────────────
Write-Host ""
Write-Host "Starting services now..." -ForegroundColor Yellow
& $NssmExe start $BackendService
Start-Sleep -Seconds 3
& $NssmExe start $FrontendService

# ── Summary ──────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ Installation Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Services registered (auto-start on boot):" -ForegroundColor White
Write-Host "  • AeroFarm-Backend   → http://localhost:8080" -ForegroundColor Green
Write-Host "  • AeroFarm-Frontend  → http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "  Manage services via:" -ForegroundColor White
Write-Host "  • Windows Services app  (services.msc)" -ForegroundColor Gray
Write-Host "  • Or use: manage-services.bat in project root" -ForegroundColor Gray
Write-Host ""
Write-Host "  Log files saved to: $LogsDir" -ForegroundColor Gray
Write-Host ""
pause
