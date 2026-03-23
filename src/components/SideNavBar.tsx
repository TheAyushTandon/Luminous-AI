'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useChatStore } from '@/store/useChatStore'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function SideNavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const { 
    sessions, 
    loadSessions, 
    deleteSession, 
    currentSessionId, 
    setCurrentSessionId,
    isSidebarCollapsed,
    toggleSidebar
  } = useChatStore()
  
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [pathname, searchParams])

  const handleNewChat = () => {
    setCurrentSessionId(null)
    router.push('/chat')
  }

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteSession(sessionId)
      if (currentSessionId === sessionId) {
        router.push('/chat')
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const navItems = [
    { id: 'chat', icon: 'chat', label: 'Chat', href: '/chat' },
    { id: 'documents', icon: 'description', label: 'Documents', href: '/documents' },
    { id: 'code', icon: 'code', label: 'Code', href: '/code' },
    { id: 'audio', icon: 'mic', label: 'Audio', href: '/audio' },
    { id: 'settings', icon: 'settings', label: 'Settings', href: '/settings' },
  ]

  return (
    <>
      {/* Toggle Button (Floating when collapsed) */}
      <button 
        onClick={toggleSidebar}
        className={`fixed top-6 z-50 p-2.5 bg-[#0a0a0a] border border-white/10 rounded-full text-slate-400 hover:text-white transition-all shadow-2xl hover:scale-110 active:scale-95 ${
          isSidebarCollapsed ? 'left-6' : 'left-[16.5rem]'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isSidebarCollapsed ? 'menu' : 'menu_open'}
        </span>
      </button>

      <motion.aside 
        initial={false}
        animate={{ width: isSidebarCollapsed ? 0 : 288, opacity: isSidebarCollapsed ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full flex flex-col z-40 bg-[#000000] border-r border-white/5 overflow-hidden"
      >
        <div className="p-6 w-72 flex flex-col h-full bg-[#0a0a0a]/50">
          {/* Logo */}
          <div className="mb-12 mt-16 px-4">
            <h1 className="text-[14px] font-black text-white font-headline tracking-[0.4em] uppercase mb-1 whitespace-nowrap">Luminous AI</h1>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {/* Workspace Navigation */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 px-4 mb-2">Workspace</p>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all group cursor-pointer border border-transparent ${
                    pathname === item.href
                      ? 'bg-white/10 backdrop-blur-3xl text-white border-white/10 shadow-2xl'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:scale-110">{item.icon}</span>
                    <span className="text-sm font-semibold tracking-wide font-headline">{item.label}</span>
                  </div>
                  {pathname === item.href && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ArrowRight className="size-4 text-primary" />
                    </motion.div>
                  )}
                </Link>
              ))}
            </div>

            {/* Chat History Section */}
            {pathname === '/chat' && (
              <>
                <div className="border-t border-white/5 pt-4">
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 text-white font-medium rounded-2xl hover:bg-white/10 transition-all group cursor-pointer mb-2 border border-white/5"
                  >
                    <span className="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 transition-transform">add</span>
                    <span className="text-sm font-headline tracking-wide">New Chat</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center justify-between w-full px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-2xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">history</span>
                      <span className="text-sm font-headline tracking-wide">History</span>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{sessions.length}</span>
                  </button>

                  {/* Chat History List */}
                  {showHistory && sessions.length > 0 && (
                    <div className="space-y-1 pl-2 mt-2">
                      {sessions.slice(0, 10).map((session) => (
                        <Link
                          key={session.id}
                          href={`/chat?session=${session.id}`}
                          className={`group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-all border border-transparent ${
                            currentSessionId === session.id ? 'bg-white/10 border-white/10 shadow-xl' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs text-slate-300 truncate font-medium">{session.title}</p>
                            <p className="text-[9px] text-slate-600 mt-0.5 font-mono uppercase tracking-tighter">{formatDate(session.updatedAt)}</p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-md transition-all shrink-0"
                          >
                            <span className="material-symbols-outlined text-red-400 text-xs">delete</span>
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
        </div>
      </motion.aside>
    </>
  )
}
