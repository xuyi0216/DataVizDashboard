import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMemoryTrend } from '@/api/datacenter'
import type { MemoryTrendPoint } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('memoryTrend')

export const useMemoryTrendStore = defineStore('memoryTrend', () => {
  const data = ref<MemoryTrendPoint[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      data.value = await fetchMemoryTrend()
    } catch (e) {
      logger.error('load memory trend failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, load }
})
