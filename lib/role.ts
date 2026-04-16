import type { Role } from '@/lib/mock/dashboard-data'

/** Normalized role for UI (also maps Prisma enums STUDENT / TEACHER / COMPANY) */
export type AppRole = Role

export function normalizeAppRole(input: string | undefined | null): AppRole {
  if (!input) return 'student'
  const upper = input.toString().trim().toUpperCase()
  if (upper === 'STUDENT') return 'student'
  if (upper === 'TEACHER') return 'teacher'
  if (upper === 'COMPANY') return 'company'
  const lower = input.toString().trim().toLowerCase()
  if (lower === 'student' || lower === 'teacher' || lower === 'company') {
    return lower as AppRole
  }
  return 'student'
}
