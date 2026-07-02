import pool from '../db/pool.js'

// Save a generated output to the shared org workspace. Best-effort — never blocks the main response.
export async function saveWorkspaceItem(orgId, userId, kind, title, data) {
  if (!orgId) return null
  try {
    const { rows } = await pool.query(
      'INSERT INTO workspace_items (organization_id, user_id, kind, title, data) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [orgId, userId, kind, (title || 'Untitled').slice(0, 300), JSON.stringify(data)]
    )
    return rows[0].id
  } catch (e) {
    console.error('saveWorkspaceItem failed:', e.message)
    return null
  }
}
