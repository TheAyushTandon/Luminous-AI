'use client'

import { useState, useRef } from 'react'
import { useChatStore } from '@/store/useChatStore'
import apiClient from '@/lib/apiClient'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const { isSidebarCollapsed, attachedDocs, setAttachedDocs } = useChatStore()
  const [input, setInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stopListening = () => {
    setIsListening(false)
  }

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + (prev.trim() ? ' ' : '') + transcript)
    }

    recognition.start()
  }

  const processFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setAttachedDocs([...attachedDocs, {
          name: file.name || `Pasted Image ${attachedDocs.length + 1}`,
          content: base64,
          type: file.type
        }])
      }
      reader.readAsDataURL(file)
    } else if (file.type.match(/pdf|text|markdown|plain/)) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      try {
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        if (data.status === 'success') {
          setAttachedDocs([...attachedDocs, {
            name: data.filename,
            content: data.content,
            type: file.type,
            visuals: data.visuals // Automated visuals from the PDF
          }])
        }
      } catch (err) {
        console.error('File drop processing failed:', err)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = () => {
    if ((input.trim() || attachedDocs.length > 0) && !disabled) {
      onSendMessage(input)
      setInput('')
      // Preserve attached docs for the store to handle sending
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeDoc = (index: number) => {
    setAttachedDocs(attachedDocs.filter((_, i) => i !== index))
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (const item of Array.from(items)) {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) processFile(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => processFile(file))
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center px-4 pb-8 pointer-events-none transition-all duration-300 ${isSidebarCollapsed ? 'pl-4' : 'lg:pl-72'}`}
    >
      {/* Drag Over Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm border-2 border-dashed border-primary/50 m-4 rounded-[32px] flex items-center justify-center z-50 pointer-events-none">
          <div className="flex flex-col items-center gap-4 animate-bounce">
            <span className="material-symbols-outlined text-6xl text-primary">add_circle</span>
            <span className="text-xl font-black text-primary uppercase tracking-widest">Drop to Analyze</span>
          </div>
        </div>
      )}

      {/* Attached Docs & Images Preview */}
      {attachedDocs.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3 max-w-3xl w-full pointer-events-auto">
          {attachedDocs.map((doc, i) => {
            const isImage = doc.type.startsWith('image/')
            return (
              <div key={i} className="group relative flex items-center gap-2 bg-white/10 backdrop-blur-3xl border border-white/10 p-1.5 pr-3 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 hover:border-primary/50 transition-all">
                {isImage ? (
                  <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/5">
                    <img src={doc.content} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-primary">description</span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-200 max-w-[120px] truncate uppercase tracking-tighter">{doc.name}</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{isImage ? 'Image' : 'Document'}</span>
                </div>

                <button 
                  onClick={() => removeDoc(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 active:scale-90"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-[#0a0a0a]/40 backdrop-blur-3xl rounded-[20px] max-w-3xl w-full shadow-2xl focus-within:shadow-[0_0_30px_rgba(255,255,255,0.05)] pointer-events-auto border border-white/10 group transition-all duration-300">
        <div className="p-3 flex items-end gap-3">
          {/* File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.txt,.md,image/*"
            onChange={handleFileChange}
          />
          <button 
            className={`p-2.5 text-slate-500 hover:text-primary transition-all rounded-full hover:bg-white/5 ${isUploading ? 'animate-pulse cursor-wait' : ''}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled}
          >
            <span className="material-symbols-outlined text-xl">
              {isUploading ? 'progress_activity' : 'add_circle'}
            </span>
          </button>

          <div className="relative group/voice">
            <AnimatePresence>
              {isListening && (
                <>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="absolute inset-0 border border-primary/30 rounded-full shadow-[0_0_15px_rgba(186,196,250,0.3)]"
                  />
                </>
              )}
            </AnimatePresence>
            
            <button 
              className={`relative z-10 p-2.5 transition-all duration-500 rounded-full hover:bg-white/5 active:scale-95 ${
                isListening ? 'text-primary shadow-[0_0_20px_rgba(186,196,250,0.4)] bg-primary/10' : 'text-slate-500 hover:text-primary'
              }`}
              type="button"
              onClick={handleVoiceInput}
              disabled={disabled}
            >
              <motion.span 
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                className="material-symbols-outlined text-xl"
              >
                {isListening ? 'graphic_eq' : 'mic_none'}
              </motion.span>
            </button>
          </div>

          <div className="flex-1 mb-1">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-[#ffffff] placeholder:text-slate-600 resize-none py-2 font-body outline-none text-sm min-h-[44px] max-h-[200px]"
              placeholder="Message Luminous AI or paste content..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = `${target.scrollHeight}px`
              }}
              disabled={disabled}
            />
          </div>
          
          <div className="flex items-center gap-2 mb-1 pr-2">
            <button
              className="bg-[#bac4fa] text-[#000000] rounded-full p-2.5 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={handleSubmit}
              disabled={disabled || (!input.trim() && attachedDocs.length === 0)}
              type="button"
            >
              <span className="material-symbols-outlined text-xl font-bold">arrow_upward</span>
            </button>
          </div>
        </div>
        
        <div className="px-5 pb-3 flex items-center justify-between border-t border-white/5 pt-2 mx-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
              {isUploading ? 'Extracting Content...' : 'Document Intelligence Active'}
            </span>
          </div>
          <div className="text-[9px] font-mono text-slate-600">
            Press Enter to search documents
          </div>
        </div>
      </div>
    </div>
  )
}
