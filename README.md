# 🌟 Luminous AI - Local Intelligence Workspace

# 🚀 Luminous AI Desktop - Local First, Privacy Always

Luminous AI is now a **Standalone Desktop Application**. It brings high-performance local AI directly to your workspace with zero-latency orchestrator switching.

### 🍱 The Luminous Desktop Features:
- **Smart Orchestrator**: Automatically routes between **Mistral** (General/Code) and **LLaVA** (Reliable Vision).
- **Native Audio**: Transcribe and summarize meetings on-the-fly.
- **Glass-UI**: A modern desktop window built for high-density analysis.

### 🏗️ How to Use:
1.  **Quick Start**: Double-click **`Luminous.bat`** in this folder. It will automatically check for Ollama and launch the dashboard.
2.  **App for Friends**: To generate a standalone Windows Installer, run:
    ```powershell
    npm run app:build
    ```
    Your installer will appear in the `dist/` folder.

### 🛠️ Hardware Requirements:
*   **Optimal**: 16GB RAM + 8GB VRAM (GPU).
*   **Minimum**: 8GB RAM (Runs on CPU with slightly slower response times).

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
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS (Material Design 3 Glassmorphism)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5 (Experimental)
- **AI Runtime**: Ollama (Upgraded to v0.18.2+)
- **Database**: SQLite (Prisma ORM)
- **Vector Store**: FAISS / LangChain
- **Desktop Wrapper**: Electron

### AI Models (Local)
- **Chat**: Llama 3.1 8B Instruct
- **Code**: Qwen 2.5-Coder 7B
- **Vision**: Qwen 2.5-VL (High Precision Multi-modal / OCR)
- **Audio**: Whisper Small (Integration Pending)

## 🎨 Design System

The UI follows a modern glassmorphism design with:
- **Style**: Material Design 3 glass-inspired interface.
- **Fonts**: Inter (UI), JetBrains Mono (Code), Space Mono (Accents).
- **Effects**: Backdrop blur, soft shadows, ambient glows, fluid transitions.
- **Theme**: Dark mode optimized with high-density analysis layout.

## 🔧 Configuration

Edit `.env` to customize:

```env
# Ollama Configuration
OLLAMA_URL=http://localhost:11434

# Model Configuration
DEFAULT_CHAT_MODEL=llama3.1:8b
DEFAULT_CODE_MODEL=qwen2.5-coder:7b
DEFAULT_VISION_MODEL=qwen2.5-vl
DEFAULT_AUDIO_MODEL=whisper:small

# Privacy Mode
LOCAL_ONLY=true
TELEMETRY_ENABLED=false
```

## 📝 Available Models

### Recommended Models

**For Chat & General Intelligence:**
- `llama3.1:8b` - Best balance of quality and speed.
- `mistral:7b` - Fast and efficient.

**For Coding & Technical Tasks:**
- `qwen2.5-coder:7b` - Specialized local code model.

**For Multimodal Analysis (Vision/OCR):**
- `qwen2.5-vl` - Superior precision for reading text, hex codes, and layouts from images.

**Pull models:**
```bash
ollama pull llama3.1:8b
ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-vl
```

## 🚧 Roadmap

- [x] Chat interface with streaming
- [x] Model management & Switching
- [x] Desktop & mobile responsive design
- [x] High-precision Vision integration (Qwen 2.5-VL)
- [ ] Document analysis with RAG (Improved FAISS/LangChain Workflow)
- [ ] Audio transcription with Whisper (In Progress)
- [ ] **RunAnywhere SDK** implementation (Upcoming)
- [ ] Context memory system / Long-term agent memory
- [ ] Multi-agent collaborative workflows

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
