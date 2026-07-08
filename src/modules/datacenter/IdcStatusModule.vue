<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { useDatacenterStore } from '@/stores/datacenter/datacenter.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useDatacenterStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => {
  const data = [
    { name: 'A机房', value: 12, online: 11, warning: 1, offline: 0 },
    { name: 'B机房', value: 8, online: 7, warning: 0, offline: 1 },
  ]

  const tooltip = {
    trigger: 'item' as const,
    formatter: (params: { dataIndex: number; name?: string }) => {
      const d = data[params.dataIndex]
      return `${params.name}<br/>总数: ${d.value}<br/>在线: ${d.online}<br/>告警: ${d.warning}<br/>离线: ${d.offline}`
    },
  }

  return {
    tooltip,
    legend: { data: ['在线', '告警', '离线'], textStyle: { color: '#cfe3ff' }, top: 0 },
    series: [
      {
        name: '在线',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.online),
        itemStyle: { color: '#67c23a' },
      },
      {
        name: '告警',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.warning),
        itemStyle: { color: '#e6a23c' },
      },
      {
        name: '离线',
        type: 'bar',
        stack: 'total',
        data: data.map((d) => d.offline),
        itemStyle: { color: '#f56c6c' },
      },
    ],
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: { color: '#8fb6e6' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#8fb6e6' },
      splitLine: { lineStyle: { color: 'rgba(64, 158, 255, 0.1)' } },
    },
  } as unknown as EChartsOption
})

useChart(chartEl, option)

const { start } = usePolling(() => store.loadSummary(), 30000)
onMounted(() => {
  store.loadSummary()
  start()
})
</script>

<template>
  <ChartCard title="机房状态分布" class="chart-module">
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
