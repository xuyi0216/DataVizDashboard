<script setup lang="ts">
import { useScreenAdapter } from '@/composables/useScreenAdapter'

const { transformStyle, DESIGN_WIDTH, DESIGN_HEIGHT } = useScreenAdapter()
</script>

<template>
  <div class="screen-layout">
    <div
      class="screen-layout__stage"
      :style="{
        width: DESIGN_WIDTH + 'px',
        height: DESIGN_HEIGHT + 'px',
        transform: transformStyle,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.screen-layout {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #050b1a;
}
.screen-layout__stage {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}
</style>
