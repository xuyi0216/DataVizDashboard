import express from 'express'
import cors from 'cors'
import { createPool } from 'mysql2/promise'
import dashboardRouter from './routes/dashboard.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'datacenter_monitor',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

app.use('/api/dashboard', dashboardRouter({ pool }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
