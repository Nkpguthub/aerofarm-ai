@echo off
:: ============================================================
::   AeroFarm AI - Service Manager
::   Use this to Start / Stop / Restart services anytime
:: ============================================================
color 0B
echo.
echo  ============================================
echo    AeroFarm AI Platform - Service Manager
echo  ============================================
echo.
echo  [1] Start  both servers
echo  [2] Stop   both servers
echo  [3] Restart both servers
echo  [4] Check  status
echo  [5] View   Backend  logs
echo  [6] View   Frontend logs
echo  [7] Exit
echo.
set /p choice="  Enter choice (1-7): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto stop_all
if "%choice%"=="3" goto restart_all
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs_backend
if "%choice%"=="6" goto logs_frontend
if "%choice%"=="7" exit
goto menu

:start_all
echo.
echo Starting AeroFarm Backend...
sc start AeroFarm-Backend
echo Starting AeroFarm Frontend...
sc start AeroFarm-Frontend
echo.
echo Done! Visit http://localhost:5173
pause & goto menu

:stop_all
echo.
echo Stopping AeroFarm Backend...
sc stop AeroFarm-Backend
echo Stopping AeroFarm Frontend...
sc stop AeroFarm-Frontend
echo.
echo Both servers stopped.
pause & goto menu

:restart_all
echo.
echo Restarting services...
sc stop AeroFarm-Backend
sc stop AeroFarm-Frontend
timeout /t 3 /nobreak >nul
sc start AeroFarm-Backend
sc start AeroFarm-Frontend
echo Done!
pause & goto menu

:status
echo.
sc query AeroFarm-Backend
echo.
sc query AeroFarm-Frontend
echo.
pause & goto menu

:logs_backend
start notepad "C:\Users\Mehul\OneDrive\Desktop\aeroponic\logs\backend-stdout.log"
goto menu

:logs_frontend
start notepad "C:\Users\Mehul\OneDrive\Desktop\aeroponic\logs\frontend-stdout.log"
goto menu

:menu
cls
goto :eof
