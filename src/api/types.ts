export interface HostSummary {
  id: number
  hostid: string
  hostname: string
  idc_name: string
  ip_address: string
  os_type: string
  cpu_cores: number
  memory_total: number
  disk_total: number
  status: string
  cpu_usage?: number
  mem_usage?: number
  active_alerts?: number
}

export interface CpuTrendPoint {
  dt: string
  hour: number
  avg_value: number
  max_value: number
  min_value: number
}

export interface MemoryTrendPoint {
  dt: string
  hour: number
  avg_value: number
}

export interface DiskTrendPoint {
  dt: string
  hour: number
  avg_value: number
}

export interface NetworkTrendPoint {
  dt: string
  hour: number
  avg_in: number
  avg_out: number
}

export interface AlertItem {
  id: number
  hostid: string
  alert_type: string
  severity: string
  message: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
  hostname: string
  idc_name: string
}

export interface MetricDistribution {
  category: string
  metric_count: number
}

export interface IdcStatus {
  idc_name: string
  host_count: number
  online_count: number
  warning_count: number
  offline_count: number
}

export interface DashboardSummary {
  totalHosts: number
  onlineHosts: number
  warningHosts: number
  offlineHosts: number
  avgCpuUsage: number
  avgMemUsage: number
  activeAlerts: number
}

export interface HostDetail {
  host: HostSummary
  cpuTrend: CpuTrendPoint[]
  memTrend: MemoryTrendPoint[]
}
