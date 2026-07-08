import { beforeAll, describe, expect, it } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import instance from '@/api/request'
import { fetchSalesSummary } from '@/api/sales'

describe('sales api', () => {
  beforeAll(() => {
    const mock = new MockAdapter(instance)
    mock.onGet('/sales/summary').reply(200, {
      totalAmount: 5000,
      orderCount: 100,
      trend: [{ date: '2026-07-01', amount: 5000 }],
    })
  })

  it('fetchSalesSummary 返回纯数据（响应拦截已剥离 AxiosResponse）', async () => {
    const data = await fetchSalesSummary()
    expect(data.totalAmount).toBe(5000)
    expect(data.orderCount).toBe(100)
    expect(data.trend).toHaveLength(1)
  })
})
