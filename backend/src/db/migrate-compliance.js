import pool from './pool.js'
import dotenv from 'dotenv'
dotenv.config()

await pool.query(`
  CREATE TABLE IF NOT EXISTS compliance_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(50) DEFAULT 'other',   -- tax | license | report | renewal | other
    due_date DATE NOT NULL,
    recurrence VARCHAR(20) DEFAULT 'none',   -- none | monthly | quarterly | yearly
    notes TEXT,
    status VARCHAR(20) DEFAULT 'open',       -- open | done
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`)
await pool.query(`CREATE INDEX IF NOT EXISTS idx_compliance_org ON compliance_items(organization_id, due_date)`)

console.log('✅ compliance_items table ready')
await pool.end()
