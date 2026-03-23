'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'
import { GlowCard } from './ui/spotlight-card'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  images?: string[]
  routedTo?: string
}

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'
  
  // Custom display for document-injected messages
  const hasInjectedContext = message.content.includes('[ANALYSIS REQUESTED FOR ATTACHED DOCUMENTS]')
  const displayContent = hasInjectedContext 
    ? message.content.split('USER QUESTION:')[1]?.trim() || 'Analyzing documents...'
    : message.content

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`group flex items-start gap-5 max-w-[90%] ${isAssistant ? 'self-start' : 'self-end flex-row-reverse'}`}
    >
      {/* Avatar Container */}
      <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 transition-all duration-500 ${
        isAssistant ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800/80 text-slate-300'
      }`}>
        <span className="material-symbols-outlined text-[20px]">
          {isAssistant ? 'auto_awesome' : 'person'}
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Author Metadata */}
        <div className={`flex items-center gap-3 ${!isAssistant ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {isAssistant ? 'Luminous AI' : 'You'}
          </span>
          <span className="text-[10px] font-mono text-slate-600">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAssistant && message.routedTo && (
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-2 duration-700">
              Routed: {message.routedTo.replace(':7b-instruct-v0.3-q4_K_M', '').replace(':latest', '')}
            </span>
          )}
        </div>

        {/* Message Content with Glow Effect */}
        <GlowCard 
          glowColor={isAssistant ? 'blue' : 'purple'}
          customSize={true}
          className={`relative px-5 py-4 transition-all duration-500 overflow-hidden ${
            isAssistant 
              ? 'bg-transparent border-none' 
              : 'px-5 py-4 shadow-2xl border border-white/5 bg-white/5 rounded-xl rounded-tr-none'
          }`}
        >
          {hasInjectedContext && !isAssistant && (
            <div className="flex items-center gap-2 mb-4 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-primary w-fit translate-x-[-4px]">
              <span className="material-symbols-outlined text-sm animate-pulse">description</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Context Injected</span>
            </div>
          )}

          {/* Render User Images if any */}
          {message.images && message.images.length > 0 && (
            <div className={`flex flex-wrap gap-2 mb-4 ${!isAssistant ? 'justify-end' : ''}`}>
              {message.images.map((img, idx) => (
                <div key={idx} className="relative group/img overflow-hidden rounded-xl border border-white/10 shadow-lg max-w-[200px]">
                  <img 
                    src={img.startsWith('data:') ? img : `data:image/png;base64,${img}`} 
                    alt="Attached" 
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="relative my-4 rounded-xl overflow-hidden group/code border border-white/5 bg-[#0d1117] no-scrollbar shadow-2xl">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{match[1]}</span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                          className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-xs">content_copy</span>
                          <span className="text-[9px] font-bold uppercase tracking-tighter">Copy Code</span>
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        customStyle={{ 
                          margin: 0, 
                          background: 'transparent', 
                          padding: '1.25rem',
                          fontSize: '0.875rem', 
                          lineHeight: '1.6'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-white/10 text-white px-1.5 py-0.5 rounded-md font-mono text-[0.9em]" {...props}>
                      {children}
                    </code>
                  )
                },
                table({ children }) {
                  return (
                    <div className="my-6 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                      <table className="w-full text-left border-collapse">{children}</table>
                    </div>
                  )
                },
                th({ children }) {
                  return <th className="px-4 py-3 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-white/10">{children}</th>
                },
                td({ children }) {
                  return <td className="px-4 py-3 text-xs border-b border-white/5 text-slate-300">{children}</td>
                },
                blockquote({ children }) {
                  return <blockquote className="border-l-4 border-white/20 pl-4 my-4 italic text-slate-400">{children}</blockquote>
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 my-4 space-y-2 text-slate-300">{children}</ul>
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-300">{children}</ol>
                },
                a({ href, children }) {
                  return <a href={href} className="text-secondary hover:underline decoration-white/20 underline-offset-4" target="_blank" rel="noopener noreferrer">{children}</a>
                }
              }}
            >
              {displayContent}
            </ReactMarkdown>
          </div>
        </GlowCard>

        {/* Actions */}
        {isAssistant && (
          <div className="flex gap-4 px-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-5px] group-hover:translate-y-0 mt-1">
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all active:scale-90">
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Copy</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all active:scale-90">
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-all active:scale-90">
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
