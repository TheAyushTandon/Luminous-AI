import axios from 'axios'
import { logger } from './errors'

class WhisperService {
  private baseUrl = 'http://localhost:8080/v1' // Default for faster-whisper-server
  
  async transcribe(file: Buffer, filename: string): Promise<string> {
    try {
      const formData = new FormData()
      // Convert Node Buffer to Blob
      const blob = new Blob([file.buffer], { type: 'audio/mpeg' })
      formData.append('file', blob, filename)
      formData.append('model', 'base')
      
      const response = await axios.post(`${this.baseUrl}/audio/transcriptions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      return response.data.text
    } catch (error) {
      logger.error('Whisper transcription failed:', error)
      return `[ERROR: Transcription service not reachable at ${this.baseUrl}. Please follow the "Luminous Audio Setup" guide.]`
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/models`, { timeout: 2000 })
      return true
    } catch {
      return false
    }
  }
}

export const whisperService = new WhisperService()
export default whisperService
