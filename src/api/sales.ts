import { request } from './request'

export interface SalesTrendItem {
  date: string
  amount: number
}

export interface SalesSummary {
  totalAmount: number
  orderCount: number
  trend: SalesTrendItem[]
}

/**
 * 销售模块接口定义。
 * Mock 与真实 API 共用同一函数签名，切换数据源对调用方透明。
 */
export function fetchSalesSummary(): Promise<SalesSummary> {
  return request<SalesSummary>({ url: '/sales/summary', method: 'get' })
}
