import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAlerts } from '@/api/datacenter'
import type { AlertItem } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('alerts')

export const useAlertsStore = defineStore('alerts', () => {
  const data = ref<AlertItem[]>([])
  const loading = ref(false)

  async function load(limit = 20) {
    loading.value = true
    try {
      data.value = await fetchAlerts(limit)
    } catch (e) {
      logger.error('load alerts failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, load }
})
