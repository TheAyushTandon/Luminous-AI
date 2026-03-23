# 🌟 Luminous AI - Local Intelligence Workspace

A production-grade, privacy-first AI assistant platform that runs entirely on your local machine. Built with Next.js, React, and powered by Ollama for local LLM inference.

## ✨ Features

- 💬 **Chat Interface** - Multi-turn conversations with streaming responses
- 💻 **Code Assistant** - Generate, refactor, and debug code
- 📄 **Document Analysis** - PDF parsing and RAG-based Q&A (coming soon)
- 🎙️ **Audio Intelligence** - Transcription and speaker diarization (coming soon)
- ⚙️ **Model Management** - Load, unload, and manage AI models
- 🔒 **Privacy-First** - Everything runs locally, no cloud APIs
- 🎨 **Modern UI** - Glassmorphism design with dark theme

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** - Download from [ollama.ai](https://ollama.ai)

### Installation

1. **Clone the repository**
```bash
cd "D:\PROJECTS\Hackxtreme project"
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

4. **Start Ollama**
```bash
ollama serve
```

5. **Pull the default model**
```bash
ollama pull llama3.1:8b
```

### Running the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev:all
```

**Option 2: Run separately**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run server
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
luminous-ai/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── chat/           # Chat interface
│   │   ├── code/           # Code assistant
│   │   ├── documents/      # Document analysis
│   │   ├── audio/          # Audio processing
│   │   └── settings/       # Settings page
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility functions
│   ├── store/             # State management (Zustand)
│   └── styles/            # Global styles
├── server/
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── models/            # Data models
└── public/                # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **AI Runtime**: Ollama
- **Database**: SQLite (Prisma ORM)
- **Vector Store**: FAISS

### AI Models (Local)
- **Chat**: Llama 3.1 8B Instruct
- **Code**: Qwen2.5-Coder 7B
- **Audio**: Whisper Small

## 🎨 Design System

The UI follows a modern glassmorphism design with:
- **Colors**: Material Design 3 color system
- **Fonts**: Inter (UI), JetBrains Mono (code), Space Mono (accents)
- **Effects**: Backdrop blur, soft shadows, ambient glows
- **Theme**: Dark mode optimized

## 🔧 Configuration

Edit `.env` to customize:

```env
# Ollama Configuration
OLLAMA_URL=http://localhost:11434

# Model Configuration
DEFAULT_CHAT_MODEL=llama3.1:8b
DEFAULT_CODE_MODEL=qwen2.5-coder:7b
DEFAULT_AUDIO_MODEL=whisper:small

# Privacy Mode
LOCAL_ONLY=true
TELEMETRY_ENABLED=false
```

## 📝 Available Models

### Recommended Models

**For Chat:**
- `llama3.1:8b` - Best balance of quality and speed
- `mistral:7b` - Fast and efficient
- `phi3:mini` - Lightweight option

**For Code:**
- `qwen2.5-coder:7b` - Specialized code model
- `codellama:7b` - Alternative code assistant

**Pull models:**
```bash
ollama pull llama3.1:8b
ollama pull qwen2.5-coder:7b
```

## 🚧 Roadmap

- [x] Chat interface with streaming
- [x] Model management
- [x] Desktop & mobile responsive design
- [ ] Document analysis with RAG
- [ ] Code editor integration
- [ ] Audio transcription with Whisper
- [ ] Agent routing system
- [ ] Context memory system
- [ ] Export conversations

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify!

## 📄 License

ISC License

## 🆘 Troubleshooting

### Ollama not connecting
1. Make sure Ollama is running: `ollama serve`
2. Check if models are downloaded: `ollama list`
3. Verify OLLAMA_URL in `.env`

### Port already in use
Change ports in `.env`:
```env
PORT=3002  # Change backend port
```

And in `package.json` for frontend:
```bash
next dev -p 3001  # Change frontend port
```

### Build errors
```bash
rm -rf node_modules
rm -rf .next
npm install
npm run build
```

## 💡 Tips

1. **Hardware Requirements**
   - Minimum: 8GB RAM
   - Recommended: 16GB+ RAM for larger models

2. **Model Selection**
   - Smaller models (7B-8B) run faster on consumer hardware
   - Larger models (13B+) provide better quality but slower

3. **Performance**
   - Use quantized models (Q4, Q5) for better speed
   - Close other applications for better performance
   - Consider GPU acceleration if available

---

**Built with ❤️ for privacy-conscious AI enthusiasts**
