// Custom error classes
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class OllamaError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 503, 'OLLAMA_ERROR', details)
    this.name = 'OllamaError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

// Logger utility
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    }

    if (this.isDevelopment) {
      console.log(JSON.stringify(logData, null, 2))
    } else {
      console.log(JSON.stringify(logData))
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, error?: Error | any) {
    const errorData = error instanceof Error
      ? {
          message: error.message,
          stack: error.stack,
          ...(error as any).details,
        }
      : error

    this.log('error', message, errorData)
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      this.log('debug', message, data)
    }
  }
}

export const logger = new Logger()

// Error handler for API routes
export function handleApiError(error: unknown) {
  logger.error('API Error:', error)

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      details: error.details,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    }
  }

  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  }
}
