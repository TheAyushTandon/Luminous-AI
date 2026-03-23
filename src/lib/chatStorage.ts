export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const STORAGE_KEY = 'luminous_chat_history'

export const chatStorage = {
  // Get all chat sessions
  getAllSessions(): ChatSession[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      
      const sessions = JSON.parse(stored)
      return sessions.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
    } catch (error) {
      console.error('Error loading chat sessions:', error)
      return []
    }
  },

  // Get a specific session by ID
  getSession(sessionId: string): ChatSession | null {
    const sessions = this.getAllSessions()
    return sessions.find(s => s.id === sessionId) || null
  },

  // Save a new session or update existing
  saveSession(session: ChatSession): void {
    if (typeof window === 'undefined') return
    
    try {
      const sessions = this.getAllSessions()
      const existingIndex = sessions.findIndex(s => s.id === session.id)
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session
      } else {
        sessions.unshift(session) // Add to beginning
      }
      
      // Keep only last 50 sessions
      const trimmedSessions = sessions.slice(0, 50)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions))
    } catch (error) {
      console.error('Error saving chat session:', error)
    }
  },

  // Create a new session
  createSession(firstMessage?: Message): ChatSession {
    const now = new Date()
    const session: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: firstMessage?.content.slice(0, 50) || 'New Chat',
      messages: firstMessage ? [firstMessage] : [],
      createdAt: now,
      updatedAt: now
    }
    
    this.saveSession(session)
    return session
  },

  // Add a message to a session
  addMessage(sessionId: string, message: Message): void {
    const session = this.getSession(sessionId)
    if (!session) return
    
    session.messages.push(message)
    session.updatedAt = new Date()
    
    // Update title if this is the first user message
    if (session.messages.length === 1 && message.role === 'user') {
      session.title = message.content.slice(0, 50)
    }
    
    this.saveSession(session)
  },

  // Delete a session
  deleteSession(sessionId: string): void {
    if (typeof window === 'undefined') return
    
    try {
      const sessions = this.getAllSessions()
      const filtered = sessions.filter(s => s.id !== sessionId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error deleting chat session:', error)
    }
  },

  // Clear all sessions
  clearAll(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }
}
