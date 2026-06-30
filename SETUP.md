# LexCIS — Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Anthropic API key (get from console.anthropic.com)

## Step 1 — Install dependencies

```bash
cd "D:\claude code\lexcis\backend"
npm install

cd "D:\claude code\lexcis\frontend"
npm install
```

## Step 2 — Configure environment

```bash
cd "D:\claude code\lexcis\backend"
copy .env.example .env
```

Edit `.env`:
```
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/lexcis
JWT_SECRET=any_long_random_string_here
ANTHROPIC_API_KEY=sk-ant-...
```

## Step 3 — Create database

In PostgreSQL (pgAdmin or psql):
```sql
CREATE DATABASE lexcis;
```

## Step 4 — Run migrations + seed

```bash
cd "D:\claude code\lexcis\backend"
npm run db:migrate
npm run db:seed
```

## Step 5 — Start the servers

Terminal 1 (backend):
```bash
cd "D:\claude code\lexcis\backend"
npm run dev
```

Terminal 2 (frontend):
```bash
cd "D:\claude code\lexcis\frontend"
npm run dev
```

Open: http://localhost:5173

## What you have

- Landing page at /
- Register / Login at /register and /login
- Dashboard at /app
- Legal Q&A chat at /app/chat (streaming, with law citations)
- Contract analyzer at /app/contracts (upload PDF or paste)
- Document drafting at /app/documents (6 document types)

## Jurisdictions supported
- Uzbekistan (UZ) — 10 seeded law articles, expand via db/seed.js
- Kazakhstan (KZ)
- Azerbaijan (AZ)

## Expanding the law database
Add more articles to `backend/src/db/seed.js` and re-run `npm run db:seed`.
Source: https://lex.uz (Uzbekistan official law portal)
