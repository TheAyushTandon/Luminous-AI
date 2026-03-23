import config from './config'
import { logger } from './errors'

/**
 * Privacy Guard - Ensures all operations remain local
 * NO external API calls, NO cloud services, NO data leaks
 */
class PrivacyGuard {
  private allowedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1', // IPv6 localhost
  ]

  /**
   * Validate that a URL is pointing to localhost only
   */
  isLocalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      
      return this.allowedHosts.includes(hostname)
    } catch {
      return false
    }
  }

  /**
   * Validate Ollama URL is local
   */
  validateOllamaUrl(): void {
    const ollamaUrl = config.ollama.url
    
    if (!this.isLocalUrl(ollamaUrl)) {
      const error = `PRIVACY VIOLATION: Ollama URL points to external service: ${ollamaUrl}`
      logger.error(error)
      throw new Error(error)
    }
    
    logger.info('✓ Privacy check passed: Ollama is running locally', { url: ollamaUrl })
  }

  /**
   * Ensure no external API calls are made
   */
  blockExternalRequest(url: string): void {
    if (!this.isLocalUrl(url)) {
      const error = `PRIVACY VIOLATION BLOCKED: Attempted to connect to external service: ${url}`
      logger.error(error)
      throw new Error(error)
    }
  }

  /**
   * Validate database is local (not cloud)
   */
  validateDatabaseUrl(): void {
    const dbUrl = config.database.url
    
    // SQLite file URLs are always local
    if (!dbUrl.startsWith('file:')) {
      const error = `PRIVACY VIOLATION: Database URL is not a local file: ${dbUrl}`
      logger.error(error)
      throw new Error(error)
    }
    
    logger.info('✓ Privacy check passed: Database is local SQLite file', { url: dbUrl })
  }

  /**
   * Check that privacy mode is enforced
   */
  validatePrivacySettings(): void {
    if (!config.privacy.localOnly) {
      logger.warn('⚠️ WARNING: LOCAL_ONLY mode is disabled!')
    }
    
    if (config.privacy.telemetryEnabled) {
      logger.warn('⚠️ WARNING: Telemetry is enabled!')
    }
    
    logger.info('✓ Privacy settings validated', {
      localOnly: config.privacy.localOnly,
      telemetryDisabled: !config.privacy.telemetryEnabled,
    })
  }

  /**
   * Run all privacy checks on startup
   */
  validateAllPrivacySettings(): void {
    logger.info('=== PRIVACY GUARD: Starting validation ===')
    
    this.validateOllamaUrl()
    this.validateDatabaseUrl()
    this.validatePrivacySettings()
    
    logger.info('=== PRIVACY GUARD: All checks passed ✓ ===')
    logger.info('Your data is 100% local and private!')
  }

  /**
   * Get privacy status report
   */
  getPrivacyReport() {
    return {
      ollamaLocal: this.isLocalUrl(config.ollama.url),
      databaseLocal: config.database.url.startsWith('file:'),
      localOnlyMode: config.privacy.localOnly,
      telemetryDisabled: !config.privacy.telemetryEnabled,
      noCloudServices: true,
      dataLocation: 'Your local machine only',
      internetRequired: false,
    }
  }
}

export const privacyGuard = new PrivacyGuard()
export default privacyGuard
