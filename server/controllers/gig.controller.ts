import { NextRequest } from 'next/server'
import { Role } from '@prisma/client'
import { created, ok } from '@/server/lib/api-response'
import { requireAuth, requireRole } from '@/server/middleware/auth'
import { validate } from '@/server/middleware/validate'
import { gigService } from '@/server/services/gig.service'
import { applyGigSchema, createGigSchema } from '@/server/validations/gig.validation'

export const gigController = {
  async create(request: NextRequest) {
    const session = requireAuth(request)
    requireRole(Role.COMPANY, session.role)
    const body = validate(createGigSchema, await request.json())
    return created(await gigService.create(session.userId, body))
  },

  async list() {
    return ok(await gigService.list())
  },

  async apply(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = requireAuth(request)
    validate(applyGigSchema, await request.json().catch(() => ({})))
    const { id } = await params
    return created(await gigService.apply(session.userId, id))
  },
}
