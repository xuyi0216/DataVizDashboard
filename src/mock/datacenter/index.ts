import MockAdapter from 'axios-mock-adapter'
import type {
  DashboardSummary,
  CpuTrendPoint,
  HostSummary,
  AlertItem,
  MetricDistribution,
  IdcStatus,
} from '@/api/types'

function generateTrend(hours = 168, base = 50, variance = 20): CpuTrendPoint[] {
  const points: CpuTrendPoint[] = []
  const now = new Date()
  const start = new Date(now.getTime() - hours * 3600 * 1000)

  for (let i = 0; i < hours; i++) {
    const dt = new Date(start.getTime() + i * 3600 * 1000)
    const hour = dt.getHours()
    const dayFactor = Math.sin((hour / 24) * Math.PI * 2) * 0.3 + 0.7
    const noise = (Math.random() - 0.5) * variance
    const value = Math.max(0, Math.min(100, base * dayFactor + noise))

    points.push({
      dt: dt.toISOString().split('T')[0],
      hour,
      avg_value: Math.round(value * 100) / 100,
      max_value: Math.round((value + variance * 0.5) * 100) / 100,
      min_value: Math.round((value - variance * 0.5) * 100) / 100,
    })
  }
  return points
}

export function mockDatacenter(mock: MockAdapter): void {
  const cpuTrend = generateTrend(168, 45, 15)
  const memTrend = generateTrend(168, 60, 10)
  const diskTrend = generateTrend(168, 55, 10)
  const networkTrend = cpuTrend.map((p) => ({
    ...p,
    avg_in: Math.round((800 + Math.random() * 400) * 100) / 100,
    avg_out: Math.round((300 + Math.random() * 200) * 100) / 100,
  }))

  const hosts: HostSummary[] = Array.from({ length: 20 }, (_, i) => {
    const hostid = `host${String(i + 1).padStart(3, '0')}`
    const idc = i < 12 ? 'A机房' : 'B机房'
    return {
      id: i + 1,
      hostid,
      hostname: `server-${String(i + 1).padStart(3, '0')}.hismartlab.cn`,
      idc_name: idc,
      ip_address: `192.168.${idc === 'A机房' ? '1' : '2'}.${Math.floor(Math.random() * 254) + 1}`,
      os_type: ['CentOS 7.9', 'Ubuntu 20.04', 'CentOS 8.0', 'Ubuntu 22.04'][i % 4],
      cpu_cores: [8, 16, 32, 64][i % 4],
      memory_total: [32000, 64000, 128000, 256000][i % 4],
      disk_total: [500, 1000, 2000, 4000][i % 4],
      status: i === 3 ? 'warning' : i === 7 ? 'offline' : 'online',
      cpu_usage: Math.round((30 + Math.random() * 40) * 100) / 100,
      mem_usage: Math.round((50 + Math.random() * 30) * 100) / 100,
      active_alerts: i === 3 ? 2 : i === 7 ? 1 : 0,
    }
  })

  const alertTypes = ['cpu_high', 'mem_high', 'disk_full', 'net_error', 'service_down'] as const
  const severities = ['info', 'warning', 'critical'] as const
  const alertMessages: Record<string, string> = {
    cpu_high: 'CPU使用率超过90%',
    mem_high: '内存使用率超过85%',
    disk_full: '磁盘使用率超过90%',
    net_error: '网络丢包率异常',
    service_down: '服务进程异常退出',
  }
  const alerts: AlertItem[] = Array.from({ length: 20 }, (_, i) => {
    const host = hosts[i % hosts.length]
    const type = alertTypes[i % alertTypes.length]
    const severity = severities[i % severities.length]
    const ts = new Date(Date.now() - i * 3600000)
    return {
      id: i + 1,
      hostid: host.hostid,
      alert_type: type,
      severity,
      message: `[${host.hostname}] ${alertMessages[type]}`,
      is_resolved: i > 5,
      created_at: ts.toISOString(),
      resolved_at: i > 5 ? new Date(ts.getTime() + 600000).toISOString() : null,
      hostname: host.hostname,
      idc_name: host.idc_name,
    }
  })

  const summary: DashboardSummary = {
    totalHosts: 20,
    onlineHosts: 18,
    warningHosts: 1,
    offlineHosts: 1,
    avgCpuUsage: Math.round(45 * 100) / 100,
    avgMemUsage: Math.round(62 * 100) / 100,
    activeAlerts: 3,
  }

  const metricsDistribution: MetricDistribution[] = [
    { category: 'cpu', metric_count: 5 },
    { category: 'memory', metric_count: 5 },
    { category: 'network', metric_count: 4 },
    { category: 'process', metric_count: 3 },
    { category: 'disk', metric_count: 8 },
  ]

  const idcStatus: IdcStatus[] = [
    { idc_name: 'A机房', host_count: 12, online_count: 11, warning_count: 1, offline_count: 0 },
    { idc_name: 'B机房', host_count: 8, online_count: 7, warning_count: 0, offline_count: 1 },
  ]

  mock.onGet('/dashboard/summary').reply(() => [200, summary])
  mock.onGet('/dashboard/cpu-trend').reply(() => [200, cpuTrend])
  mock.onGet('/dashboard/memory-trend').reply(() => [200, memTrend])
  mock.onGet('/dashboard/disk-trend').reply(() => [200, diskTrend])
  mock.onGet('/dashboard/network-trend').reply(() => [200, networkTrend])
  mock.onGet('/dashboard/hosts').reply(() => [200, hosts])
  mock.onGet(/\/dashboard\/host\/.+/).reply((config) => {
    const hostid = config.url?.split('/').pop()
    const host = hosts.find((h) => h.hostid === hostid) || hosts[0]
    return [
      200,
      {
        host,
        cpuTrend: cpuTrend.slice(0, 24),
        memTrend: memTrend.slice(0, 24),
      },
    ]
  })
  mock.onGet('/dashboard/alerts').reply(() => [200, alerts])
  mock.onGet('/dashboard/metrics/distribution').reply(() => [200, metricsDistribution])
  mock.onGet('/dashboard/idc/status').reply(() => [200, idcStatus])
}
