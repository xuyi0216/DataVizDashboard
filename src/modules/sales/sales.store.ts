import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchSalesSummary, type SalesSummary } from '@/api/sales'
import { createLogger } from '@/utils/logger'

const logger = createLogger('sales')

export const useSalesStore = defineStore('sales', () => {
  const summary = ref<SalesSummary | null>(null)
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      summary.value = await fetchSalesSummary()
      logger.info('sales summary loaded', summary.value.totalAmount)
    } catch (e) {
      logger.error('load sales failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { summary, loading, load }
})
