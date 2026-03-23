#!/bin/bash
echo "========================================="
echo "  Cleaning and Starting Luminous AI"
echo "========================================="
echo ""

# Stop any running processes
echo "[1/4] Stopping any running Node processes..."
taskkill //F //IM node.exe 2>/dev/null || true

# Clear cache
echo "[2/4] Clearing Next.js cache..."
rm -rf .next

# Verify dependencies
echo "[3/4] Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start server
echo "[4/4] Starting development server..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
