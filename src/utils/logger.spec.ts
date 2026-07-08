import { afterEach, describe, expect, it, vi } from 'vitest'
import { Logger } from './logger'

describe('Logger', () => {
  afterEach(() => vi.restoreAllMocks())

  it('只输出 >= minLevel 的日志', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const logger = new Logger({ namespace: 't', minLevel: 'info' })

    logger.debug('should not appear')
    logger.info('should appear')

    expect(debugSpy).not.toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalledWith('[t]', 'should appear', '')
  })

  it('error 级别会调用 console.error', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const logger = new Logger({ namespace: 't' })
    logger.error('boom')
    expect(errorSpy).toHaveBeenCalledWith('[t]', 'boom', '')
  })

  it('onEmit 钩子会被触发，便于接入日志系统', () => {
    const onEmit = vi.fn()
    const logger = new Logger({ namespace: 't', onEmit })
    logger.error('boom')
    expect(onEmit).toHaveBeenCalledWith('error', 'boom', undefined)
  })
})
