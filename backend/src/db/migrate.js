import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool from './pool.js'
import dotenv from 'dotenv'
dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))

const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
await pool.query(sql)
console.log('✅ Database migrated')
await pool.end()
