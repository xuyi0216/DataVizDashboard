<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ScreenLayout from '@/layouts/ScreenLayout.vue'
import ScreenBorder from '@/components/ScreenBorder.vue'
import MobileScreenLayout from '@/layouts/MobileScreenLayout.vue'
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

const isMobile = ref(false)

function checkScreen() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
})
</script>

<template>
  <MobileScreenLayout v-if="isMobile" />
  <ScreenLayout v-else>
    <ScreenBorder>
      <div class="dashboard">
        <header class="dashboard__header">
          <h1 class="dashboard__title">数据中心运行监控大屏</h1>
          <span class="dashboard__subtitle">Data Center Monitoring Dashboard</span>
        </header>

        <main class="dashboard__body">
          <section class="dashboard__overview">
            <HostOverviewModule />
          </section>

          <section class="dashboard__row">
            <div class="dashboard__cell dashboard__cell--wide">
              <CpuTrendModule />
            </div>
            <div class="dashboard__cell dashboard__cell--wide">
              <MemoryTrendModule />
            </div>
          </section>

          <section class="dashboard__row">
            <div class="dashboard__cell dashboard__cell--wide">
              <DiskTrendModule />
            </div>
            <div class="dashboard__cell dashboard__cell--wide">
              <NetworkTrendModule />
            </div>
          </section>

          <section class="dashboard__row">
            <div class="dashboard__cell dashboard__cell--main">
              <HostStatusModule />
            </div>
            <div class="dashboard__cell dashboard__cell--side">
              <AlertListModule />
            </div>
            <div class="dashboard__cell dashboard__cell--side">
              <AlertDistributionModule />
            </div>
            <div class="dashboard__cell dashboard__cell--side">
              <MetricDistributionModule />
            </div>
            <div class="dashboard__cell dashboard__cell--side">
              <IdcStatusModule />
            </div>
          </section>
        </main>
      </div>
    </ScreenBorder>
  </ScreenLayout>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  color: #e6f0ff;
  background: #050b1a;
  width: 1920px;
  height: 1080px;
}
.dashboard__header {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.dashboard__title {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(90deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.dashboard__subtitle {
  font-size: 14px;
  color: #8fb6e6;
}
.dashboard__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}
.dashboard__overview {
  flex-shrink: 0;
}
.dashboard__row {
  display: flex;
  gap: 12px;
  flex: 1;
  min-height: 0;
}
.dashboard__cell {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}
.dashboard__cell--wide {
  flex: 1;
}
.dashboard__cell--main {
  flex: 2;
}
.dashboard__cell--side {
  flex: 1;
}
</style>
