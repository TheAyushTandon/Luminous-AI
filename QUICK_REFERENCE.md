# 🚀 Quick Reference - Luminous AI

## Instant Commands

### Check System
```bash
# Windows
check-system.bat

# Mac/Linux
ollama --version && node --version && npm --version
```

### Start Application
```bash
# Windows (Auto-start everything)
start.bat

# Mac/Linux
./start.sh

# Manual (separate terminals needed)
ollama serve                  # Terminal 1
npm run server                # Terminal 2
npm run dev                   # Terminal 3

# Or run together
npm run dev:all              # Runs frontend + backend
```

### Install & Setup
```bash
# 1. Install Ollama
# Download from: https://ollama.ai

# 2. Pull AI Model
ollama pull llama3.1:8b

# 3. Install Dependencies
npm install

# 4. Start App
npm run dev:all
```

## URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web interface |
| **Backend API** | http://localhost:3001 | Express server |
| **Ollama** | http://localhost:11434 | AI model server |

## Key Pages

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | ✅ Redirects to chat |
| Chat | `/chat` | ✅ Working |
| Settings | `/settings` | ✅ Working |
| Code | `/code` | ⏳ Placeholder |
| Documents | `/documents` | ⏳ Placeholder |
| Audio | `/audio` | ⏳ Placeholder |

## API Endpoints

### Frontend (Next.js)
```bash
POST /api/chat          # Send chat message
GET  /api/models        # List models
```

### Backend (Express)
```bash
POST /api/chat          # Chat with AI
POST /api/chat/stream   # Stream chat (future)
GET  /api/models        # List models
POST /api/code          # Code assistance
POST /api/audio         # Audio processing
POST /api/documents     # Document analysis
GET  /health            # Server status
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `⌘/Ctrl + K` | Clear chat (future) |
| `Tab` | Navigate inputs |

## Testing Commands

### Check Ollama
```bash
# Is Ollama running?
curl http://localhost:11434/api/tags

# List models
ollama list

# Test model
ollama run llama3.1:8b "Hello"
```

### Test APIs
```bash
# Test Next.js API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}]}'

# Test Express API
curl http://localhost:3001/health
```

## Common Issues

| Issue | Solution |
|-------|----------|
| **Ollama not found** | Install from ollama.ai |
| **Port in use** | Kill process or change port |
| **No AI response** | Check Ollama is running |
| **Model not found** | Run `ollama pull llama3.1:8b` |
| **Build errors** | Run `rm -rf .next && npm install` |

## File Locations

```
Config:         .env
Styles:         src/styles/globals.css
Components:     src/components/
Pages:          src/app/
API Routes:     src/app/api/
Backend:        server/
Documentation:  README.md, TESTING.md
```

## Default Settings

```env
PORT=3001
OLLAMA_URL=http://localhost:11434
DEFAULT_CHAT_MODEL=llama3.1:8b
LOCAL_ONLY=true
```

## Recommended Models

| Task | Model | Size | Command |
|------|-------|------|---------|
| Chat | llama3.1:8b | 4.7GB | `ollama pull llama3.1:8b` |
| Chat (small) | phi3:mini | 2.3GB | `ollama pull phi3:mini` |
| Code | qwen2.5-coder:7b | 4.7GB | `ollama pull qwen2.5-coder:7b` |
| Audio | whisper:small | 466MB | `ollama pull whisper:small` |
| Vision | llava:7b | 4.7GB | `ollama pull llava:7b` |

## Package Scripts

```bash
npm run dev        # Start Next.js frontend
npm run build      # Build for production
npm run start      # Start production server
npm run server     # Start Express backend
npm run dev:all    # Start both servers
```

## Quick Troubleshooting

```bash
# 1. Reset everything
rm -rf node_modules .next
npm install

# 2. Check Ollama
ollama serve
ollama list

# 3. Restart servers
npm run dev:all

# 4. Check browser
http://localhost:3000
```

## Development Workflow

```bash
# 1. Make changes to code
# 2. Auto-reload happens (no restart needed)
# 3. Test in browser
# 4. Check console for errors (F12)
```

## Production Build

```bash
# Build optimized version
npm run build

# Start production server
npm start
```

## Port Configuration

If ports are in use, change in `.env`:
```env
PORT=3002  # Backend port
```

And for frontend:
```bash
next dev -p 3001  # Different frontend port
```

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8GB | 16GB+ |
| Storage | 10GB | 20GB+ |
| GPU | None (CPU works) | 8GB VRAM |
| OS | Windows 10+, macOS 11+, Linux | Any |

## Performance Tips

1. Use smaller models for faster responses
2. Close other applications
3. Enable GPU acceleration if available
4. Use quantized models (Q4, Q5)
5. Adjust context window size

## Getting Help

1. Check `README.md` for detailed guide
2. Check `TESTING.md` for testing steps
3. Check `BUILD_SUMMARY.md` for what's built
4. Check console for error messages
5. Verify Ollama is running

## Status Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟢 "Engine Online" | Everything working |
| 🟡 "Loading..." | Processing request |
| 🔴 "Error" | Check Ollama connection |
| 🔵 "Running Locally" | Privacy mode active |

---

**Need detailed help? Check README.md**
**Need testing guide? Check TESTING.md**
**Need build info? Check BUILD_SUMMARY.md**
