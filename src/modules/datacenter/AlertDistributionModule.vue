<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { useAlertsStore } from '@/stores/datacenter/alerts.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useAlertsStore()
const chartEl = ref<HTMLElement | null>(null)

const severityCounts = computed(() => {
  const counts = { info: 0, warning: 0, critical: 0 }
  for (const a of store.data) {
    counts[a.severity as keyof typeof counts]++
  }
  return counts
})

const option = computed<EChartsOption>(() => {
  const data = [
    { value: severityCounts.value.info, name: '信息', itemStyle: { color: '#409eff' } },
    { value: severityCounts.value.warning, name: '警告', itemStyle: { color: '#e6a23c' } },
    { value: severityCounts.value.critical, name: '严重', itemStyle: { color: '#f56c6c' } },
  ]

  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: { show: true, color: '#cfe3ff', fontSize: 12 },
        data,
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#cfe3ff' },
        },
      },
    ],
  }
})

useChart(chartEl, option)

const { start } = usePolling(() => store.load(), 30000)
onMounted(() => {
  store.load()
  start()
})
</script>

<template>
  <ChartCard title="告警等级分布" class="chart-module">
    <div ref="chartEl" class="chart-module__chart" />
    <p v-if="store.loading" class="chart-module__hint">加载中...</p>
  </ChartCard>
</template>

<style scoped>
.chart-module {
  height: 100%;
}
.chart-module__chart {
  width: 100%;
  height: 100%;
}
.chart-module__hint {
  color: #8fb6e6;
  text-align: center;
}
</style>
