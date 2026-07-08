<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import type { MemoryTrendPoint } from '@/api/types'
import { useMemoryTrendStore } from '@/stores/datacenter/memoryTrend.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useMemoryTrendStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => {
  const xData = store.data.map(
    (p: MemoryTrendPoint) =>
      `${p.dt.split('-').slice(1).join('-')} ${String(p.hour).padStart(2, '0')}:00`,
  )
  const avgData = store.data.map((p: MemoryTrendPoint) => p.avg_value)

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: '#8fb6e6', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8fb6e6' },
      splitLine: { lineStyle: { color: 'rgba(64, 158, 255, 0.1)' } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: avgData,
        lineStyle: { color: '#67c23a' },
        areaStyle: { color: 'rgba(103, 194, 58, 0.1)' },
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
  <ChartCard title="内存使用趋势" class="chart-module">
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
