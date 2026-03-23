@echo off
setlocal
title LUMINOUS AI - Desktop Workspace
color 0B
set WORKDIR=%~dp0
cd /d %WORKDIR%

echo [1/3] Checking for Intelligence Engine (Ollama)...
ollama list >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Ollama is not running! 
    echo Please download it at https://ollama.com and keep it open.
    pause
    exit /b
)

echo [2/3] Validating Orchestrator Models...
ollama list | findstr "qwen2.5:0.5b" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARM-UP] Downloading Router Model (0.5B)...
    ollama pull qwen2.5:0.5b
)

echo [3/3] Launching Luminous AI Deck...
start /b cmd /c "npm run app:dev"

echo.
echo ==============================================
echo 🚀 LUMINOUS AI DESKTOP IS STARTING...
echo Keep this window open while using the app.
echo ==============================================
echo.
pause
