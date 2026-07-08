<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import type { DiskTrendPoint } from '@/api/types'
import { useDiskTrendStore } from '@/stores/datacenter/diskTrend.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useDiskTrendStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => {
  const xData = store.data.map(
    (p: DiskTrendPoint) =>
      `${p.dt.split('-').slice(1).join('-')} ${String(p.hour).padStart(2, '0')}:00`,
  )
  const avgData = store.data.map((p: DiskTrendPoint) => p.avg_value)

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
      max: 100,
      axisLabel: { color: '#8fb6e6' },
      splitLine: { lineStyle: { color: 'rgba(64, 158, 255, 0.1)' } },
    },
    series: [
      {
        type: 'bar',
        data: avgData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.2)' },
          ]),
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
  <ChartCard title="磁盘 I/O 利用率" class="chart-module">
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
