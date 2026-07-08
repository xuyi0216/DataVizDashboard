/**
 * 轻量级前端日志系统
 * - 支持分级（debug/info/warn/error）
 * - 支持 namespace 区分模块
 * - 支持 onEmit 钩子，便于后续接入远端日志 / 监控系统
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

export interface LoggerOptions {
  namespace?: string
  minLevel?: LogLevel
  onEmit?: (level: LogLevel, message: string, meta?: unknown) => void
}

export class Logger {
  private readonly namespace: string
  private readonly minLevel: LogLevel
  private readonly onEmit?: LoggerOptions['onEmit']

  constructor(options: LoggerOptions = {}) {
    this.namespace = options.namespace ?? 'app'
    this.minLevel = options.minLevel ?? 'debug'
    this.onEmit = options.onEmit
  }

  private enabled(level: LogLevel): boolean {
    return LEVEL_ORDER[level] >= LEVEL_ORDER[this.minLevel]
  }

  private emit(level: LogLevel, message: string, meta?: unknown): void {
    if (!this.enabled(level)) return
    const tag = `[${this.namespace}]`
    switch (level) {
      case 'debug':
        console.debug(tag, message, meta ?? '')
        break
      case 'info':
        console.info(tag, message, meta ?? '')
        break
      case 'warn':
        console.warn(tag, message, meta ?? '')
        break
      case 'error':
        console.error(tag, message, meta ?? '')
        break
    }
    this.onEmit?.(level, message, meta)
  }

  debug(message: string, meta?: unknown): void {
    this.emit('debug', message, meta)
  }

  info(message: string, meta?: unknown): void {
    this.emit('info', message, meta)
  }

  warn(message: string, meta?: unknown): void {
    this.emit('warn', message, meta)
  }

  error(message: string, meta?: unknown): void {
    this.emit('error', message, meta)
  }
}

export function createLogger(
  namespace: string,
  options: Omit<LoggerOptions, 'namespace'> = {},
): Logger {
  return new Logger({ namespace, ...options })
}
