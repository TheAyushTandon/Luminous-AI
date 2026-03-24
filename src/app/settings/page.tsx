'use client'

import { useState, useEffect } from 'react'
import TopNavBar from '@/components/TopNavBar'
import SideNavBar from '@/components/SideNavBar'
import BottomNavBar from '@/components/BottomNavBar'
import apiClient from '@/lib/apiClient'

interface ModelInfo {
  name: string
  size: number
  modified_at: string
}

interface TelemetryData {
  cpu: number
  gpu: number
  ram: number
  temp: number
  vramUsed: number
  vramTotal: number
  vramPercent: number
  latency: number
  uptime: string
  tokenVelocity: number[]
  ollamaStatus: string
}

export default function SettingsPage() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    cpu: 0,
    gpu: 0,
    ram: 0,
    temp: 0,
    vramUsed: 0,
    vramTotal: 24,
    vramPercent: 0,
    latency: 0,
    uptime: '0d 0h',
    tokenVelocity: [40, 65, 55, 85, 60, 45, 30, 75, 50, 40],
    ollamaStatus: 'checking'
  })

  useEffect(() => {
    fetchModels()
    fetchTelemetry()
    
    // Fetch telemetry every 2 seconds
    const interval = setInterval(() => {
      fetchTelemetry()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const fetchModels = async () => {
    try {
      const data = await apiClient.getModels()
      setModels(data.models || [])
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTelemetry = async () => {
    try {
      const data = await apiClient.getTelemetry()
      setTelemetry({
        cpu: data.system.cpu.usage,
        gpu: data.system.gpu.usage,
        ram: data.system.memory.usage,
        temp: data.system.temperature,
        vramUsed: data.system.gpu.vram.used,
        vramTotal: data.system.gpu.vram.total,
        vramPercent: data.system.gpu.vram.usagePercent,
        latency: data.system.latency,
        uptime: data.system.uptime.formatted,
        tokenVelocity: data.metrics.tokenVelocity,
        ollamaStatus: data.ollama.status
      })
    } catch (error) {
      console.error('Failed to fetch telemetry:', error)
    }
  }

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <TopNavBar isLocalRunning={telemetry.ollamaStatus === 'online'} />
        <SideNavBar />
        
        <main className="ml-72 pt-28 pb-32 px-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">System Settings</h2>
                <p className="text-on-surface-variant max-w-md">
                  Configure your local inference engine and manage model orchestration parameters.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-secondary-container/20 px-4 py-2 rounded-full border border-secondary/10">
                <div className={`w-2 h-2 rounded-full ${telemetry.ollamaStatus === 'online' ? 'bg-secondary status-glow-success' : 'bg-red-500'} animate-pulse`}></div>
                <span className={`text-sm font-semibold ${telemetry.ollamaStatus === 'online' ? 'text-secondary' : 'text-red-400'}`}>
                  Engine {telemetry.ollamaStatus === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-6">
              {/* Telemetry Hub */}
              <section className="col-span-12 lg:col-span-8 glass-card rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-fixed-dim">analytics</span>
                    <h3 className="text-xl font-bold text-white">Live Telemetry</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span>POLLING: 2000ms</span>
                    <span className="text-secondary">Uptime: {telemetry.uptime}</span>
                  </div>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">VRAM Usage</span>
                      <span className="text-lg font-mono text-on-surface">{telemetry.vramUsed} / {telemetry.vramTotal} GB</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-on-surface/40 rounded-full" style={{ width: `${telemetry.vramPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Compute Load</span>
                      <span className="text-lg font-mono text-on-surface">{telemetry.cpu}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-on-surface/40 rounded-full transition-all duration-500"
                        style={{ width: `${telemetry.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Latency</span>
                      <span className="text-lg font-mono text-on-surface">{telemetry.latency}ms</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min((telemetry.latency / 100) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Token Generation Chart */}
                <div className="mt-12">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">
                    Token Generation Velocity (t/s)
                  </p>
                  <div className="flex items-end gap-2 h-32">
                    {telemetry.tokenVelocity.map((height, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-lg transition-all hover:brightness-110 ${
                          i === telemetry.tokenVelocity.length - 1 ? 'bg-primary-container' : 'bg-surface-container-highest'
                        }`}
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Active Model Panel */}
              <section className="col-span-12 lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary-container">memory</span>
                  <h3 className="text-xl font-bold text-white">Active Model</h3>
                </div>
                
                <div className="flex-1">
                  <div className="p-6 bg-primary-container/10 border border-primary-container/20 rounded-2xl mb-6 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/20 blur-3xl group-hover:bg-primary-container/30 transition-all"></div>
                    <h4 className="text-lg font-bold text-white mb-1 relative z-10">Llama 3.1 70B</h4>
                    <p className="text-xs font-mono text-primary-fixed-dim mb-3 relative z-10">Quantization: Q4_K_M</p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-slate-300 border border-white/5">INFERENCE</span>
                      <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-slate-300 border border-white/5">CUDA</span>
                      <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-slate-300 border border-white/5">FLASH_ATTN</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">Stream Responses</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <div className="w-11 h-6 bg-primary-container rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">Context Window [32k]</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <div className="w-11 h-6 bg-primary-container rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-white/5 rounded-xl text-sm font-bold text-slate-300 hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">eject</span>
                  Unload Model
                </button>
              </section>

              {/* Model Library */}
              <section className="col-span-12 glass-card rounded-3xl p-8">
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">auto_awesome</span>
                    Luminous Recommended (Best Performance)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'llava:7b', name: 'LLaVA 7B', role: 'Vision Engine', desc: 'Fast and reliable multi-modal model for image and document analysis.' },
                      { id: 'mistral:instruct', name: 'Mistral 7B', role: 'Logic Specialist', desc: 'World-class text reasoning, code, and logical documentation.' }
                    ].map(rec => (
                      <div key={rec.id} className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-start justify-between group hover:bg-primary/10 transition-all">
                        <div className="max-w-[70%]">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-white">{rec.name}</h4>
                            <span className="px-1.5 py-0.5 rounded bg-primary/20 text-[8px] font-black uppercase tracking-widest text-primary">{rec.role}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{rec.desc}</p>
                        </div>
                        <button 
                          onClick={() => {
                            const input = document.getElementById('new-model-input') as HTMLInputElement;
                            input.value = rec.id;
                            input.focus();
                          }}
                          className="p-2 rounded-xl bg-white/5 text-slate-400 group-hover:text-primary transition-all hover:scale-110"
                        >
                          <span className="material-symbols-outlined text-xl">download_for_offline</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">library_books</span>
                    <h3 className="text-xl font-bold text-white">Model Library</h3>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter model name (e.g. llama3.2-vision)" 
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-primary/50 transition-all min-w-[240px]"
                      id="new-model-input"
                    />
                    <button 
                      onClick={async () => {
                        const input = document.getElementById('new-model-input') as HTMLInputElement;
                        const name = input.value.trim();
                        if (!name) return;
                        try {
                          setIsLoading(true);
                          await apiClient.pullModel(name);
                          alert(`Started pulling ${name}. This may take a few minutes. Check your terminal for progress.`);
                          input.value = '';
                        } catch (err) {
                          alert(`Failed to pull model: ${err}`);
                        } finally {
                          setIsLoading(false);
                          fetchModels();
                        }
                      }}
                      className="bg-primary text-black px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Pull Model
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {isLoading ? (
                    <div className="col-span-4 flex items-center justify-center py-8">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  ) : models.length > 0 ? (
                    <>
                      {models.map((model) => (
                        <div key={model.name} className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group relative cursor-pointer">
                          <div className="absolute top-4 right-4 text-xs font-mono text-slate-500">
                            {formatSize(model.size)}
                          </div>
                          <h5 className="text-white font-bold mb-1 truncate pr-16">{model.name.split(':')[0]}</h5>
                          <p className="text-xs text-on-surface-variant mb-4">
                            Tag: {model.name.split(':')[1] || 'latest'}
                          </p>
                          <button className="w-full py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300 group-hover:bg-primary group-hover:text-black transition-all">
                            Load Instance
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="col-span-4 text-center py-8">
                      <p className="text-sm text-on-surface-variant">No models found</p>
                      <p className="text-xs text-slate-500 mt-2">Enter a model name above to download</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-slate-900/60 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">settings</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight font-headline text-[#bac4fa]">Luminous AI</h1>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Running Locally</span>
            </div>
          </div>
        </header>

        <main className="pt-20 px-4 space-y-6 pb-32">
          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary px-2">Hardware Telemetry</h2>
            
            <div className="glass-card rounded-lg p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">memory</span>
                  <span className="font-headline font-bold text-sm">Neural Core (CPU)</span>
                </div>
                <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{telemetry.cpu}%</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${telemetry.cpu}%` }}
                ></div>
              </div>
            </div>

            <div className="glass-card rounded-lg p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  <span className="font-headline font-bold text-sm">GPU Engine</span>
                </div>
                <span className="font-mono text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded">{telemetry.gpu}%</span>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${telemetry.gpu}%` }}
                ></div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary px-2">Local Model Library</h2>
            
            {models.map((model, i) => (
              <div key={model.name} className={`glass-card rounded-lg p-4 border flex items-center justify-between ${
                i === 0 ? 'border-primary/20' : 'border-white/5 opacity-70'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i === 0 ? 'bg-primary/20' : 'bg-white/5'
                  }`}>
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">{model.name.split(':')[0]}</p>
                    <p className="text-[10px] font-mono text-slate-500">{formatSize(model.size)}</p>
                  </div>
                </div>
                <button className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full ${
                  i === 0 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}>
                  {i === 0 ? 'Active' : 'Load'}
                </button>
              </div>
            ))}
          </section>
        </main>

        <BottomNavBar activePage="settings" />
      </div>

      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/10 blur-[120px] pointer-events-none -z-10"></div>
    </div>
  )
}
