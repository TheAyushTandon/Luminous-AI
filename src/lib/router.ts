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
    VISION: 'qwen2.5vl:3b',
    GENERAL: 'mistral:7b-instruct-v0.3-q4_K_M',
    AUDIO_ANALYSIS: 'mistral:7b-instruct-v0.3-q4_K_M' // Summarization/Analysis
  }

  async classifyPrompt(prompt: string, images?: string[]): Promise<RouterResult> {
    // 1. SIMPLE HEURISTIC FIRST (Fastest)
    if (images && images.length > 0) {
      return { domain: 'VISION', model: this.modelMap.VISION, reason: 'Detected image input' }
    }
    
    if (prompt.toLowerCase().match(/(image|picture|photo|logo|chart|diagram|describe this)/i)) {
      return { domain: 'VISION', model: this.modelMap.VISION, reason: 'Visual demand detected in text' }
    }

    if (prompt.toLowerCase().match(/(summarize this meeting|transcript|audio|meeting notes|minutes)/i)) {
      return { domain: 'AUDIO_ANALYSIS', model: this.modelMap.AUDIO_ANALYSIS, reason: 'Audio/Meeting context detected' }
    }

    // 2. LLM CLASSIFICATION (Advanced)
    try {
      const classificationPrompt = `Classify this user prompt into exactly one category: [VISION, GENERAL, AUDIO_ANALYSIS].
- VISION: Asking about images, photos, charts, or visual analysis.
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
