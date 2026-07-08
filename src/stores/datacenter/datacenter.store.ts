import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDashboardSummary } from '@/api/datacenter'
import type { DashboardSummary } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('datacenter')

export const useDatacenterStore = defineStore('datacenter', () => {
  const summary = ref<DashboardSummary | null>(null)
  const loading = ref(false)

  async function loadSummary() {
    loading.value = true
    try {
      summary.value = await fetchDashboardSummary()
      logger.info('datacenter summary loaded', summary.value)
    } catch (e) {
      logger.error('load datacenter summary failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { summary, loading, loadSummary }
})
