<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { useSalesStore } from './sales.store'
import ChartCard from '@/components/ChartCard.vue'
import { useChart } from '@/composables/useChart'
import { usePolling } from '@/composables/usePolling'

const store = useSalesStore()
const chartEl = ref<HTMLElement | null>(null)

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: store.summary?.trend.map((t) => t.date) ?? [],
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: {},
      data: store.summary?.trend.map((t) => t.amount) ?? [],
    },
  ],
}))

useChart(chartEl, option)

const { start } = usePolling(() => store.load(), 10_000)
onMounted(() => start())
</script>

<template>
  <ChartCard title="销售趋势" class="sales-module">
    <div ref="chartEl" class="sales-module__chart" />
    <p v-if="store.loading" class="sales-module__hint">加载中…</p>
  </ChartCard>
</template>

<style scoped>
.sales-module {
  height: 100%;
}
.sales-module__chart {
  width: 100%;
  height: 100%;
}
.sales-module__hint {
  color: #8fb6e6;
  text-align: center;
}
</style>
