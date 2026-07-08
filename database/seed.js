/**
 * Seed data generator for data center monitoring dashboard.
 * Generates realistic synthetic data based on day3 data structure.
 */

import mysql from 'mysql2/promise'

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datacenter_monitor',
  port: 3306,
}

const HOST_COUNT = 20
const DAYS = 7
const START_DATE = new Date('2026-07-01T00:00:00Z')
const OS_TYPES = ['CentOS 7.9', 'Ubuntu 20.04', 'CentOS 8.0', 'Ubuntu 22.04']

const PREF_METRICS = [
  { mod: 'cpu_idle', category: 'cpu', unit: '%', base: 60, variance: 15 },
  { mod: 'cpu_sys', category: 'cpu', unit: '%', base: 12, variance: 5 },
  { mod: 'cpu_usage', category: 'cpu', unit: '%', base: 40, variance: 20 },
  { mod: 'cpu_user', category: 'cpu', unit: '%', base: 22, variance: 8 },
  { mod: 'cpu_wait', category: 'cpu', unit: '%', base: 30, variance: 10 },
  { mod: 'load1', category: 'cpu', unit: '', base: 5, variance: 3 },
  { mod: 'load5', category: 'cpu', unit: '', base: 12, variance: 4 },
  { mod: 'load15', category: 'cpu', unit: '', base: 14, variance: 3 },
  { mod: 'mem_buff', category: 'memory', unit: 'MB', base: 73069, variance: 10000 },
  { mod: 'mem_cache', category: 'memory', unit: 'MB', base: 63200, variance: 8000 },
  { mod: 'mem_free', category: 'memory', unit: 'MB', base: 91864, variance: 15000 },
  { mod: 'mem_swap', category: 'memory', unit: 'MB', base: 59171, variance: 8000 },
  { mod: 'mem_used', category: 'memory', unit: 'MB', base: 90559, variance: 12000 },
  { mod: 'net_in', category: 'network', unit: 'MB/s', base: 824, variance: 300 },
  { mod: 'net_out', category: 'network', unit: 'MB/s', base: 302, variance: 150 },
  { mod: 'net_pktin', category: 'network', unit: 'pkt/s', base: 79873, variance: 20000 },
  { mod: 'net_pktout', category: 'network', unit: 'pkt/s', base: 74249, variance: 18000 },
  { mod: 'proc_block', category: 'process', unit: '个', base: 156, variance: 50 },
  { mod: 'proc_run', category: 'process', unit: '个', base: 45, variance: 15 },
  { mod: 'proc_total', category: 'process', unit: '个', base: 477, variance: 80 },
]

const DISK_METRICS = [
  { mod: 'sda_write', category: 'disk', unit: 'KB/s', base: 280000, variance: 100000 },
  { mod: 'sdc_avgrq', category: 'disk', unit: '', base: 989, variance: 300 },
  { mod: 'sde_write', category: 'disk', unit: 'KB/s', base: 350000, variance: 120000 },
  { mod: 'sdd_rqm', category: 'disk', unit: '', base: 114, variance: 30 },
  { mod: 'sda_await', category: 'disk', unit: 'ms', base: 15, variance: 8 },
  { mod: 'sdd_write', category: 'disk', unit: 'KB/s', base: 450000, variance: 150000 },
  { mod: 'sda_util', category: 'disk', unit: '%', base: 75, variance: 15 },
  { mod: 'sde_read', category: 'disk', unit: 'KB/s', base: 120000, variance: 40000 },
]

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max))
}

function generateHosts(): { hostid: string; hostname: string; idc_name: string; ip_address: string; os_type: string; cpu_cores: number; memory_total: number; disk_total: number; status: string }[] {
  const hosts = []
  for (let i = 1; i <= HOST_COUNT; i++) {
    const idc = i <= 12 ? 'A机房' : 'B机房'
    hosts.push({
      hostid: `host${String(i).padStart(3, '0')}`,
      hostname: `server-${String(i).padStart(3, '0')}.hismartlab.cn`,
      idc_name: idc,
      ip_address: `192.168.${idc === 'A机房' ? '1' : '2'}.${randInt(1, 254)}`,
      os_type: OS_TYPES[randInt(0, OS_TYPES.length)],
      cpu_cores: randInt(4, 64),
      memory_total: randInt(32000, 256000),
      disk_total: randInt(500, 4000),
      status: Math.random() > 0.05 ? 'online' : (Math.random() > 0.5 ? 'warning' : 'offline'),
    })
  }
  return hosts
}

function generateModDetails(): { mod_name: string; category: string; unit: string; description: string }[] {
  const mods = []
  const descriptions: Record<string, string> = {
    cpu_idle: 'CPU空闲率',
    cpu_sys: '系统态CPU使用率',
    cpu_usage: 'CPU综合使用率',
    cpu_user: '用户态CPU使用率',
    cpu_wait: 'IO等待CPU使用率',
    load1: '1分钟平均负载',
    load5: '5分钟平均负载',
    load15: '15分钟平均负载',
    mem_buff: '缓冲区内存',
    mem_cache: '缓存内存',
    mem_free: '空闲内存',
    mem_swap: '交换区使用',
    mem_used: '已使用内存',
    net_in: '网络入站带宽',
    net_out: '网络出站带宽',
    net_pktin: '每秒入站数据包数',
    net_pktout: '每秒出站数据包数',
    proc_block: '阻塞进程数',
    proc_run: '运行中进程数',
    proc_total: '总进程数',
    sda_write: 'SDA写入速率',
    sdc_avgrq: 'SDC平均请求队列长度',
    sde_write: 'SDE写入速率',
    sdd_rqm: 'SDD请求队列长度',
    sda_await: 'SDA平均等待时间',
    sdd_write: 'SDD写入速率',
    sda_util: 'SDA利用率',
    sde_read: 'SDE读取速率',
  }

  for (const m of [...PREF_METRICS, ...DISK_METRICS]) {
    mods.push({
      mod_name: m.mod,
      category: m.category,
      unit: m.unit,
      description: descriptions[m.mod] || m.mod,
    })
  }
  return mods
}

function generatePrefTsar(hosts: { hostid: string }[]): { ts: number; hostid: string; mod: string; value_num: number }[] {
  const rows = []
  const msPerHour = 3600 * 1000
  const totalHours = DAYS * 24

  for (const host of hosts) {
    for (let h = 0; h < totalHours; h++) {
      const ts = START_DATE.getTime() + h * msPerHour
      const dayFactor = Math.sin((h % 24) / 24 * Math.PI * 2) * 0.3 + 0.7
      const hostFactor = 0.8 + (parseInt(host.hostid.replace('host', '')) % 10) * 0.05

      for (const m of PREF_METRICS) {
        const noise = rand(-m.variance, m.variance)
        const value = Math.max(0, m.base * dayFactor * hostFactor + noise)
        rows.push({
          ts,
          hostid: host.hostid,
          mod: m.mod,
          value_num: Math.round(value * 100) / 100,
        })
      }
    }
  }
  return rows
}

function generateDiskTsar(hosts: { hostid: string }[]): { ts: number; hostid: string; mod: string; value_num: number }[] {
  const rows = []
  const msPer5Min = 5 * 60 * 1000
  const total5MinSlots = DAYS * 24 * 12

  for (const host of hosts) {
    for (let slot = 0; slot < total5MinSlots; slot++) {
      const ts = START_DATE.getTime() + slot * msPer5Min
      const hourOfDay = Math.floor((slot / 12) % 24)
      const dayFactor = Math.sin(hourOfDay / 24 * Math.PI * 2) * 0.3 + 0.7
      const hostFactor = 0.8 + (parseInt(host.hostid.replace('host', '')) % 10) * 0.05

      for (const m of DISK_METRICS) {
        const noise = rand(-m.variance, m.variance)
        const value = Math.max(0, m.base * dayFactor * hostFactor + noise)
        rows.push({
          ts,
          hostid: host.hostid,
          mod: m.mod,
          value_num: Math.round(value * 100) / 100,
        })
      }
    }
  }
  return rows
}

function generateAlerts(hosts: { hostid: string; hostname: string }[]): { hostid: string; alert_type: string; severity: string; message: string; is_resolved: boolean; created_at: Date; resolved_at: Date | null }[] {
  const alerts = []
  const types = ['cpu_high', 'mem_high', 'disk_full', 'net_error', 'service_down']
  const severities = ['info', 'warning', 'critical']
  const messages: Record<string, string> = {
    cpu_high: 'CPU使用率超过90%',
    mem_high: '内存使用率超过85%',
    disk_full: '磁盘使用率超过90%',
    net_error: '网络丢包率异常',
    service_down: '服务进程异常退出',
  }

  for (let i = 0; i < 50; i++) {
    const host = hosts[randInt(0, hosts.length)]
    const type = types[randInt(0, types.length)]
    const severity = severities[randInt(0, severities.length)]
    const ts = new Date(START_DATE.getTime() + randInt(0, DAYS * 24 * 3600 * 1000))

    alerts.push({
      hostid: host.hostid,
      alert_type: type,
      severity,
      message: `[${host.hostname}] ${messages[type]}`,
      is_resolved: Math.random() > 0.3,
      created_at: ts,
      resolved_at: Math.random() > 0.3 ? new Date(ts.getTime() + randInt(60000, 3600000)) : null,
    })
  }
  return alerts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
}

async function main() {
  console.log('Connecting to database...')
  const connection = await mysql.createConnection(DB_CONFIG)

  console.log('Generating seed data...')
  const hosts = generateHosts()
  const modDetails = generateModDetails()
  const prefTsar = generatePrefTsar(hosts)
  const diskTsar = generateDiskTsar(hosts)
  const alerts = generateAlerts(hosts)

  console.log('Clearing existing data...')
  await connection.query('SET FOREIGN_KEY_CHECKS = 0')
  await connection.query('TRUNCATE TABLE alert_log')
  await connection.query('TRUNCATE TABLE disk_tsar')
  await connection.query('TRUNCATE TABLE pref_tsar')
  await connection.query('TRUNCATE TABLE mod_detail')
  await connection.query('TRUNCATE TABLE host_detail')
  await connection.query('SET FOREIGN_KEY_CHECKS = 1')

  console.log('Inserting host_detail...')
  for (const host of hosts) {
    await connection.query(
      'INSERT INTO host_detail (hostid, hostname, idc_name, ip_address, os_type, cpu_cores, memory_total, disk_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [host.hostid, host.hostname, host.idc_name, host.ip_address, host.os_type, host.cpu_cores, host.memory_total, host.disk_total, host.status]
    )
  }

  console.log('Inserting mod_detail...')
  for (const mod of modDetails) {
    await connection.query(
      'INSERT INTO mod_detail (mod_name, category, unit, description) VALUES (?, ?, ?, ?)',
      [mod.mod_name, mod.category, mod.unit, mod.description]
    )
  }

  console.log('Inserting pref_tsar...')
  const prefBatchSize = 5000
  for (let i = 0; i < prefTsar.length; i += prefBatchSize) {
    const batch = prefTsar.slice(i, i + prefBatchSize)
    const values = batch.map(r => `(${r.ts}, '${r.hostid}', '${r.mod}', ${r.value_num})`).join(',')
    await connection.query(`INSERT INTO pref_tsar (ts, hostid, mod, value_num) VALUES ${values}`)
    console.log(`  pref_tsar: ${Math.min(i + prefBatchSize, prefTsar.length)}/${prefTsar.length}`)
  }

  console.log('Inserting disk_tsar...')
  const diskBatchSize = 5000
  for (let i = 0; i < diskTsar.length; i += diskBatchSize) {
    const batch = diskTsar.slice(i, i + diskBatchSize)
    const values = batch.map(r => `(${r.ts}, '${r.hostid}', '${r.mod}', ${r.value_num})`).join(',')
    await connection.query(`INSERT INTO disk_tsar (ts, hostid, mod, value_num) VALUES ${values}`)
    console.log(`  disk_tsar: ${Math.min(i + diskBatchSize, diskTsar.length)}/${diskTsar.length}`)
  }

  console.log('Inserting alert_log...')
  for (const alert of alerts) {
    await connection.query(
      'INSERT INTO alert_log (hostid, alert_type, severity, message, is_resolved, created_at, resolved_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [alert.hostid, alert.alert_type, alert.severity, alert.message, alert.is_resolved, alert.created_at, alert.resolved_at]
    )
  }

  console.log('Verifying data...')
  const [counts] = await connection.query(`
    SELECT 
      (SELECT COUNT(*) FROM host_detail) as hosts,
      (SELECT COUNT(*) FROM mod_detail) as mods,
      (SELECT COUNT(*) FROM pref_tsar) as pref,
      (SELECT COUNT(*) FROM disk_tsar) as disk,
      (SELECT COUNT(*) FROM alert_log) as alerts
  `)

  console.log('Data counts:', counts[0])

  await connection.end()
  console.log('Seed data generation completed!')
}

main().catch(console.error)
