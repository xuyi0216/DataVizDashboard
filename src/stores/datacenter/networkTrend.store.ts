import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchNetworkTrend } from '@/api/datacenter'
import type { NetworkTrendPoint } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('networkTrend')

export const useNetworkTrendStore = defineStore('networkTrend', () => {
  const data = ref<NetworkTrendPoint[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      data.value = await fetchNetworkTrend()
    } catch (e) {
      logger.error('load network trend failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, load }
})
