<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDatacenterStore } from '@/stores/datacenter/datacenter.store'
import ChartCard from '@/components/ChartCard.vue'
import { usePolling } from '@/composables/usePolling'

const store = useDatacenterStore()

const metrics = computed(() => {
  if (!store.summary) return []
  return [
    { label: '总主机数', value: store.summary.totalHosts, unit: '台', status: 'stable' as const },
    { label: '在线主机', value: store.summary.onlineHosts, unit: '台', status: 'good' as const },
    {
      label: '告警主机',
      value: store.summary.warningHosts,
      unit: '台',
      status: 'warning' as const,
    },
    { label: '离线主机', value: store.summary.offlineHosts, unit: '台', status: 'down' as const },
    { label: '平均CPU', value: store.summary.avgCpuUsage, unit: '%', status: 'stable' as const },
    { label: '平均内存', value: store.summary.avgMemUsage, unit: '%', status: 'stable' as const },
    {
      label: '活跃告警',
      value: store.summary.activeAlerts,
      unit: '个',
      status: 'warning' as const,
    },
  ]
})

const { start } = usePolling(() => store.loadSummary(), 30000)
onMounted(() => {
  store.loadSummary()
  start()
})
</script>

<template>
  <div class="host-overview">
    <ChartCard v-for="m in metrics" :key="m.label" class="host-overview__card">
      <div class="host-overview__content">
        <span class="host-overview__label">{{ m.label }}</span>
        <span class="host-overview__value"
          >{{ m.value }}<small class="host-overview__unit">{{ m.unit }}</small></span
        >
        <span :class="['host-overview__status', `host-overview__status--${m.status}`]">
          {{
            m.status === 'good'
              ? '正常'
              : m.status === 'warning'
                ? '告警'
                : m.status === 'down'
                  ? '离线'
                  : '稳定'
          }}
        </span>
      </div>
    </ChartCard>
  </div>
</template>

<style scoped>
.host-overview {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.host-overview__card {
  height: auto;
  min-height: 80px;
}
.host-overview__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  gap: 4px;
}
.host-overview__label {
  font-size: 12px;
  color: #8fb6e6;
}
.host-overview__value {
  font-size: 20px;
  font-weight: bold;
  color: #e6f0ff;
}
.host-overview__unit {
  font-size: 12px;
  color: #8fb6e6;
  margin-left: 2px;
}
.host-overview__status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}
.host-overview__status--good {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}
.host-overview__status--warning {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}
.host-overview__status--down {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}
.host-overview__status--stable {
  background: rgba(64, 158, 255, 0.2);
  color: #409eff;
}
</style>
