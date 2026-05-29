@echo off
echo ===================================================
echo Starting InternTrack Pro - Development Servers
echo ===================================================

echo Starting Backend Server...
start "Backend (Server)" cmd /k "cd server && npm run dev"

echo Starting Frontend Server...
start "Frontend (Client)" cmd /k "cd client && npm run dev"

echo Servers are booting up in new windows!
echo Once they are ready, you can access the app at: http://localhost:5173
echo ===================================================
pause
