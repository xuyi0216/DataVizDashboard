import instance from '@/api/request'
import MockAdapter from 'axios-mock-adapter'
import { mockSales } from './sales'
import { mockDatacenter } from './datacenter'
import { createLogger } from '@/utils/logger'

const logger = createLogger('mock')

/**
 * 挂载本地 Mock 适配器到统一的请求实例上。
 * 仅当 VITE_USE_MOCK=true 时由 main.ts 调用。
 * 未匹配的请求（onNoMatch='passthrough'）会走真实网络，方便逐步切换。
 */
export function setupMock(): void {
  const mock = new MockAdapter(instance, {
    delayResponse: 300,
    onNoMatch: 'passthrough',
  })
  mockSales(mock)
  mockDatacenter(mock)
  logger.info('mock adapters installed')
}
