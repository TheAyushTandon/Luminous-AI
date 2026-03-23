@echo off
echo.
echo ========================================
echo   LUMINOUS AI - SERVER STATUS
echo ========================================
echo.

echo [*] Checking Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Ollama is running on port 11434
) else (
    echo [FAIL] Ollama is NOT running
    echo        Start with: ollama serve
)

echo.
echo [*] Checking Backend Server...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is running on port 3001
) else (
    echo [FAIL] Backend is NOT running
    echo        Start with: npm run server
)

echo.
echo [*] Checking Frontend Server...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 3000
) else (
    echo [FAIL] Frontend is NOT running
    echo        Start with: npm run dev
)

echo.
echo ========================================
echo.

if exist "http://localhost:3000" (
    echo [SUCCESS] All servers are running!
    echo Open: http://localhost:3000
) else (
    echo [INFO] Checking server status...
    netstat -ano | findstr "3000 3001 11434"
)

echo.
echo ========================================
echo.
pause
