import { NextRequest } from 'next/server'
import { created, ok } from '@/server/lib/api-response'
import { requireAuth } from '@/server/middleware/auth'
import { validate } from '@/server/middleware/validate'
import { requestService } from '@/server/services/request.service'
import {
  createRequestSchema,
  updateRequestSchema,
} from '@/server/validations/request.validation'

export const requestController = {
  async create(request: NextRequest) {
    const session = requireAuth(request)
    const body = validate(createRequestSchema, await request.json())
    return created(await requestService.create(session.userId, body))
  },

  async list(request: NextRequest) {
    const session = requireAuth(request)
    return ok(await requestService.list(session.userId))
  },

  async update(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = requireAuth(request)
    const { id } = await params
    const body = validate(updateRequestSchema, await request.json())
    return ok(await requestService.update(id, session.userId, body.status))
  },
}
