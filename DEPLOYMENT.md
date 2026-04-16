# DroneHub — production deployment

This app is a **Next.js (App Router) monolith**: UI and REST API live in the same repo (`app/api/*`). **Prisma** talks to **PostgreSQL**.

---

## Architecture choices

| Approach | Vercel | Railway | Notes |
|----------|--------|---------|--------|
| **A — Recommended** | Deploy **full Next.js** (UI + API) | Add **PostgreSQL** only; paste `DATABASE_URL` into Vercel | Single deployment, no CORS issues, `NEXT_PUBLIC_API_URL` **unset** |
| **B** | Static/edge frontend only | Deploy **full Next.js** on Railway (`next start`) | Set `NEXT_PUBLIC_API_URL` to your Railway public URL; set `CORS_ORIGIN` to your Vercel domain |
| **C** | Full Next on Vercel | Full Next on Railway too | Redundant — pick one host for the app |

There is **no separate Express `server.js`** in this repo: the “backend” **is** Next.js Route Handlers under `app/api/`.

---

## Environment variables

### Required (any environment with Prisma + JWT auth)

| Variable | Example | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Prisma / PostgreSQL |
| `JWT_SECRET` | 32+ random characters | Signs access tokens |
| `NODE_ENV` | `production` | Node/Next behavior |

### Optional

| Variable | Purpose |
|----------|---------|
| `JWT_EXPIRES_IN` | Token TTL (default `7d` in code) |
| `REDIS_URL` | Feed cache / future queues (see `server/lib/redis.ts`) |
| `NEXT_PUBLIC_API_URL` | Only if the browser calls a **different** host for `/api` (see `lib/api-base.ts`) |
| `CORS_ORIGIN` | Comma-separated allowed origins for `/api/*` (e.g. your Vercel URL) |
| AWS vars | S3 uploads (`server/services/upload.service.ts`) |

### Scripts (`package.json`)

- `dev` — `next dev`
- `build` — `next build`
- `start` — `next start` (respects `PORT` automatically in production)
- `postinstall` — `prisma generate` (runs on Vercel/Railway install)

---

## Prisma (production)

```bash
npx prisma generate
npx prisma migrate deploy
```

- Use **`migrate deploy`** in CI/production (never `migrate dev` on prod).
- First-time: create migrations locally with `pnpm db:migrate` (or `prisma migrate dev`), commit `prisma/migrations`, then deploy.

Seed (optional):

```bash
pnpm db:seed
```

---

## Option A — Vercel (app) + Railway (PostgreSQL only)

### 1. Railway — PostgreSQL

1. [railway.app](https://railway.app) → **New Project** → **Database** → **PostgreSQL**.
2. Copy the **connection string** (`DATABASE_URL`).

### 2. GitHub

Push this repo to GitHub.

### 3. Vercel

1. **Import** the GitHub repo.
2. **Environment variables**:
   - `DATABASE_URL` = Railway Postgres URL  
   - `JWT_SECRET` = strong secret  
   - `NODE_ENV` = `production`  
3. **Build**: default `pnpm install` / `npm install` runs `postinstall` → `prisma generate`.  
4. **Build Command**: `prisma migrate deploy && next build` (set in Vercel project settings **or** add a `vercel-build` script — see below).
5. Deploy.

**Important:** Run migrations on production DB once:

- **Vercel** → add a one-off command in CI, or run locally pointing at prod DB:

  ```bash
  DATABASE_URL="postgresql://...prod..." npx prisma migrate deploy
  ```

### 4. After deploy

- Open `https://<your-project>.vercel.app`
- Test: signup/login → feed → project create (JWT + Prisma)

`NEXT_PUBLIC_API_URL` should be **empty** so the client uses relative `/api/...` on the same domain.

---

## Option B — Full stack on Railway

1. New **empty** project → **Deploy from GitHub** (this repo).
2. Add **PostgreSQL** plugin; Railway injects `DATABASE_URL`.
3. Set `JWT_SECRET`, `NODE_ENV=production`.
4. **Start command** (Railway “Custom Start Command”), e.g.:

   ```bash
   npx prisma migrate deploy && npx next start -H 0.0.0.0 -p ${PORT:-3000}
   ```

5. Railway sets `PORT` automatically; Next.js reads it.

If a **separate** Vercel frontend will call this API:

- Vercel env: `NEXT_PUBLIC_API_URL=https://<your-service>.up.railway.app`
- Railway env: `CORS_ORIGIN=https://<your-app>.vercel.app`

---

## CORS

`middleware.ts` adds CORS headers for `/api/*`. Set `CORS_ORIGIN` when the browser origin differs from the API host.

---

## File uploads

Prefer **S3** or **Cloudinary** via env vars already stubbed in `server/config/env.ts`. Avoid relying on local disk in serverless (Vercel).

---

## Final verification checklist

- [ ] `pnpm build` succeeds locally with production-like env  
- [ ] `npx prisma migrate deploy` against production DB  
- [ ] Signup `POST /api/auth/signup` → user in DB  
- [ ] Login `POST /api/auth/login` → JWT  
- [ ] `GET /api/projects?limit=10` (feed) returns data  
- [ ] `POST /api/projects` with `Authorization: Bearer <jwt>` creates project  
- [ ] `GET /api/connections` with JWT lists connections  
- [ ] Gigs / requests routes as needed for your flows  

---

## Troubleshooting

- **Prisma on Vercel**: ensure `postinstall` runs (`prisma generate`) and migrations run before or during deploy.  
- **Connection refused to DB**: allow Railway/Neon IP if using restricted networks; SSL query params on `DATABASE_URL` if required.  
- **401 on API**: client must send `Authorization: Bearer <token>` from login response.
