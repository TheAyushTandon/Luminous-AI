'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopNavBar from '@/components/TopNavBar'
import SideNavBar from '@/components/SideNavBar'
import BottomNavBar from '@/components/BottomNavBar'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import apiClient from '@/lib/apiClient'
import { useChatStore } from '@/store/useChatStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  images?: string[]
  routedTo?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [sessionIdFromUrl, setSessionIdFromUrl] = useState<string | null>(null)
  
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocalRunning, setIsLocalRunning] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Dynamic Scroll Logic
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const { isSidebarCollapsed, setCurrentSessionId: setStoreSessionId } = useChatStore()

  // Get session ID from URL reactively
  useEffect(() => {
    const sessionParam = searchParams.get('session')
    setSessionIdFromUrl(sessionParam)
    setStoreSessionId(sessionParam)
  }, [searchParams, setStoreSessionId])

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-scroll effect: only fire if autoscroll is enabled
  useEffect(() => {
    if (autoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages, autoScrollEnabled])

  // Detect manual scroll behavior
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50
    if (isAtBottom && !autoScrollEnabled) {
      setAutoScrollEnabled(true)
    } else if (!isAtBottom && autoScrollEnabled) {
      setAutoScrollEnabled(false)
    }
  }

  // Load session turn-by-turn
  useEffect(() => {
    if (sessionIdFromUrl && sessionIdFromUrl !== currentSessionId) {
      loadSession(sessionIdFromUrl)
    } else if (!sessionIdFromUrl && currentSessionId) {
      setMessages([])
      setCurrentSessionId(undefined)
    }
  }, [sessionIdFromUrl, currentSessionId])

  // Check health on mount
  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const health = await apiClient.healthCheck()
      setIsLocalRunning(health.ollama)
      if (!health.ollama) {
        setError('Ollama is not running. Please start Ollama to use the chat.')
      }
    } catch {
      setIsLocalRunning(false)
      setError('Unable to connect to backend services.')
    }
  }

  const loadSession = async (sessionId: string) => {
    try {
      const { session } = await apiClient.getSession(sessionId)
      setCurrentSessionId(session.id)
      setMessages(
        session.messages.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }))
      )
    } catch (error) {
      console.error('Error loading session:', error)
      setCurrentSessionId(undefined)
      setMessages([])
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/chat')
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    const { selectedModel, attachedDocs, clearAttachedDocs } = useChatStore.getState()
    // Separate images from documents
    const images = attachedDocs
      .filter(doc => doc.type.startsWith('image/'))
      .map(doc => doc.content.split(',')[1] || doc.content) // Strip prefix

    const documents = attachedDocs.filter(doc => !doc.type.startsWith('image/'))

    // Format attached documents for context injection
    let documentContext = ''
    if (documents.length > 0) {
      documentContext = documents.map(doc => 
        `### DOCUMENT: ${doc.name}\n${doc.content}\n---`
      ).join('\n\n')
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim() || (images.length > 0 ? `Analyzing ${images.length} image(s)...` : `Analyzing ${documents.length} document(s)...`),
      timestamp: new Date(),
      images: attachedDocs.filter(doc => doc.type.startsWith('image/')).map(doc => doc.content)
    }

    const assistantMessageId = (Date.now() + 1).toString()
    const newAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage, newAssistantMessage])
    setIsLoading(true)
    setError(null)
    setAutoScrollEnabled(true)

    const systemPromptMessage = { 
      role: 'system' as const, 
      content: `### IDENTITY
You are Luminous AI, a highly-intelligent, all-rounder utility assistant. 

### CONTEXT HANDLING
- DOCUMENTS: If the user provides "### DOCUMENT" markers, use the information provided to answer.
- IMAGES: If the user provides images, describe them or answer questions based on their visual content.

### RULES
1. BE AN ALL-ROUNDER: Never refuse a task.
2. NATURAL FLOW: Talk directly and intelligently.
3. ZERO REPETITION: No intro/outro clichés.
4. INTEGRITY: Be factual for technical topics.` 
    }

    const finalUserContent = documentContext 
      ? `[ANALYSIS REQUESTED FOR ATTACHED DOCUMENTS]\n\n${documentContext}\n\nUSER QUESTION: ${content.trim() || 'Please summarize these documents.'}`
      : content.trim()

    const apiMessages = [
      systemPromptMessage,
      ...messages.map(m => ({ role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant' | 'system', content: m.content })),
      { role: 'user' as const, content: finalUserContent, images: images.length > 0 ? images : undefined }
    ]

    clearAttachedDocs()

    try {
      await apiClient.sendMessageStream(
        apiMessages,
        currentSessionId,
        { model: selectedModel },
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg
          ))
        },
        (newSessionId) => {
          if (!currentSessionId || newSessionId !== currentSessionId) {
            setCurrentSessionId(newSessionId)
            router.push(`/chat?session=${newSessionId}`, { scroll: false })
            useChatStore.getState().loadSessions()
          }
        },
        (model) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, routedTo: model } : msg
          ))
        }
      )
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: 'Error: Connection failed.' } : msg))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`h-screen bg-background text-on-surface flex flex-col transition-opacity duration-600 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="flex-1 flex overflow-hidden">
        <SideNavBar />
        <main className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-72'}`}>
          <TopNavBar isLocalRunning={isLocalRunning} />
          
          <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 lg:px-10 pt-28 pb-40 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    isLocalRunning ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-900/20 text-red-400 border border-red-800/20'
                  }`}>
                    {isLocalRunning ? 'System Active' : 'System Offline'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold tracking-[0.2em] uppercase">{useChatStore.getState().selectedModel}</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-500 text-xs font-mono font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}

              <div className="space-y-12">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center space-y-8 py-20">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center animate-pulse">
                      <span className="material-symbols-outlined text-primary text-4xl">auto_awesome</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Intelligence Workspace</h2>
                      <p className="text-slate-500 max-w-md mx-auto">Your private, local AI instance is ready for document analysis and creative work.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                  </>
                )}
              </div>
            </div>
          </div>
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !isLocalRunning} />
        </main>
      </div>
    </div>
  )
}
