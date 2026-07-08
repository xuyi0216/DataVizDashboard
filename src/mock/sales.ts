import MockAdapter from 'axios-mock-adapter'
import type { SalesSummary } from '@/api/sales'

export function mockSales(mock: MockAdapter): void {
  mock.onGet('/sales/summary').reply(() => {
    const trend = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-07-0${i + 1}`,
      amount: Math.round(1000 + Math.random() * 9000),
    }))
    const summary: SalesSummary = {
      totalAmount: trend.reduce((sum, item) => sum + item.amount, 0),
      orderCount: Math.round(200 + Math.random() * 800),
      trend,
    }
    return [200, summary]
  })
}
