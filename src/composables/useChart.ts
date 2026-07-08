import {
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

/**
 * ECharts 封装 composable：自动初始化、随容器/数据变化 resize、组件卸载时销毁。
 */
export function useChart(elRef: Ref<HTMLElement | null>, option: MaybeRefOrGetter<EChartsOption>) {
  const chart = shallowRef<echarts.ECharts | null>(null)
  const resize = () => chart.value?.resize()

  onMounted(() => {
    if (!elRef.value) return
    chart.value = echarts.init(elRef.value)
    chart.value.setOption(toValue(option))
    window.addEventListener('resize', resize)
  })

  watch(
    () => toValue(option),
    (opt) => chart.value?.setOption(opt),
    { deep: true },
  )

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    chart.value?.dispose()
    chart.value = null
  })

  return { chart, resize }
}
