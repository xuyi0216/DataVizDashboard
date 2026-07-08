<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <section class="chart-card">
    <header v-if="title" class="chart-card__header">
      {{ title }}
    </header>
    <div class="chart-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.chart-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(13, 28, 56, 0.6);
  border: 1px solid rgba(64, 158, 255, 0.35);
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
}
.chart-card__header {
  padding: 10px 14px;
  font-size: 16px;
  color: #cfe3ff;
  border-bottom: 1px solid rgba(64, 158, 255, 0.2);
}
.chart-card__body {
  flex: 1;
  min-height: 0;
  padding: 8px;
}
</style>
