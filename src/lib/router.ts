import ollamaService from './ollama'
import { logger } from './errors'

export type ModelDomain = 'VISION' | 'GENERAL' | 'AUDIO_ANALYSIS'

export interface RouterResult {
  domain: ModelDomain
  model: string
  reason: string
}

class RouterService {
  private routerModel = 'qwen2.5:0.5b'
  
  // Model mapping
  private modelMap: Record<ModelDomain, string> = {
    VISION: 'llava:7b',
    GENERAL: 'mistral:7b-instruct-v0.3-q4_K_M',
    AUDIO_ANALYSIS: 'mistral:7b-instruct-v0.3-q4_K_M' // Summarization/Analysis
  }

  async classifyPrompt(messages: any[]): Promise<RouterResult> {
    const lastMessage = messages[messages.length - 1]
    const prompt = lastMessage.content || ''
    const currentImages = lastMessage.images || []
    
    // 1. SIMPLE HEURISTIC FIRST (Fastest)
    if (currentImages.length > 0) {
      return { domain: 'VISION', model: this.modelMap.VISION, reason: 'Detected image input' }
    }
    
    // Check if previous messages had images (Context Awareness)
    const recentHistory = messages.slice(-4) // Look at last 2 turns
    const hadImagesRecently = recentHistory.some(m => m.images && m.images.length > 0)
    
    const visualKeywords = /(image|picture|photo|logo|chart|diagram|describe this|tell me more about it|what is this|look at that)/i
    
    if (prompt.toLowerCase().match(visualKeywords)) {
      return { domain: 'VISION', model: this.modelMap.VISION, reason: 'Visual demand or follow-up detected' }
    }

    // Stickiness: If we recently had an image and the prompt is short/referential, stay in VISION
    if (hadImagesRecently && prompt.length < 100 && prompt.toLowerCase().match(/(it|this|that|there|describe|explain|show)/i)) {
      return { domain: 'VISION', model: this.modelMap.VISION, reason: 'Contextual stickiness (follow-up on image)' }
    }

    if (prompt.toLowerCase().match(/(summarize this meeting|transcript|audio|meeting notes|minutes)/i)) {
      return { domain: 'AUDIO_ANALYSIS', model: this.modelMap.AUDIO_ANALYSIS, reason: 'Audio/Meeting context detected' }
    }

    // 2. LLM CLASSIFICATION (Advanced) - only if not obvious
    try {
      const classificationPrompt = `Classify this user prompt into exactly one category: [VISION, GENERAL, AUDIO_ANALYSIS].
- VISION: Asking about images, photos, charts, or visual analysis. Also any follow-up questions about a previously shown image.
- AUDIO_ANALYSIS: Asking to summarize a meeting, transcript, or audio file.
- GENERAL: General questions, coding, creative writing, or math.

Reply with ONLY the category name.
Prompt: "${prompt.slice(0, 500)}"`

      const response = await ollamaService.chat({
        model: this.routerModel,
        messages: [{ role: 'user', content: classificationPrompt }],
        options: { temperature: 0, num_predict: 20 }
      })

      const category = response.message.content.trim().toUpperCase() as ModelDomain
      if (this.modelMap[category]) {
        return { 
          domain: category, 
          model: this.modelMap[category], 
          reason: `LLM Router selected ${category}` 
        }
      }
    } catch (error) {
      logger.error('Router classification failed, falling back to General', error)
    }

    return { domain: 'GENERAL', model: this.modelMap.GENERAL, reason: 'Default fallback' }
  }
}

export const routerService = new RouterService()
export default routerService
