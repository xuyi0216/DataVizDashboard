import { onBeforeUnmount, onMounted, ref } from 'vue'

export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1080

/**
 * 大屏自适应：以 1920x1080 为设计稿，整体等比缩放并居中。
 * 返回可直接绑定到舞台容器的 transform 样式。
 */
export function useScreenAdapter() {
  const transformStyle = ref('')

  function calculate() {
    const scale = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT)
    const x = (window.innerWidth - DESIGN_WIDTH * scale) / 2
    const y = (window.innerHeight - DESIGN_HEIGHT * scale) / 2
    transformStyle.value = `translate(${x}px, ${y}px) scale(${scale})`
  }

  onMounted(() => {
    calculate()
    window.addEventListener('resize', calculate)
  })

  onBeforeUnmount(() => window.removeEventListener('resize', calculate))

  return { transformStyle, DESIGN_WIDTH, DESIGN_HEIGHT }
}
