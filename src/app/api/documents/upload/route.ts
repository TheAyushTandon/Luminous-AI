import { NextRequest, NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'
import path from 'path'
import { pathToFileURL } from 'url'
import whisperService from '@/lib/whisper'

// We must use the internal worker of the pdf-parse library to ensure the API version 
// matches the Worker version exactly.
const workerAbsolutePath = path.join(
  process.cwd(), 
  'node_modules',
  'pdf-parse',
  'node_modules',
  'pdfjs-dist',
  'build',
  'pdf.worker.mjs'
)

const workerUrl = pathToFileURL(workerAbsolutePath).href
PDFParse.setWorker(workerUrl)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const fileName = file.name.toLowerCase()
    
    let extractedText = ''
    let visuals: string[] = []

    if (fileName.endsWith('.pdf')) {
      const parser = new PDFParse({ data: buffer })
      const data = await parser.getText()
      extractedText = data.text
      await parser.destroy()

      // --- PURE JS IMAGE EXTRACTION (JPEG & PNG) ---
      let pos = 0
      while (visuals.length < 5) { // Limit to 5 images for performance
        // Check for JPEG (FF D8 ... FF D9)
        const jpgStart = buffer.indexOf(Buffer.from([0xff, 0xd8]), pos)
        
        // Check for PNG (89 50 4E 47 ... 49 45 4E 44 AE 42 60 82)
        const pngStart = buffer.indexOf(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pos)
        
        if (jpgStart === -1 && pngStart === -1) break
        
        // Pick the earliest match
        const isPng = (jpgStart === -1) || (pngStart !== -1 && pngStart < jpgStart)
        const start = isPng ? pngStart : jpgStart
        
        let end = -1
        if (isPng) {
          const iend = buffer.indexOf(Buffer.from('IEND'), start)
          if (iend !== -1) end = iend + 8 // Include CRC
        } else {
          end = buffer.indexOf(Buffer.from([0xff, 0xd9]), start)
          if (end !== -1) end = end + 2
        }

        if (end === -1 || end <= start) {
          pos = start + 1
          continue
        }

        const imgBuffer = buffer.subarray(start, end)
        if (imgBuffer.length > 5000) { // Ignore small icons/noise
          const mime = isPng ? 'image/png' : 'image/jpeg'
          visuals.push(`data:${mime};base64,${imgBuffer.toString('base64')}`)
        }
        pos = end
      }
      // --- END EXTRACTION ---

    } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      extractedText = buffer.toString('utf8')
    } else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav') || fileName.endsWith('.m4a') || fileName.endsWith('.mp4')) {
      // Audio transcription attempt
      try {
        const transcript = await whisperService.transcribe(buffer, file.name)
        extractedText = `[AUDIO/VIDEO TRANSCRIPT: ${fileName}]\n\n${transcript}\n\nSYSTEM: Analyze this transcript and provide meeting summaries, key take-aways, and action items.`
      } catch (err) {
        extractedText = `[AUDIO/VIDEO UPLOADED: ${fileName}]\nSYSTEM: Audio file detected but Whisper service is offline. Please summarize this meeting request contextually.`
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF, TXT, MD, or Audio files.' }, { status: 400 })
    }

    return NextResponse.json({
      status: 'success',
      filename: file.name,
      content: extractedText,
      visuals: visuals, // New field for automatic UI/AI consumption
      wordCount: extractedText.split(/\s+/).length || 0,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Next.js Document error:', error)
    return NextResponse.json({ 
      error: 'Failed to process document',
      message: error.message 
    }, { status: 500 })
  }
}
