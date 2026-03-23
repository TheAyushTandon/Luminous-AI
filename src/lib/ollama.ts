import config from './config'
import { OllamaError, logger } from './errors'
import privacyGuard from './privacy'

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OllamaChatRequest {
  model: string
  messages: OllamaMessage[]
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    num_predict?: number
  }
}

export interface OllamaChatResponse {
  model: string
  message: {
    role: string
    content: string
  }
  done: boolean
}

export interface OllamaModelInfo {
  name: string
  size: number
  digest: string
  modified_at: string
  details?: any
}

class OllamaService {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = config.ollama.url
    this.timeout = config.ollama.timeout
    
    // PRIVACY CHECK: Ensure Ollama is running locally
    privacyGuard.validateOllamaUrl()
  }

  // Check if Ollama is running
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  // List available models
  async listModels(): Promise<OllamaModelInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new OllamaError('Failed to fetch models from Ollama')
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      if (error instanceof OllamaError) throw error
      logger.error('Error listing models:', error)
      throw new OllamaError('Ollama service is not available. Please start Ollama.')
    }
  }

  // Chat completion
  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: false,
        }),
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new OllamaError(`Ollama API error: ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof OllamaError) throw error
      logger.error('Error in chat completion:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new OllamaError('Request timeout - model took too long to respond')
      }
      
      throw new OllamaError('Failed to get response from Ollama')
    }
  }

  // Streaming chat completion
  async *chatStream(request: OllamaChatRequest): AsyncGenerator<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new OllamaError(`Ollama API error: ${errorText}`)
      }

      if (!response.body) {
        throw new OllamaError('No response body received')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const json = JSON.parse(line)
            if (json.message?.content) {
              yield json.message.content
            }
            if (json.done) {
              return
            }
          } catch (e) {
            // Skip invalid JSON lines
            continue
          }
        }
      }
    } catch (error) {
      if (error instanceof OllamaError) throw error
      logger.error('Error in streaming chat:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new OllamaError('Stream timeout - model took too long to respond')
      }
      
      throw new OllamaError('Failed to stream response from Ollama')
    }
  }

  // Generate embeddings
  async generateEmbedding(model: string, text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: text,
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        throw new OllamaError('Failed to generate embedding')
      }

      const data = await response.json()
      return data.embedding
    } catch (error) {
      if (error instanceof OllamaError) throw error
      logger.error('Error generating embedding:', error)
      throw new OllamaError('Failed to generate embedding')
    }
  }

  // Pull a model
  async pullModel(modelName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName,
        }),
      })

      if (!response.ok) {
        throw new OllamaError(`Failed to pull model: ${modelName}`)
      }
    } catch (error) {
      if (error instanceof OllamaError) throw error
      logger.error('Error pulling model:', error)
      throw new OllamaError('Failed to pull model from Ollama')
    }
  }
}

export const ollamaService = new OllamaService()
export default ollamaService
