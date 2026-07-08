<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { useDatacenterStore } from '@/stores/datacenter/datacenter.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useDatacenterStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => {
  const data = [
    { name: 'CPU', value: 5 },
    { name: '内存', value: 5 },
    { name: '网络', value: 4 },
    { name: '进程', value: 3 },
    { name: '磁盘', value: 8 },
  ]

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#8fb6e6' },
      splitLine: { lineStyle: { color: 'rgba(64, 158, 255, 0.1)' } },
    },
    yAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: '#8fb6e6' },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#67c23a' },
          ]),
          borderRadius: [0, 4, 4, 0],
        },
      },
    ],
  }
})

useChart(chartEl, option)

const { start } = usePolling(() => store.loadSummary(), 30000)
onMounted(() => {
  store.loadSummary()
  start()
})
</script>

<template>
  <ChartCard title="指标分类统计" class="chart-module">
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
