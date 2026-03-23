'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Waves } from '@/components/ui/Waves'

export default function Home() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleGetStarted = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      router.push('/chat')
    }, 400)
  }

  return (
    <div 
      className={`relative min-h-screen overflow-hidden transition-opacity duration-400 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Wave Background */}
      <Waves 
        strokeColor="#bac4fa" 
        backgroundColor="#0B0F14"
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center space-y-6 max-w-4xl">
          {/* Title */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white font-headline">
            Luminous AI
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto">
            Your Private Intelligence Workspace
          </p>

          {/* Description */}
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Experience AI-powered conversations with complete privacy. 
            Running locally on your machine, your data never leaves your control.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </button>

            <button
              onClick={() => window.open('https://github.com', '_blank')}
              className="px-8 py-3.5 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-base hover:bg-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              Learn More
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto">
            <div className="glass-card p-5 rounded-xl border border-white/10 hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl mb-2 block">security</span>
              <h3 className="text-base font-bold text-white mb-1">Privacy First</h3>
              <p className="text-xs text-slate-400">100% local processing</p>
            </div>

            <div className="glass-card p-5 rounded-xl border border-white/10 hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl mb-2 block">speed</span>
              <h3 className="text-base font-bold text-white mb-1">Lightning Fast</h3>
              <p className="text-xs text-slate-400">GPU accelerated inference</p>
            </div>

            <div className="glass-card p-5 rounded-xl border border-white/10 hover:border-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl mb-2 block">offline_bolt</span>
              <h3 className="text-base font-bold text-white mb-1">Works Offline</h3>
              <p className="text-xs text-slate-400">No internet required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0B0F14] to-transparent pointer-events-none z-20"></div>
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0B0F14] to-transparent pointer-events-none z-20"></div>
    </div>
  )
}
