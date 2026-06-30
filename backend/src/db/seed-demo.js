import pool from './pool.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const hash = await bcrypt.hash('demo1234', 10)

await pool.query(`
  INSERT INTO users (email, password_hash, full_name, company, plan, questions_used)
  VALUES ($1, $2, $3, $4, $5, $6)
  ON CONFLICT (email) DO UPDATE
    SET password_hash = EXCLUDED.password_hash,
        plan = EXCLUDED.plan
`, ['demo@yurist.ai', hash, 'Demo User', 'Yurist AI', 'entity', 0])

console.log('✅ Demo account ready')
console.log('   Email:    demo@yurist.ai')
console.log('   Password: demo1234')
console.log('   Plan:     Entity (unlimited)')
await pool.end()
