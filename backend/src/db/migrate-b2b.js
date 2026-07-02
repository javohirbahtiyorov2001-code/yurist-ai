import pool from './pool.js'
import dotenv from 'dotenv'
dotenv.config()

// ── B2B schema: organizations, workspace, templates ──
await pool.query(`
  CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW()
  )`)

await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL`)
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'owner'`)

await pool.query(`
  CREATE TABLE IF NOT EXISTS workspace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    kind VARCHAR(40) NOT NULL,           -- draft | review | workflow
    title VARCHAR(300) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`)

await pool.query(`
  CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    doc_type VARCHAR(100),
    content TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`)

await pool.query(`CREATE INDEX IF NOT EXISTS idx_workspace_org ON workspace_items(organization_id)`)
await pool.query(`CREATE INDEX IF NOT EXISTS idx_templates_org ON templates(organization_id)`)
await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id)`)

const code = () => Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

// ── Backfill: give every existing user their own organization ──
const { rows: orphans } = await pool.query(`SELECT id, full_name, company, plan FROM users WHERE organization_id IS NULL`)
for (const u of orphans) {
  const orgName = u.company || (u.full_name ? `${u.full_name}'s workspace` : 'My workspace')
  const { rows } = await pool.query(
    `INSERT INTO organizations (name, invite_code, plan) VALUES ($1, $2, $3) RETURNING id`,
    [orgName, code(), u.plan || 'free']
  )
  await pool.query(`UPDATE users SET organization_id = $1, role = 'owner' WHERE id = $2`, [rows[0].id, u.id])
}

console.log(`✅ B2B schema ready. Backfilled ${orphans.length} organizations.`)
await pool.end()
