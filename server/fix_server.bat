@echo off
echo ===================================================
echo   AUTOMATED SERVER RESTART SCRIPT
echo ===================================================

echo 1. Clearing port 5001...
powershell -Command "Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force }"

echo.
echo 2. Starting Tarot Server...
echo (If this window stays open, the server is running!)
echo.

node src/server.js

echo.
echo Server stopped or crashed.
pause
