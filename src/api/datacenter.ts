import { request } from './request'
import type {
  DashboardSummary,
  CpuTrendPoint,
  MemoryTrendPoint,
  DiskTrendPoint,
  NetworkTrendPoint,
  HostSummary,
  AlertItem,
  MetricDistribution,
  IdcStatus,
  HostDetail,
} from './types'

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>({ url: '/dashboard/summary', method: 'get' })
}

export function fetchCpuTrend(): Promise<CpuTrendPoint[]> {
  return request<CpuTrendPoint[]>({ url: '/dashboard/cpu-trend', method: 'get' })
}

export function fetchMemoryTrend(): Promise<MemoryTrendPoint[]> {
  return request<MemoryTrendPoint[]>({ url: '/dashboard/memory-trend', method: 'get' })
}

export function fetchDiskTrend(): Promise<DiskTrendPoint[]> {
  return request<DiskTrendPoint[]>({ url: '/dashboard/disk-trend', method: 'get' })
}

export function fetchNetworkTrend(): Promise<NetworkTrendPoint[]> {
  return request<NetworkTrendPoint[]>({ url: '/dashboard/network-trend', method: 'get' })
}

export function fetchHosts(): Promise<HostSummary[]> {
  return request<HostSummary[]>({ url: '/dashboard/hosts', method: 'get' })
}

export function fetchHostDetail(hostid: string): Promise<HostDetail> {
  return request<HostDetail>({
    url: `/dashboard/host/${encodeURIComponent(hostid)}`,
    method: 'get',
  })
}

export function fetchAlerts(limit = 20): Promise<AlertItem[]> {
  return request<AlertItem[]>({ url: `/dashboard/alerts?limit=${limit}`, method: 'get' })
}

export function fetchMetricsDistribution(): Promise<MetricDistribution[]> {
  return request<MetricDistribution[]>({ url: '/dashboard/metrics/distribution', method: 'get' })
}

export function fetchIdcStatus(): Promise<IdcStatus[]> {
  return request<IdcStatus[]>({ url: '/dashboard/idc/status', method: 'get' })
}
