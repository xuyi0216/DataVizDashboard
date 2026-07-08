<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import type { CpuTrendPoint } from '@/api/types'
import { useCpuTrendStore } from '@/stores/datacenter/cpuTrend.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useCpuTrendStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => {
  const xData = store.data.map(
    (p: CpuTrendPoint) =>
      `${p.dt.split('-').slice(1).join('-')} ${String(p.hour).padStart(2, '0')}:00`,
  )
  const avgData = store.data.map((p: CpuTrendPoint) => p.avg_value)
  const maxData = store.data.map((p: CpuTrendPoint) => p.max_value)
  const minData = store.data.map((p: CpuTrendPoint) => p.min_value)

  return {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['平均使用率', '最高使用率', '最低使用率'],
      textStyle: { color: '#cfe3ff' },
      top: 0,
    },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: { color: '#8fb6e6', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: '#8fb6e6' },
      splitLine: { lineStyle: { color: 'rgba(64, 158, 255, 0.1)' } },
    },
    series: [
      {
        name: '平均使用率',
        type: 'line',
        smooth: true,
        data: avgData,
        lineStyle: { color: '#409eff' },
        areaStyle: { color: 'rgba(64, 158, 255, 0.1)' },
      },
      {
        name: '最高使用率',
        type: 'line',
        smooth: true,
        data: maxData,
        lineStyle: { color: '#f56c6c', type: 'dashed' },
      },
      {
        name: '最低使用率',
        type: 'line',
        smooth: true,
        data: minData,
        lineStyle: { color: '#67c23a', type: 'dashed' },
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
  <ChartCard title="CPU 使用率趋势" class="chart-module">
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
