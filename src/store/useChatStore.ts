import { create } from 'zustand'
import apiClient from '@/lib/apiClient'

interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  pinned: boolean
  archived: boolean
}

interface AttachedDoc {
  name: string
  content: string
  type: string
  visuals?: string[]
}

interface ModelInfo {
  name: string
  size: number
  modified_at: string
}

interface ChatStore {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoadingSessions: boolean
  models: string[]
  selectedModel: string
  isSidebarCollapsed: boolean
  attachedDocs: AttachedDoc[]
  
  // Actions
  setSessions: (sessions: ChatSession[]) => void
  setCurrentSessionId: (id: string | null) => void
  setSelectedModel: (model: string) => void
  toggleSidebar: () => void
  loadSessions: () => Promise<void>
  loadModels: () => Promise<void>
  deleteSession: (id: string) => Promise<void>
  addSession: (session: ChatSession) => void
  setAttachedDocs: (docs: AttachedDoc[]) => void
  clearAttachedDocs: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  isLoadingSessions: false,
  models: [],
  selectedModel: 'Luminous Orchestrator', // Default
  isSidebarCollapsed: false,
  attachedDocs: [],

  setSessions: (sessions) => set({ sessions }),
  
  setCurrentSessionId: (id) => set({ currentSessionId: id }),

  setSelectedModel: (model) => set({ selectedModel: model }),

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  setAttachedDocs: (docs) => set({ attachedDocs: docs }),
  
  clearAttachedDocs: () => set({ attachedDocs: [] }),

  loadSessions: async () => {
    set({ isLoadingSessions: true })
    try {
      const { sessions } = await apiClient.getSessions({ limit: 50 })
      set({ sessions, isLoadingSessions: false })
    } catch (error) {
      console.error('Failed to load sessions:', error)
      set({ isLoadingSessions: false })
    }
  },

  loadModels: async () => {
    try {
      const data = await apiClient.getModels()
      const rawModels = data.models || []
      const modelNames = rawModels.map((m: any) => typeof m === 'string' ? m : m.name)
      
      if (modelNames.length > 0) {
        const finalModels = ['Luminous Orchestrator', ...modelNames]
        set({ models: finalModels })
        if (!finalModels.includes(get().selectedModel)) {
          set({ selectedModel: 'Luminous Orchestrator' })
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  },

  deleteSession: async (id) => {
    try {
      await apiClient.deleteSession(id)
      const filteredSessions = get().sessions.filter(s => s.id !== id)
      set({ sessions: filteredSessions })
      
      if (get().currentSessionId === id) {
        set({ currentSessionId: null })
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      throw error
    }
  },

  addSession: (session) => {
    set((state) => ({
      sessions: [session, ...state.sessions]
    }))
  }
}))
