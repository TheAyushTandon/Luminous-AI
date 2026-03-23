# Luminous AI - Backend Architecture

## ✅ Completed Backend Infrastructure

### 1. **Database Layer (Prisma + SQLite)**
- **Schema Created** (`prisma/schema.prisma`)
  - `ChatSession`: Chat conversations with metadata
  - `Message`: Individual messages with relationships
  - `Document`: PDF/document storage
  - `Chunk`: Document chunks for RAG
  - `CodeProject` & `CodeFile`: Code analysis storage
  - `AudioFile`: Audio transcription storage
  - `ModelConfig`: Model configurations
  - `Setting`: System settings

- **Database Client** (`src/lib/prisma.ts`)
  - Singleton Prisma client
  - Connection pooling
  - Development query logging

### 2. **Configuration Management** (`src/lib/config.ts`)
- Environment variable validation with Zod
- Type-safe configuration object
- Comprehensive settings for:
  - Server configuration
  - Ollama connection
  - Model defaults
  - File upload limits
  - Chat parameters
  - Document processing
  - Code analysis
  - Audio settings
  - Privacy controls

### 3. **Error Handling** (`src/lib/errors.ts`)
- Custom error classes:
  - `AppError` - Base error
  - `ValidationError` - Input validation
  - `NotFoundError` - Resource not found
  - `OllamaError` - Ollama service errors
  - `DatabaseError` - Database errors
- Logger utility with levels (info, warn, error, debug)
- API error handler for consistent responses

### 4. **Ollama Service** (`src/lib/ollama.ts`)
- Complete Ollama API wrapper:
  - `isAvailable()` - Health check
  - `listModels()` - Get available models
  - `chat()` - Standard chat completion
  - `chatStream()` - Streaming chat completion
  - `generateEmbedding()` - Generate embeddings for RAG
  - `pullModel()` - Download models
- Timeout handling
- Error recovery
- Type-safe interfaces

### 5. **Enhanced Chat API** (`src/app/api/chat/route.ts`)
- **Features:**
  - Database persistence for all conversations
  - Session management (create/resume)
  - Streaming support (SSE)
  - Message history
  - Model selection
  - Temperature control
  - Token limits
  - Automatic session titling
  - Error handling with fallbacks

- **Endpoints:**
  - `POST /api/chat` - Send message (streaming/non-streaming)
  - `GET /api/chat?sessionId=xxx` - Get specific session
  - `GET /api/chat` - List all sessions
  - `GET /api/chat?archived=true` - List archived sessions

---

## 🔧 Ready to Build (Architecture Designed)

### 6. **Document Processing API** (Next Priority)
**Location:** `src/app/api/documents/route.ts`

**Features to Implement:**
- PDF upload and parsing
- Text extraction
- Chunking for RAG
- Vector embeddings generation
- Similarity search
- Document Q&A

**Required Libraries:**
- `pdf-parse` (already installed)
- Vector similarity library

### 7. **Code Analysis API**
**Location:** `src/app/api/code/route.ts`

**Features to Implement:**
- Code upload/project scan
- Syntax analysis
- Code explanation
- Refactoring suggestions
- Bug detection
- Documentation generation

### 8. **Audio Transcription API**
**Location:** `src/app/api/audio/route.ts`

**Features to Implement:**
- Audio file upload
- Whisper transcription
- Speaker diarization
- Timestamp generation
- Export transcriptions

### 9. **Model Management API**
**Location:** `src/app/api/models/route.ts`

**Current:** Basic model listing
**Enhance with:**
- Model download/pull
- Model switching
- Model configuration
- Performance metrics

---

## 📁 Backend File Structure

```
src/
├── lib/
│   ├── prisma.ts          ✅ Database client
│   ├── config.ts          ✅ Configuration management
│   ├── errors.ts          ✅ Error handling & logging
│   ├── ollama.ts          ✅ Ollama service wrapper
│   ├── chatStorage.ts     ✅ localStorage fallback (client-side)
│   └── (TODO: Add more services)
│
├── app/api/
│   ├── chat/route.ts      ✅ Enhanced chat API
│   ├── models/route.ts    ⚠️  Basic (needs enhancement)
│   ├── documents/         🔨 To build
│   ├── code/              🔨 To build
│   └── audio/             🔨 To build
│
prisma/
├── schema.prisma          ✅ Database schema
└── dev.db                 ✅ SQLite database
```

---

## 🚀 Usage Examples

### Chat API
```typescript
// Create new chat
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }],
    model: 'llama3.1:8b',
  }),
})

// Resume existing chat
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    sessionId: 'existing-session-id',
    messages: [...],
  }),
})

// Stream responses
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [...],
    stream: true,
  }),
})
const reader = response.body.getReader()
// Process stream...

// Get session history
const sessions = await fetch('/api/chat')
const data = await sessions.json()
```

---

## 🔐 Privacy & Security

- **100% Local**: All data stored in local SQLite database
- **No External APIs**: Ollama runs locally
- **No Telemetry**: Disabled by default
- **File System Access**: Restricted to designated directories

---

## ⚙️ Environment Variables

```env
NODE_ENV=development
PORT=3001
OLLAMA_URL=http://localhost:11434
DEFAULT_CHAT_MODEL=llama3.1:8b
DEFAULT_CODE_MODEL=codellama:7b
DEFAULT_AUDIO_MODEL=whisper:small
DATABASE_URL="file:./prisma/dev.db"
LOCAL_ONLY=true
TELEMETRY_ENABLED=false
```

---

## 📊 Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (GUI)
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

---

## 🎯 Next Steps

1. **Migrate chat page** to use new database API
2. **Build document processing** pipeline
3. **Implement code analysis** features
4. **Add audio transcription** support
5. **Create admin dashboard** for system management

---

## 📝 Notes

- Database migrations are handled via `prisma db push` (dev mode)
- For production, use `prisma migrate`
- All APIs support both JSON and streaming responses
- Error handling is centralized and consistent
- Logging is structured and queryable
