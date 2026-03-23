import { z } from 'zod'

// PRIVACY NOTE: All URLs must be localhost only!
// This app NEVER connects to cloud services.

// Environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  API_URL: z.string().default('http://localhost:3001'),
  
  // Ollama
  OLLAMA_URL: z.string().default('http://localhost:11434'),
  
  // Models
  DEFAULT_CHAT_MODEL: z.string().default('llama3.1:8b'),
  DEFAULT_CODE_MODEL: z.string().default('codellama:7b'),
  DEFAULT_AUDIO_MODEL: z.string().default('whisper:small'),
  
  // Database
  DATABASE_URL: z.string().default('file:./prisma/dev.db'),
  
  // Vector Store
  VECTOR_STORE_PATH: z.string().default('./data/vectors'),
  
  // Privacy
  LOCAL_ONLY: z.string().default('true'),
  TELEMETRY_ENABLED: z.string().default('false'),
})

// Parse and validate environment
const env = envSchema.parse(process.env)

// Configuration object
export const config = {
  env: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  
  server: {
    port: parseInt(env.PORT),
    apiUrl: env.API_URL,
  },
  
  ollama: {
    url: env.OLLAMA_URL,
    timeout: 120000, // 2 minutes
  },
  
  models: {
    chat: env.DEFAULT_CHAT_MODEL,
    code: env.DEFAULT_CODE_MODEL,
    audio: env.DEFAULT_AUDIO_MODEL,
  },
  
  database: {
    url: env.DATABASE_URL,
  },
  
  vectorStore: {
    path: env.VECTOR_STORE_PATH,
    chunkSize: 1000,
    chunkOverlap: 200,
  },
  
  chat: {
    maxMessages: 50,
    maxTokens: 4096,
    temperature: 0.7,
    streamTimeout: 30000,
  },
  
  documents: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'text/plain', 'text/markdown'],
    uploadDir: './data/documents',
  },
  
  code: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedLanguages: ['javascript', 'typescript', 'python', 'java', 'cpp', 'rust', 'go'],
    analysisTimeout: 60000,
  },
  
  audio: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFormats: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
    uploadDir: './data/audio',
  },
  
  privacy: {
    localOnly: env.LOCAL_ONLY === 'true',
    telemetryEnabled: env.TELEMETRY_ENABLED === 'true',
  },
} as const

export type Config = typeof config

export default config
