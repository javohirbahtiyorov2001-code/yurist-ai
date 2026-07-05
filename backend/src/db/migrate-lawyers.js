import pool from './pool.js'
import dotenv from 'dotenv'
dotenv.config()

// Client vs lawyer accounts
await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type VARCHAR(20) DEFAULT 'client'`)

// Lawyer profiles (user_id nullable so we can seed a demo directory before real sign-ups)
await pool.query(`
  CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    region VARCHAR(120),
    bio TEXT,
    consult_fee VARCHAR(120),
    contact VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC(2,1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT NOW()
  )`)

// Referral requests carrying an auto-built case package
await pool.query(`
  CREATE TABLE IF NOT EXISTS lawyer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    client_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    lawyer_id UUID REFERENCES lawyer_profiles(id) ON DELETE SET NULL,
    specialty VARCHAR(60),
    case_package JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',   -- pending | viewed | accepted | closed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`)
await pool.query(`CREATE INDEX IF NOT EXISTS idx_lreq_lawyer ON lawyer_requests(lawyer_id)`)
await pool.query(`CREATE INDEX IF NOT EXISTS idx_lreq_client ON lawyer_requests(client_user_id)`)

// Seed a small demo directory (display-only, no accounts) so the marketplace isn't empty
const demo = [
  { name: 'Dilnoza Karimova', specialties: ['labor', 'consumer'], region: 'Toshkent', bio: "Mehnat va iste'molchi huquqlari bo'yicha 8 yillik tajriba.", fee: '300 000 so\'m / konsultatsiya', contact: '+998 90 000 00 01', verified: true, rating: 4.9 },
  { name: 'Sardor Rakhimov', specialties: ['corporate', 'contract', 'tax'], region: 'Toshkent', bio: 'Korporativ huquq, shartnomalar va soliq masalalari.', fee: '500 000 so\'m / konsultatsiya', contact: '+998 90 000 00 02', verified: true, rating: 4.8 },
  { name: 'Gulnora Yusupova', specialties: ['family', 'realestate'], region: 'Samarqand', bio: "Oila va ko'chmas mulk nizolari bo'yicha advokat.", fee: '250 000 so\'m / konsultatsiya', contact: '+998 90 000 00 03', verified: false, rating: 4.7 },
  { name: 'Jasur Toshmatov', specialties: ['litigation', 'contract'], region: 'Toshkent', bio: 'Sud jarayonlari va shartnoma nizolari bo\'yicha vakillik.', fee: '600 000 so\'m / konsultatsiya', contact: '+998 90 000 00 04', verified: true, rating: 5.0 },
]
const { rows: existing } = await pool.query('SELECT COUNT(*)::int AS n FROM lawyer_profiles')
if (existing[0].n === 0) {
  for (const d of demo) {
    await pool.query(
      'INSERT INTO lawyer_profiles (full_name, specialties, region, bio, consult_fee, contact, verified, rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [d.name, d.specialties, d.region, d.bio, d.fee, d.contact, d.verified, d.rating]
    )
  }
  console.log(`✅ Seeded ${demo.length} demo lawyers`)
}

console.log('✅ lawyer tables ready')
await pool.end()
