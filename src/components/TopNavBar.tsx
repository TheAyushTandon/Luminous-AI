'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useChatStore } from '@/store/useChatStore'

interface TopNavBarProps {
  isLocalRunning: boolean
}

export default function TopNavBar({ isLocalRunning }: TopNavBarProps) {
  const { models, selectedModel, setSelectedModel, loadModels } = useChatStore()

  useEffect(() => {
    if (isLocalRunning) {
      loadModels()
    }
  }, [isLocalRunning])

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-full mt-4 mx-auto max-w-fit px-6 py-2 shadow-2xl">
      <Link href="/chat" className="cursor-pointer">
        <span className="text-lg font-bold text-slate-100 font-headline tracking-tight">Luminous AI</span>
      </Link>
      
      <div className="h-4 w-px bg-outline-variant/30 mx-2"></div>
      
      <div className="flex items-center gap-2 mr-4">
        <span className="material-symbols-outlined text-[18px] text-primary/70">smart_toy</span>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="bg-transparent text-xs text-slate-100 outline-none cursor-pointer border-none focus:ring-0 p-0 font-mono tracking-tighter uppercase"
        >
          <option value="luminous-orchestrator" className="bg-slate-900 text-primary font-bold">
            ✨ Luminous Orchestrator
          </option>
          {models.length > 0 ? (
            models.map(model => (
              <option key={model} value={model} className="bg-slate-900 text-slate-100">
                {model}
              </option>
            ))
          ) : (
            <option value="gemma3:4b" className="bg-slate-900 text-slate-100 italic">No models found</option>
          )}
        </select>
      </div>

      <div className="h-4 w-px bg-outline-variant/30 hidden md:block"></div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/chat" className="text-[#bac4fa] hover:bg-white/10 transition-all duration-300 px-3 py-1 rounded-full text-sm font-medium cursor-pointer">
          Dashboard
        </Link>
        <Link href="/settings" className="text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all duration-300 px-3 py-1 rounded-full text-sm font-medium cursor-pointer">
          Settings
        </Link>
      </nav>
      
      <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
        <Link href="/settings" className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </Link>
        <button className="text-slate-400 hover:text-white transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
        </button>
      </div>
    </header>
  )
}
