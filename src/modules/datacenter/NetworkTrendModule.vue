<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import type { NetworkTrendPoint } from '@/api/types'
import { useNetworkTrendStore } from '@/stores/datacenter/networkTrend.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useNetworkTrendStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => {
  const xData = store.data.map(
    (p: NetworkTrendPoint) =>
      `${p.dt.split('-').slice(1).join('-')} ${String(p.hour).padStart(2, '0')}:00`,
  )
  const inData = store.data.map((p: NetworkTrendPoint) => p.avg_in)
  const outData = store.data.map((p: NetworkTrendPoint) => p.avg_out)

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['入站带宽', '出站带宽'], textStyle: { color: '#cfe3ff' }, top: 0 },
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
        name: '入站带宽',
        type: 'line',
        smooth: true,
        data: inData,
        lineStyle: { color: '#409eff' },
        areaStyle: { color: 'rgba(64, 158, 255, 0.1)' },
      },
      {
        name: '出站带宽',
        type: 'line',
        smooth: true,
        data: outData,
        lineStyle: { color: '#e6a23c' },
        areaStyle: { color: 'rgba(230, 162, 60, 0.1)' },
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
  <ChartCard title="网络流量趋势" class="chart-module">
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
