# DroneHub — deploy checklist (you run these; ~15 minutes)

I (the codebase) **cannot** open Vercel/Railway/GitHub in your browser or use your passwords. Follow this list in order.

---

## 0) What you need (only 2 secrets you must create)

| Secret | Where it comes from |
|--------|---------------------|
| **`DATABASE_URL`** | Copy from your **Postgres** provider (Railway / Neon / Supabase / Vercel Postgres). |
| **`JWT_SECRET`** | **You invent it** — any long random string (32+ chars). Save in a password manager. |

No Stripe/OpenAI keys are required for the core app.

---

## 1) Push this repo to GitHub

```bash
cd path/to/Drone-a-charya
git init
git add .
git commit -m "DroneHub ready to deploy"
```

Create a new repo on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 2) Create PostgreSQL (example: Railway)

1. [railway.app](https://railway.app) → **Login** → **New Project** → **Database** → **Add PostgreSQL**.
2. Open the Postgres service → **Variables** or **Connect**.
3. Copy **`DATABASE_URL`** (connection string).

*(Alternative: [neon.tech](https://neon.tech) — create project → copy connection string.)*

---

## 3) Apply migrations to that database (once)

On your PC, set the URL temporarily (PowerShell):

```powershell
$env:DATABASE_URL="postgresql://..."   # paste from Railway/Neon
npx prisma migrate deploy
```

You should see: `Applying migration 20260216120000_init`.

---

## 4) Deploy on Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import** your GitHub repo.
2. **Environment variables** (Production):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | same string as step 2 |
   | `JWT_SECRET` | your long random string |
   | `NODE_ENV` | `production` |

3. **Deploy**. Wait for the build to finish.

4. Open the **`.vercel.app`** URL and test **Sign up** / **Log in**.

---

## 5) Optional: seed demo data

Only if you want sample rows (requires `DATABASE_URL` in env):

```powershell
$env:DATABASE_URL="postgresql://..."
pnpm db:seed
```

---

## Troubleshooting

- **Build fails on Prisma** — Vercel runs `postinstall` → `prisma generate`. Ensure `prisma/schema.prisma` is committed.
- **API 500 on signup** — Check Vercel logs; usually wrong `DATABASE_URL` or DB not reachable (firewall / SSL — add `?sslmode=require` if your provider says so).
- **CORS** — Only if you split frontend/API to different domains; set `CORS_ORIGIN` in Vercel.

---

## Done

Your app URL is on the Vercel dashboard. Database stays on Railway/Neon; app on Vercel talks to it via `DATABASE_URL`.
