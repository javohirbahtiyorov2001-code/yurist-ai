@echo off
title Yurist AI — Share with Investors
color 0B

echo.
echo  ==========================================
echo   Yurist AI — Creating public URL...
echo  ==========================================
echo.
echo  Make sure the app is running first (start.bat)
echo.
echo  Starting Cloudflare Tunnel...
echo  Your public URL will appear in a few seconds.
echo  Look for the line that says "trycloudflare.com"
echo.
echo  Share that URL with investors - no password needed!
echo.
echo  Press Ctrl+C to stop sharing.
echo  ==========================================
echo.

%TEMP%\cloudflared.exe tunnel --url http://localhost:5174
