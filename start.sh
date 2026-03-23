#!/bin/bash

echo "===================================="
echo "  Luminous AI - Startup Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Ollama is running
echo "[1/4] Checking Ollama status..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC} Ollama is running"
else
    echo -e "${RED}[WARNING]${NC} Ollama is not running!"
    echo "Please start Ollama in another terminal:"
    echo "   ollama serve"
    echo ""
    echo "Or download from: https://ollama.ai"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi
echo ""

# Check if models are available
echo "[2/4] Checking for AI models..."
if ollama list 2>/dev/null | grep -q "llama"; then
    echo -e "${GREEN}[OK]${NC} Models are ready"
else
    echo -e "${YELLOW}[WARNING]${NC} No Llama model found!"
    echo "Pulling llama3.1:8b... This may take a while."
    ollama pull llama3.1:8b
fi
echo ""

# Start the servers
echo "[3/4] Starting Luminous AI..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""
echo "[4/4] Launching application..."
echo ""

# Run both servers
npm run dev:all

echo ""
echo "===================================="
echo "  Servers stopped"
echo "===================================="
