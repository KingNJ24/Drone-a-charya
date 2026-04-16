import { NextRequest } from 'next/server'
import { created, ok } from '@/server/lib/api-response'
import { AppError } from '@/server/lib/errors'
import { requireAuth } from '@/server/middleware/auth'
import { validate } from '@/server/middleware/validate'
import { connectionService } from '@/server/services/connection.service'
import {
  createConnectionSchema,
  updateConnectionSchema,
} from '@/server/validations/connection.validation'

export const connectionController = {
  async list(request: NextRequest) {
    const session = requireAuth(request)
    const connections = await connectionService.listForUser(session.userId)
    return ok({ connections })
  },

  async create(request: NextRequest) {
    const session = requireAuth(request)
    const raw = (await request.json()) as Record<string, unknown>
    const receiverId =
      typeof raw.receiverId === 'string'
        ? raw.receiverId
        : typeof raw.connected_user_id === 'string'
          ? raw.connected_user_id
          : ''
    const body = validate(createConnectionSchema, { receiverId })
    return created(await connectionService.create(session.userId, body.receiverId))
  },

  async remove(request: NextRequest) {
    const session = requireAuth(request)
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      throw new AppError('Connection id required', 400, 'BAD_REQUEST')
    }
    await connectionService.remove(id, session.userId)
    return ok({ success: true })
  },

  async update(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = requireAuth(request)
    const { id } = await params
    const body = validate(updateConnectionSchema, await request.json())
    return ok(await connectionService.update(id, session.userId, body.status))
  },
}
