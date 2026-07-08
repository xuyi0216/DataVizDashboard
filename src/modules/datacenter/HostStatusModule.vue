<script setup lang="ts">
import { onMounted } from 'vue'
import { useHostsStore } from '@/stores/datacenter/hosts.store'
import ChartCard from '@/components/ChartCard.vue'
import { usePolling } from '@/composables/usePolling'

const store = useHostsStore()

const statusClass = (status: string) => {
  if (status === 'online') return 'host-table__status--online'
  if (status === 'warning') return 'host-table__status--warning'
  return 'host-table__status--offline'
}

const statusText = (status: string) => {
  if (status === 'online') return '在线'
  if (status === 'warning') return '告警'
  return '离线'
}

const { start } = usePolling(() => store.load(), 30000)
onMounted(() => {
  store.load()
  start()
})
</script>

<template>
  <ChartCard title="主机状态列表" class="host-table">
    <div class="host-table__wrapper">
      <table class="host-table__table">
        <thead>
          <tr>
            <th>主机ID</th>
            <th>主机名</th>
            <th>机房</th>
            <th>CPU</th>
            <th>内存</th>
            <th>状态</th>
            <th>告警</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="host in store.data" :key="host.hostid">
            <td>{{ host.hostid }}</td>
            <td>{{ host.hostname }}</td>
            <td>{{ host.idc_name }}</td>
            <td>{{ host.cpu_usage?.toFixed(1) ?? '-' }}%</td>
            <td>{{ host.mem_usage?.toFixed(1) ?? '-' }}%</td>
            <td>
              <span :class="['host-table__badge', statusClass(host.status)]">
                {{ statusText(host.status) }}
              </span>
            </td>
            <td>{{ host.active_alerts ?? 0 }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="store.loading" class="host-table__hint">加载中...</p>
    </div>
  </ChartCard>
</template>

<style scoped>
.host-table {
  height: 100%;
}
.host-table__wrapper {
  overflow: auto;
  height: 100%;
}
.host-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #cfe3ff;
}
.host-table__table th {
  background: rgba(64, 158, 255, 0.1);
  padding: 8px;
  text-align: left;
  position: sticky;
  top: 0;
}
.host-table__table td {
  padding: 6px 8px;
  border-bottom: 1px solid rgba(64, 158, 255, 0.1);
}
.host-table__table tr:hover {
  background: rgba(64, 158, 255, 0.05);
}
.host-table__badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}
.host-table__status--online {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}
.host-table__status--warning {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}
.host-table__status--offline {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}
.host-table__hint {
  color: #8fb6e6;
  text-align: center;
}
</style>
