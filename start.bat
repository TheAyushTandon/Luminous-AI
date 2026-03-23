@echo off
echo ====================================
echo   Luminous AI - Startup Script
echo ====================================
echo.

REM Check if Ollama is running
echo [1/4] Checking Ollama status...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Ollama is not running!
    echo Please start Ollama in another terminal:
    echo    ollama serve
    echo.
    echo Or download from: https://ollama.ai
    echo.
    pause
    exit /b 1
)
echo [OK] Ollama is running
echo.

REM Check if models are available
echo [2/4] Checking for AI models...
ollama list 2>nul | find "llama" >nul
if %errorlevel% neq 0 (
    echo [WARNING] No Llama model found!
    echo Pulling llama3.1:8b... This may take a while.
    ollama pull llama3.1:8b
)
echo [OK] Models are ready
echo.

REM Start the servers
echo [3/4] Starting Luminous AI...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo [4/4] Launching application...
echo.

REM Run both servers
start "Luminous AI - Backend" cmd /k "cd /d "%~dp0" && npm run server"
timeout /t 2 /nobreak >nul
start "Luminous AI - Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ====================================
echo   Luminous AI is starting up!
echo ====================================
echo.
echo Access the app at: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill the servers
taskkill /FI "WindowTitle eq Luminous AI - Backend*" /F >nul 2>&1
taskkill /FI "WindowTitle eq Luminous AI - Frontend*" /F >nul 2>&1
echo.
echo Servers stopped.
