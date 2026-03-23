@echo off
setlocal
title LUMINOUS AI - Windows Installer Builder
color 0E
set WORKDIR=%~dp0
cd /d %WORKDIR%

echo [1/4] Preparing Workspace (NPM Install)...
call npm install --no-audit >nul 2>&1

echo [2/4] Compiling React Workspace (Next.js Build)...
call npm run build

echo [3/4] Packaging Standalone Desktop App (Electron-Builder)...
call npx electron-builder --win nsis --x64

echo.
echo ====================================================
echo 🎉 LUMINOUS AI INSTALLER IS READY!
echo Check your '/dist' folder for Luminous-AI-Setup.exe
echo ====================================================
echo.
pause
