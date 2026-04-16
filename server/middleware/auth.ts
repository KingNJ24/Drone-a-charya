import { NextRequest } from 'next/server'
import { Role } from '@prisma/client'
import { ForbiddenError, UnauthorizedError } from '@/server/lib/errors'
import { verifyJwt } from '@/server/lib/jwt'

export function requireAuth(request: NextRequest) {
  const header = request.headers.get('authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    throw new UnauthorizedError('Missing Bearer token')
  }

  return verifyJwt(token)
}

export function requireRole(role: Role | Role[], currentRole: Role) {
  const allowed = Array.isArray(role) ? role : [role]
  if (!allowed.includes(currentRole)) {
    throw new ForbiddenError('You do not have access to this resource')
  }
}
