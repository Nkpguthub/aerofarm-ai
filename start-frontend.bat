@echo off
echo ============================================
echo  AeroFarm AI - Installing and Starting...
echo ============================================
cd /d "c:\Users\Mehul\OneDrive\Desktop\aeroponic\frontend"
echo.
echo [1/2] Installing dependencies (this takes 1-2 minutes)...
call npm install
echo.
echo [2/2] Starting development server...
echo  Open your browser to: http://localhost:5173
echo.
call npm run dev
pause
