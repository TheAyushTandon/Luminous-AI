// API Client for Luminous AI Backend

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: string[]
}

interface ChatResponse {
  sessionId: string
  response: string
  model: string
}

interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pinned: boolean
  archived: boolean
  messages: Array<{
    id: string
    role: string
    content: string
    createdAt: string
  }>
  _count?: {
    messages: number
  }
}

interface ModelInfo {
  name: string
  size: number
  modified_at: string
}

interface TelemetryData {
  status: string
  timestamp: string
  system: {
    cpu: {
      usage: number
      cores: number
    }
    memory: {
      usage: number
      used: number
      total: number
      usedGB: string
      totalGB: string
    }
    gpu: {
      usage: number
      vram: {
        used: number
        total: number
        usagePercent: number
      }
    }
    temperature: number
    latency: number
    uptime: {
      seconds: number
      formatted: string
      days: number
      hours: number
      minutes: number
    }
    platform: string
    arch: string
    hostname: string
  }
  ollama: {
    available: boolean
    status: string
  }
  metrics: {
    tokenVelocity: number[]
    averageTokensPerSecond: number
  }
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api'
  }

  // Chat API (JSON)
  async sendMessage(
    messages: Message[],
    sessionId?: string,
    options?: {
      model?: string
      temperature?: number
    }
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        sessionId,
        ...options,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to send message')
    }

    return response.json()
  }

  // Chat API (Streaming)
  async sendMessageStream(
    messages: Message[],
    sessionId?: string,
    options?: {
      model?: string
      temperature?: number
    },
    onChunk?: (chunk: string) => void,
    onSession?: (sessionId: string) => void,
    onRouted?: (model: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        sessionId,
        ...options,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to start stream')
    }

    if (!response.body) {
      throw new Error('Response body is empty')
    }

    const reader = response.body.getReader()
    const textDecoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = textDecoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.sessionId) {
              onSession?.(data.sessionId)
            }
            if (data.routedTo) {
              onRouted?.(data.routedTo)
            }
            if (data.chunk) {
              onChunk?.(data.chunk)
            }
          } catch (e) {
            console.warn('Failed to parse SSE line:', line)
          }
        }
      }
    }
  }

  // Get chat sessions
  async getSessions(options?: {
    archived?: boolean
    limit?: number
  }): Promise<{ sessions: ChatSession[] }> {
    const params = new URLSearchParams()
    if (options?.archived !== undefined) {
      params.append('archived', String(options.archived))
    }
    if (options?.limit) {
      params.append('limit', String(options.limit))
    }

    const response = await fetch(
      `${this.baseUrl}/chat?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch sessions')
    }

    return response.json()
  }

  // Get specific session
  async getSession(sessionId: string): Promise<{ session: ChatSession }> {
    const response = await fetch(
      `${this.baseUrl}/chat?sessionId=${sessionId}`
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Session not found')
      }
      throw new Error('Failed to fetch session')
    }

    return response.json()
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Delete session error:', errorText)
      throw new Error(`Failed to delete session: ${response.status} ${errorText}`)
    }
  }

  // Pin/unpin session
  async togglePinSession(sessionId: string, pinned: boolean): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pinned }),
    })

    if (!response.ok) {
      throw new Error('Failed to update session')
    }
  }

  // Archive/unarchive session
  async toggleArchiveSession(sessionId: string, archived: boolean): Promise<void> {
    const response = await fetch(`${this.baseUrl}/chat/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archived }),
    })

    if (!response.ok) {
      throw new Error('Failed to update session')
    }
  }

  // Models API
  async getModels(): Promise<{ models: ModelInfo[]; available: boolean }> {
    const response = await fetch(`${this.baseUrl}/models`)

    if (!response.ok) {
      const error = await response.json()
      return { models: [], available: false }
    }

    return response.json()
  }

  // Pull a model
  async pullModel(name: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/models/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new Error('Failed to pull model')
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; ollama: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      if (!response.ok) {
        return { status: 'error', ollama: false }
      }
      return response.json()
    } catch {
      return { status: 'error', ollama: false }
    }
  }

  // Telemetry API
  async getTelemetry(): Promise<TelemetryData> {
    const response = await fetch(`${this.baseUrl}/telemetry`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch telemetry data')
    }
    
    return response.json()
  }
}

export const apiClient = new ApiClient()
export default apiClient
