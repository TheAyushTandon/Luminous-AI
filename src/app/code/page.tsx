'use client'

import TopNavBar from '@/components/TopNavBar'
import SideNavBar from '@/components/SideNavBar'
import BottomNavBar from '@/components/BottomNavBar'

export default function CodePage() {
  const codeExample = `import torch
from transformers import AutoModelForCausalLM

def optimize_tensor_layout(tensor):
    # Recalculate strides for contiguous memory access
    if not tensor.is_contiguous():
        return tensor.contiguous()
    return tensor

class LuminousCore:
    def __init__(self, model_id):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = AutoModelForCausalLM.from_pretrained(model_id)
        self.model.to(self.device)`

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="hidden lg:block">
        <TopNavBar isLocalRunning={true} />
        <SideNavBar />
        
        <main className="ml-72 pt-24 pb-32 px-12 min-h-screen relative overflow-y-auto max-h-screen">
          <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto h-full">
            {/* Code Editor Section */}
            <section className="col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="bg-surface-container-high px-3 py-1 rounded-full text-[10px] font-accent text-primary-fixed border border-primary/20">
                    MAIN_MODULE.PY
                  </span>
                  <span className="text-slate-500 text-xs font-mono">v1.2.4-stable</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">share</span>
                  </button>
                </div>
              </div>

              {/* Code Display */}
              <div className="glass-panel rounded-2xl border border-outline-variant/15 overflow-hidden shadow-2xl relative flex-1">
                <div className="flex">
                  {/* Line Numbers */}
                  <div className="bg-surface-container-low/50 px-4 py-6 text-right font-mono text-xs text-slate-600 select-none border-r border-white/5">
                    {codeExample.split('\n').map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto w-full text-on-surface-variant">
                    <pre className="whitespace-pre">
                      {codeExample}
                    </pre>
                  </div>
                </div>

                {/* Decorative SVG Pattern */}
                <svg className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 800 600">
                  <path d="M 600 120 L 720 150" fill="none" stroke="#bac4fa" strokeWidth="0.5" />
                  <path d="M 600 145 L 720 280" fill="none" stroke="#bac4fa" strokeDasharray="2,2" strokeWidth="0.5" />
                </svg>
              </div>
            </section>

            {/* AI Insights Panel */}
            <section className="col-span-4 flex flex-col gap-6">
              <div className="text-xs font-accent tracking-widest text-slate-500 uppercase mb-2">
                AI Insights & Analysis
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-outline-variant/15 relative group hover:bg-white/[0.06] transition-all">
                <div className="absolute -left-1 top-6 w-1 h-8 bg-primary rounded-full blur-sm"></div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">memory</span>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Memory Efficiency</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Detected non-contiguous tensor layout at <span className="font-mono text-primary-fixed-dim">Line 6</span>. 
                      Calling <span className="font-mono text-primary-fixed-dim">.contiguous()</span> ensures linear memory 
                      addressing for 14% faster CUDA kernels.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-outline-variant/15 group hover:bg-white/[0.06] transition-all">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Device Mapping</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Fallback logic for CPU inference is correctly implemented at <span className="font-mono text-primary-fixed-dim">Line 13</span>. 
                      Consider pinning memory for host-to-device transfers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refactor Suggestion */}
              <div className="mt-4 p-6 rounded-2xl bg-primary-container/20 border border-primary/10 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Optimization Suggested</p>
                  <h3 className="text-lg font-bold text-white mb-2">Refactor to Flash Attention?</h3>
                  <p className="text-xs text-on-surface-variant mb-4">
                    Implementing Flash Attention v2 would reduce memory complexity from quadratic to linear.
                  </p>
                  <button className="w-full py-2 bg-primary text-on-primary rounded-xl font-bold text-sm hover:brightness-110 transition-all">
                    Apply Refactor Pattern
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-slate-900/60 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">code</span>
            <span className="text-lg font-black tracking-tighter text-[#bac4fa]">Code</span>
          </div>
        </header>

        <main className="pt-20 pb-40 px-6 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-primary-container/20 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>code</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Code Assistant</h1>
            <p className="text-on-surface-variant max-w-xs">
              AI-powered code generation, refactoring, and debugging. Coming soon.
            </p>
          </div>
        </main>

        <BottomNavBar activePage="code" />
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-5%] right-[5%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] pointer-events-none z-[-1]"></div>
    </div>
  )
}
