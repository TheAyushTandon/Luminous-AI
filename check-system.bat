@echo off
echo ====================================
echo   Luminous AI - System Check
echo ====================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Node.js is not installed
    echo Please install from: https://nodejs.org
    echo.
) else (
    for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i installed
)
echo.

REM Check npm
echo [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] npm is not installed
) else (
    for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm %%i installed
)
echo.

REM Check Ollama
echo [3/5] Checking Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Ollama is not installed
    echo Please install from: https://ollama.ai
    echo.
) else (
    for /f "tokens=*" %%i in ('ollama --version') do echo [OK] Ollama %%i installed
)
echo.

REM Check if Ollama is running
echo [4/5] Checking Ollama service...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Ollama service is not running
    echo Run in another terminal: ollama serve
) else (
    echo [OK] Ollama service is running
)
echo.

REM Check for models
echo [5/5] Checking installed models...
ollama list 2>nul | find "llama" >nul
if %errorlevel% neq 0 (
    echo [WARNING] No Llama model found
    echo Run: ollama pull llama3.1:8b
    echo.
) else (
    echo [OK] Llama model is installed
    echo.
    echo Available models:
    ollama list 2>nul
)
echo.

echo ====================================
echo   System Check Complete
echo ====================================
echo.
pause
