# 🧪 Testing Guide - Luminous AI

## Prerequisites Checklist

Before testing, make sure you have:

- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **Ollama** installed and running (`ollama serve`)
- [ ] **Llama model** downloaded (`ollama pull llama3.1:8b`)
- [ ] All **npm dependencies** installed (`npm install`)

## Quick Start Testing

### Option 1: Windows Users (Recommended)

1. Double-click `start.bat` in the project folder
2. The script will automatically:
   - Check if Ollama is running
   - Verify models are available
   - Start both frontend and backend servers
3. Open http://localhost:3000 in your browser

### Option 2: Mac/Linux Users

```bash
chmod +x start.sh
./start.sh
```

### Option 3: Manual Start

**Terminal 1 - Start Ollama:**
```bash
ollama serve
```

**Terminal 2 - Start Backend:**
```bash
npm run server
```

**Terminal 3 - Start Frontend:**
```bash
npm run dev
```

**Terminal 4 - Run Both Together:**
```bash
npm run dev:all
```

## Testing Checklist

### ✅ 1. Ollama Connection Test

**Check if Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

Expected: JSON response with list of models

**Pull the default model:**
```bash
ollama pull llama3.1:8b
```

**Verify model is installed:**
```bash
ollama list
```

Expected: Should show `llama3.1:8b` in the list

### ✅ 2. Frontend Tests

1. **Home Page**
   - Navigate to http://localhost:3000
   - Should redirect to `/chat` automatically
   - ✓ PASS: Redirects to chat page
   - ✗ FAIL: Shows error or blank page

2. **Chat Interface (Desktop)**
   - Should show:
     - [ ] Top navigation bar with "Luminous AI"
     - [ ] Left sidebar with chat history
     - [ ] Empty state with "Digital Intelligence" message
     - [ ] Bottom input bar with send button
     - [ ] "Running Locally" badge visible
   
3. **Chat Interface (Mobile)**
   - Resize browser to mobile width (< 1024px)
   - Should show:
     - [ ] Top app bar
     - [ ] Bottom navigation with 5 tabs
     - [ ] Chat input at bottom
     - [ ] No desktop sidebar

4. **Send a Message**
   - Type "Hello" in the input box
   - Press Enter or click send button
   - Expected behavior:
     - [ ] Message appears as user bubble (blue gradient)
     - [ ] Loading indicator shows (3 pulsing dots)
     - [ ] AI response appears (glass bubble)
     - [ ] Response is relevant to "Hello"
   
5. **Test Conversation**
   - Send: "What is AI?"
   - Expected: Detailed explanation about artificial intelligence
   - Send: "Explain it in simple terms"
   - Expected: Simpler explanation (shows context awareness)

6. **Navigation Test**
   - Click on each navigation item:
     - [ ] Chat (should stay on chat page)
     - [ ] Docs (should show "Coming Soon" page)
     - [ ] Code (should show "Coming Soon" page)
     - [ ] Audio (should show "Coming Soon" page)
     - [ ] Settings (should show settings page with models)

7. **Settings Page**
   - Navigate to `/settings`
   - Should show:
     - [ ] Live telemetry (CPU, GPU, RAM usage)
     - [ ] List of installed Ollama models
     - [ ] Model sizes displayed correctly
     - [ ] "Engine Online" status indicator

### ✅ 3. Backend API Tests

**Test Chat API:**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

Expected: JSON response with AI reply

**Test Models API:**
```bash
curl http://localhost:3001/api/models
```

Expected: JSON with list of models

**Test Health Check:**
```bash
curl http://localhost:3001/health
```

Expected: `{"status": "ok", "localOnly": true, ...}`

### ✅ 4. Next.js API Routes

**Test Next.js Chat API:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Test"}
    ]
  }'
```

**Test Next.js Models API:**
```bash
curl http://localhost:3000/api/models
```

### ✅ 5. Error Handling Tests

1. **Stop Ollama** (to test error handling)
   ```bash
   # Stop Ollama service
   # Send a chat message
   ```
   - Expected: User-friendly error message:
     - "Ollama service is not running"
     - "Please start Ollama and try again"

2. **Invalid Input**
   - Send an empty message
   - Expected: Send button should be disabled
   - No API call should be made

3. **Network Error Simulation**
   - Block port 11434
   - Try sending a message
   - Expected: Clear error message displayed

### ✅ 6. Performance Tests

1. **Response Time**
   - Send a message
   - Time from send to first response
   - Expected: < 5 seconds (depends on hardware)

2. **Streaming Test** (Future feature)
   - Currently: Full response loads at once
   - Future: Words should appear progressively

3. **Multiple Messages**
   - Send 5 messages in a row
   - Expected: All responses received correctly
   - No crashes or freezes

### ✅ 7. UI/UX Tests

1. **Glassmorphism Effects**
   - [ ] Blur effects render correctly
   - [ ] No performance issues
   - [ ] Smooth animations

2. **Responsive Design**
   - Test at these widths:
     - [ ] 1920px (Desktop large)
     - [ ] 1440px (Desktop medium)
     - [ ] 1024px (Tablet landscape)
     - [ ] 768px (Tablet portrait)
     - [ ] 375px (Mobile)

3. **Dark Theme**
   - [ ] All text is readable
   - [ ] Contrast ratios are good
   - [ ] No bright flashes

4. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Tab order is logical
   - [ ] Enter key sends messages

## Common Issues & Solutions

### Issue: "Cannot find module '@/components/...'"

**Solution:**
```bash
# Check tsconfig.json paths are correct
# Restart Next.js dev server
npm run dev
```

### Issue: "Ollama connection refused"

**Solution:**
```bash
# Start Ollama in a new terminal
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

### Issue: "Model not found"

**Solution:**
```bash
# Pull the required model
ollama pull llama3.1:8b

# Or change the model in .env
DEFAULT_CHAT_MODEL=mistral:7b
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port
next dev -p 3001
```

### Issue: "CORS errors in console"

**Solution:**
- Backend should have CORS enabled (already configured)
- Check if both servers are running on correct ports

### Issue: "Tailwind styles not loading"

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Performance Benchmarks

Expected performance on different hardware:

**High-End (RTX 4090, 32GB RAM)**
- First response: 1-2 seconds
- Subsequent: < 1 second

**Mid-Range (RTX 3060, 16GB RAM)**
- First response: 3-5 seconds
- Subsequent: 2-3 seconds

**Low-End (No GPU, 8GB RAM)**
- First response: 10-20 seconds
- Subsequent: 8-15 seconds

## Testing Report Template

```
LUMINOUS AI TEST REPORT
Date: _____________
Tester: _____________

ENVIRONMENT:
- OS: _____________
- Node Version: _____________
- Ollama Version: _____________
- Model: _____________

TESTS PASSED: __ / __

Frontend Tests:
[ ] Home page loads
[ ] Chat interface renders
[ ] Mobile responsive works
[ ] Navigation functional

Backend Tests:
[ ] API endpoints respond
[ ] Ollama connection works
[ ] Error handling correct

Chat Tests:
[ ] Messages send successfully
[ ] Responses are relevant
[ ] Conversation context maintained

ISSUES FOUND:
1. _____________
2. _____________
3. _____________

NOTES:
_____________
_____________
```

## Next Steps After Testing

If all tests pass:
1. ✅ Core chat functionality is working
2. ✅ Ready for additional feature development
3. ✅ Can proceed with RAG pipeline
4. ✅ Can add streaming responses
5. ✅ Can implement code assistant

If tests fail:
1. Document the error messages
2. Check the troubleshooting section
3. Review console logs (F12 in browser)
4. Check terminal output for errors

## Support

If you encounter issues:
1. Check the README.md
2. Review error messages in console
3. Verify Ollama is running
4. Check model is downloaded
5. Ensure ports are not blocked

---

**Happy Testing! 🚀**
