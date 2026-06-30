@echo off
title Yurist AI — Starting...
color 0A

echo.
echo  ==========================================
echo   Yurist AI — Starting servers...
echo  ==========================================
echo.

:: Start backend
echo  [1/2] Starting backend (port 3001)...
start "Yurist AI — Backend" cmd /k "cd /d D:\claude code\lexcis\backend && npm start"

:: Wait for backend to be ready
timeout /t 4 /nobreak >nul

:: Start frontend
echo  [2/2] Starting frontend (port 5174)...
start "Yurist AI — Frontend" cmd /k "cd /d D:\claude code\lexcis\frontend && npm run dev -- --port 5174"

:: Wait then open browser
timeout /t 5 /nobreak >nul
echo.
echo  ==========================================
echo   App is ready!
echo   Local:   http://localhost:5174
echo  ==========================================
echo.
start http://localhost:5174
