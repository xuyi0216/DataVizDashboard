import { onBeforeUnmount, ref } from 'vue'

/**
 * 轮询 composable：用于大屏实时刷新数据。
 * 组件卸载时自动停止，避免内存泄漏。
 */
export function usePolling(callback: () => void, interval = 5000) {
  const active = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function start() {
    if (active.value) return
    active.value = true
    callback()
    timer = setInterval(callback, interval)
  }

  function stop() {
    active.value = false
    if (timer) clearInterval(timer)
    timer = null
  }

  onBeforeUnmount(stop)

  return { active, start, stop }
}
