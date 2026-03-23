import { NextResponse } from 'next/server'
import ollamaService from '@/lib/ollama'
import { handleApiError, logger } from '@/lib/errors'

export async function GET() {
  try {
    // Check if Ollama is available
    const available = await ollamaService.isAvailable()
    
    if (!available) {
      return NextResponse.json({
        models: [],
        available: false,
        error: 'Ollama service is not running',
        message: 'Please start Ollama: ollama serve',
      }, { status: 503 })
    }

    // Get models
    const models = await ollamaService.listModels()

    logger.info('Models fetched successfully', { count: models.length })

    return NextResponse.json({
      models,
      available: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Error fetching models:', error)
    const errorData = handleApiError(error)
    return NextResponse.json({
      models: [],
      available: false,
      ...errorData,
    }, { status: errorData.statusCode })
  }
}
