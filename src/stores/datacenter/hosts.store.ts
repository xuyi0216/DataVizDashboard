import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchHosts } from '@/api/datacenter'
import type { HostSummary } from '@/api/types'
import { createLogger } from '@/utils/logger'

const logger = createLogger('hosts')

export const useHostsStore = defineStore('hosts', () => {
  const data = ref<HostSummary[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      data.value = await fetchHosts()
    } catch (e) {
      logger.error('load hosts failed', (e as Error).message)
    } finally {
      loading.value = false
    }
  }

  return { data, loading, load }
})
