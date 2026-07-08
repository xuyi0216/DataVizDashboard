<script setup lang="ts">
import { onMounted } from 'vue'
import { useAlertsStore } from '@/stores/datacenter/alerts.store'
import ChartCard from '@/components/ChartCard.vue'
import { usePolling } from '@/composables/usePolling'

const store = useAlertsStore()

const severityClass = (severity: string) => {
  if (severity === 'info') return 'alert-list__severity--info'
  if (severity === 'warning') return 'alert-list__severity--warning'
  return 'alert-list__severity--critical'
}

const severityText = (severity: string) => {
  if (severity === 'info') return '信息'
  if (severity === 'warning') return '警告'
  return '严重'
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const { start } = usePolling(() => store.load(), 30000)
onMounted(() => {
  store.load()
  start()
})
</script>

<template>
  <ChartCard title="实时告警列表" class="alert-list">
    <div class="alert-list__wrapper">
      <div
        v-for="alert in store.data"
        :key="alert.id"
        class="alert-list__item"
        :class="`alert-list__item--${alert.severity}`"
      >
        <span class="alert-list__time">{{ formatTime(alert.created_at) }}</span>
        <span class="alert-list__severity" :class="severityClass(alert.severity)">{{
          severityText(alert.severity)
        }}</span>
        <span class="alert-list__message">{{ alert.message }}</span>
        <span v-if="alert.is_resolved" class="alert-list__resolved">已解决</span>
        <span v-else class="alert-list__unresolved">待处理</span>
      </div>
      <p v-if="store.loading" class="alert-list__hint">加载中...</p>
      <p v-if="!store.loading && store.data.length === 0" class="alert-list__empty">暂无告警</p>
    </div>
  </ChartCard>
</template>

<style scoped>
.alert-list {
  height: 100%;
}
.alert-list__wrapper {
  overflow: auto;
  height: 100%;
  padding: 8px;
}
.alert-list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 4px;
  background: rgba(13, 28, 56, 0.4);
  font-size: 12px;
  color: #cfe3ff;
}
.alert-list__item--info {
  border-left: 3px solid #409eff;
}
.alert-list__item--warning {
  border-left: 3px solid #e6a23c;
}
.alert-list__item--critical {
  border-left: 3px solid #f56c6c;
}
.alert-list__time {
  color: #8fb6e6;
  white-space: nowrap;
}
.alert-list__severity {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
}
.alert-list__severity--info {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
}
.alert-list__severity--warning {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}
.alert-list__severity--critical {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}
.alert-list__message {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.alert-list__resolved {
  color: #67c23a;
  white-space: nowrap;
}
.alert-list__unresolved {
  color: #f56c6c;
  white-space: nowrap;
}
.alert-list__hint {
  color: #8fb6e6;
  text-align: center;
}
.alert-list__empty {
  color: #8fb6e6;
  text-align: center;
}
</style>
