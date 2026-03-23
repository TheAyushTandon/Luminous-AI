'use client'

import TopNavBar from '@/components/TopNavBar'
import SideNavBar from '@/components/SideNavBar'
import BottomNavBar from '@/components/BottomNavBar'

export default function AudioPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="hidden lg:block">
        <TopNavBar isLocalRunning={true} />
        <SideNavBar />
        
        <main className="ml-72 pt-28 pb-32 px-10">
          <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-primary-container/20 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>mic</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Audio Intelligence</h1>
              <p className="text-on-surface-variant max-w-md">
                Voice transcription, speaker diarization, and audio analysis with Whisper. Coming soon.
              </p>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-slate-900/60 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">mic</span>
            <span className="text-lg font-black tracking-tighter text-[#bac4fa]">Audio</span>
          </div>
        </header>

        <main className="pt-20 pb-40 px-6 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-primary-container/20 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>mic</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Audio Intelligence</h1>
            <p className="text-on-surface-variant max-w-xs">
              Voice transcription, speaker diarization, and audio analysis with Whisper. Coming soon.
            </p>
          </div>
        </main>

        <BottomNavBar activePage="audio" />
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-5%] right-[5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] pointer-events-none z-[-1]"></div>
    </div>
  )
}
