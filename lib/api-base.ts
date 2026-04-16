/**
 * Base URL for the DroneHub API.
 * - Leave empty for same-origin (recommended: deploy Next.js on Vercel with API routes on the same domain).
 * - Set to your Railway (or other) URL if the browser calls a separate API host, e.g. `https://api-dronehub.up.railway.app`
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  return raw ? raw.replace(/\/$/, '') : ''
}

/** Build an absolute API path for client-side fetch */
export function apiUrl(path: string): string {
  const base = getApiBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  if (!base) return p
  return `${base}${p}`
}
