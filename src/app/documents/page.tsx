'use client'

import TopNavBar from '@/components/TopNavBar'
import SideNavBar from '@/components/SideNavBar'
import { useChatStore } from '@/store/useChatStore'
import Link from 'next/link'

export default function DocumentsPage() {
  const { attachedDocs, isSidebarCollapsed } = useChatStore()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="hidden lg:block">
        <TopNavBar isLocalRunning={true} />
        <SideNavBar />
        
        <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-72'} pt-28 px-10`}>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-white mb-2 uppercase italic">Document Intelligence</h2>
                <p className="text-slate-500 max-w-md font-medium">
                  Document analysis is now fully integrated into your Chat. Upload PDFs or Text files in the Chat window to begin analysis.
                </p>
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Active Analysis */}
              <div className="col-span-12 lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[32px] p-10 shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">description</span>
                  </div>
                  <h3 className="text-xl font-bold">Active for Analysis</h3>
                </div>

                {attachedDocs.length > 0 ? (
                  <div className="space-y-4">
                    {attachedDocs.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-6">
                          <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-primary transition-colors">pdf_50</span>
                          <div>
                            <p className="font-bold text-lg">{doc.name}</p>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Ready for Chat Analysis • {doc.content.length} characters extracted</p>
                          </div>
                        </div>
                        <Link href="/chat" className="px-6 py-2 bg-primary text-black font-black text-xs rounded-full uppercase tracking-tighter hover:scale-105 transition-transform">
                          Analyze In Chat
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-50">
                    <span className="material-symbols-outlined text-6xl text-slate-700 mb-6">upload_file</span>
                    <p className="text-slate-500 font-medium">No documents currently attached.</p>
                    <Link href="/chat" className="text-primary text-sm font-bold hover:underline mt-4 inline-block">
                      Go to Chat to upload files →
                    </Link>
                  </div>
                )}
              </div>

              {/* Guide Panel */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-white/5 border border-white/5 rounded-[32px] p-8">
                  <h4 className="font-bold text-indigo-400 mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <span className="material-symbols-outlined text-sm">info</span>
                    How it works
                  </h4>
                  <ul className="space-y-4 text-sm text-slate-400">
                    <li className="flex gap-3">
                      <span className="text-primary font-black">01</span>
                      <span>Upload any **PDF** or **TXT** file directly in the Chat window.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-black">02</span>
                      <span>Luminous AI automatically extracts every word from your document.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-black">03</span>
                      <span>Ask questions like "Summarize the findings" or "Find the key dates."</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] p-8">
                  <span className="material-symbols-outlined text-indigo-400 mb-4">security</span>
                  <h4 className="font-bold text-white mb-2">Privacy First</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unlike cloud bots, your documents never leave this device. Analysis happens 100% locally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
