@echo off
echo ==========================================
echo   AeroFarm AI Platform - Starting Servers
echo ==========================================

echo.
echo [1/2] Starting Backend (Spring Boot)...
start "AeroFarm Backend" cmd /k "cd /d C:\Users\Mehul\OneDrive\Desktop\aeroponic\backend && mvn spring-boot:run"

echo [2/2] Starting Frontend (React/Vite)...
start "AeroFarm Frontend" cmd /k "cd /d C:\Users\Mehul\OneDrive\Desktop\aeroponic\frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo - Backend:  http://localhost:8080
echo - Frontend: http://localhost:5173
echo.
echo You can close THIS window safely.
echo To STOP servers, close the "AeroFarm Backend" and "AeroFarm Frontend" windows.
pause
