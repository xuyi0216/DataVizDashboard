<script setup lang="ts">
import HostOverviewModule from '@/modules/datacenter/HostOverviewModule.vue'
import CpuTrendModule from '@/modules/datacenter/CpuTrendModule.vue'
import MemoryTrendModule from '@/modules/datacenter/MemoryTrendModule.vue'
import DiskTrendModule from '@/modules/datacenter/DiskTrendModule.vue'
import NetworkTrendModule from '@/modules/datacenter/NetworkTrendModule.vue'
import HostStatusModule from '@/modules/datacenter/HostStatusModule.vue'
import AlertListModule from '@/modules/datacenter/AlertListModule.vue'
import AlertDistributionModule from '@/modules/datacenter/AlertDistributionModule.vue'
import MetricDistributionModule from '@/modules/datacenter/MetricDistributionModule.vue'
import IdcStatusModule from '@/modules/datacenter/IdcStatusModule.vue'
</script>

<template>
  <div class="mobile-dashboard">
    <header class="mobile-dashboard__header">
      <h1 class="mobile-dashboard__title">数据中心运行监控</h1>
    </header>
    <main class="mobile-dashboard__body">
      <HostOverviewModule />
      <CpuTrendModule />
      <MemoryTrendModule />
      <DiskTrendModule />
      <NetworkTrendModule />
      <HostStatusModule />
      <AlertListModule />
      <AlertDistributionModule />
      <MetricDistributionModule />
      <IdcStatusModule />
    </main>
  </div>
</template>

<style scoped>
.mobile-dashboard {
  min-height: 100vh;
  background: #050b1a;
  color: #e6f0ff;
  padding: 12px;
  box-sizing: border-box;
}
.mobile-dashboard__header {
  text-align: center;
  padding: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(64, 158, 255, 0.2);
}
.mobile-dashboard__title {
  font-size: 20px;
  margin: 0;
  background: linear-gradient(90deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.mobile-dashboard__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
