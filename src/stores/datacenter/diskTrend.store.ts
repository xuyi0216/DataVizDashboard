import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDiskTrend } from '@/api/datacenter'
import type { DiskTrendPoint } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('diskTrend')

export const useDiskTrendStore = defineStore('diskTrend', () => {
  const data = ref<DiskTrendPoint[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      data.value = await fetchDiskTrend()
    } catch (e) {
      logger.error('load disk trend failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, load }
})
