import { Router } from 'express'

export default function createDashboardRouter({ pool }: { pool: any }) {
  const router = Router()

  router.get('/summary', async (req, res) => {
    try {
      const [hostRows] = await pool.query(`
        SELECT 
          COUNT(*) as total_hosts,
          SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_hosts,
          SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) as warning_hosts,
          SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline_hosts
        FROM host_detail
      `)

      const [cpuRows] = await pool.query(`
        SELECT AVG(value_num) as avg_cpu_usage
        FROM pref_tsar
        WHERE mod = 'cpu_usage'
        AND dt >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      `)

      const [memRows] = await pool.query(`
        SELECT AVG(value_num) as avg_mem_usage
        FROM pref_tsar
        WHERE mod = 'mem_used'
        AND dt >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      `)

      const [alertRows] = await pool.query(`
        SELECT COUNT(*) as active_alerts
        FROM alert_log
        WHERE is_resolved = FALSE
      `)

      res.json({
        totalHosts: hostRows[0].total_hosts,
        onlineHosts: hostRows[0].online_hosts,
        warningHosts: hostRows[0].warning_hosts,
        offlineHosts: hostRows[0].offline_hosts,
        avgCpuUsage: Math.round((cpuRows[0].avg_cpu_usage || 0) * 100) / 100,
        avgMemUsage: Math.round((memRows[0].avg_mem_usage || 0) * 100) / 100,
        activeAlerts: alertRows[0].active_alerts,
      })
    } catch (error) {
      console.error('Error fetching summary:', error)
      res.status(500).json({ error: 'Failed to fetch summary' })
    }
  })

  router.get('/cpu-trend', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT dt, hour, AVG(value_num) as avg_value, MAX(value_num) as max_value, MIN(value_num) as min_value
        FROM pref_tsar
        WHERE mod = 'cpu_usage'
        AND dt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY dt, hour
        ORDER BY dt, hour
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching cpu trend:', error)
      res.status(500).json({ error: 'Failed to fetch cpu trend' })
    }
  })

  router.get('/memory-trend', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT dt, hour, AVG(value_num) as avg_value
        FROM pref_tsar
        WHERE mod = 'mem_used'
        AND dt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY dt, hour
        ORDER BY dt, hour
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching memory trend:', error)
      res.status(500).json({ error: 'Failed to fetch memory trend' })
    }
  })

  router.get('/disk-trend', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT dt, hour, AVG(value_num) as avg_value
        FROM disk_tsar
        WHERE mod = 'sda_util'
        AND dt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY dt, hour
        ORDER BY dt, hour
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching disk trend:', error)
      res.status(500).json({ error: 'Failed to fetch disk trend' })
    }
  })

  router.get('/network-trend', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT dt, hour, 
          AVG(CASE WHEN mod = 'net_in' THEN value_num END) as avg_in,
          AVG(CASE WHEN mod = 'net_out' THEN value_num END) as avg_out
        FROM pref_tsar
        WHERE mod IN ('net_in', 'net_out')
        AND dt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY dt, hour
        ORDER BY dt, hour
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching network trend:', error)
      res.status(500).json({ error: 'Failed to fetch network trend' })
    }
  })

  router.get('/hosts', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT h.*, 
          (SELECT AVG(value_num) FROM pref_tsar WHERE hostid = h.hostid AND mod = 'cpu_usage' AND dt >= DATE_SUB(NOW(), INTERVAL 1 DAY)) as cpu_usage,
          (SELECT AVG(value_num) FROM pref_tsar WHERE hostid = h.hostid AND mod = 'mem_used' AND dt >= DATE_SUB(NOW(), INTERVAL 1 DAY)) as mem_usage,
          (SELECT COUNT(*) FROM alert_log WHERE hostid = h.hostid AND is_resolved = FALSE) as active_alerts
        FROM host_detail h
        ORDER BY h.status DESC, h.hostid
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching hosts:', error)
      res.status(500).json({ error: 'Failed to fetch hosts' })
    }
  })

  router.get('/host/:hostid', async (req, res) => {
    try {
      const { hostid } = req.params
      const [hostRows] = await pool.query('SELECT * FROM host_detail WHERE hostid = ?', [hostid])
      if (hostRows.length === 0) {
        return res.status(404).json({ error: 'Host not found' })
      }

      const [cpuRows] = await pool.query(`
        SELECT dt, hour, AVG(value_num) as avg_value
        FROM pref_tsar
        WHERE hostid = ? AND mod = 'cpu_usage'
        AND dt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY dt, hour
        ORDER BY dt, hour
      `, [hostid])

      const [memRows] = await pool.query(`
        SELECT dt, hour, AVG(value_num) as avg_value
        FROM pref_tsar
        WHERE hostid = ? AND mod = 'mem_used'
        AND dt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY dt, hour
        ORDER BY dt, hour
      `, [hostid])

      res.json({
        host: hostRows[0],
        cpuTrend: cpuRows,
        memTrend: memRows,
      })
    } catch (error) {
      console.error('Error fetching host detail:', error)
      res.status(500).json({ error: 'Failed to fetch host detail' })
    }
  })

  router.get('/alerts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20
      const [rows] = await pool.query(`
        SELECT a.*, h.hostname, h.idc_name
        FROM alert_log a
        LEFT JOIN host_detail h ON a.hostid = h.hostid
        ORDER BY a.created_at DESC
        LIMIT ?
      `, [limit])
      res.json(rows)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      res.status(500).json({ error: 'Failed to fetch alerts' })
    }
  })

  router.get('/metrics/distribution', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT m.category, COUNT(*) as metric_count
        FROM mod_detail m
        GROUP BY m.category
        ORDER BY metric_count DESC
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching metrics distribution:', error)
      res.status(500).json({ error: 'Failed to fetch metrics distribution' })
    }
  })

  router.get('/idc/status', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          idc_name,
          COUNT(*) as host_count,
          SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_count,
          SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) as warning_count,
          SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline_count
        FROM host_detail
        GROUP BY idc_name
      `)
      res.json(rows)
    } catch (error) {
      console.error('Error fetching idc status:', error)
      res.status(500).json({ error: 'Failed to fetch idc status' })
    }
  })

  return router
}
