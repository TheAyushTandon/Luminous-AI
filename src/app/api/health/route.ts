import { NextResponse } from 'next/server'
import ollamaService from '@/lib/ollama'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Check Ollama
    const ollamaAvailable = await ollamaService.isAvailable()
    
    // Check Database
    let databaseAvailable = false
    try {
      await prisma.$queryRaw`SELECT 1`
      databaseAvailable = true
    } catch {
      databaseAvailable = false
    }

    return NextResponse.json({
      status: ollamaAvailable && databaseAvailable ? 'healthy' : 'degraded',
      ollama: ollamaAvailable,
      database: databaseAvailable,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      ollama: false,
      database: false,
      error: 'Health check failed',
    }, { status: 503 })
  }
}
