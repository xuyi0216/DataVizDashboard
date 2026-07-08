import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCpuTrend } from '@/api/datacenter'
import type { CpuTrendPoint } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('cpuTrend')

export const useCpuTrendStore = defineStore('cpuTrend', () => {
  const data = ref<CpuTrendPoint[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      data.value = await fetchCpuTrend()
    } catch (e) {
      logger.error('load cpu trend failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, load }
})
