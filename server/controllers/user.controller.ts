import { NextRequest } from 'next/server'
import { ok } from '@/server/lib/api-response'
import { requireAuth } from '@/server/middleware/auth'
import { validate } from '@/server/middleware/validate'
import { userService } from '@/server/services/user.service'
import { updateUserSchema } from '@/server/validations/user.validation'

export const userController = {
  async getById(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return ok(await userService.getById(id))
  },

  async list(request: NextRequest) {
    const role = request.nextUrl.searchParams.get('role') as any
    if (role) {
      return ok(await userService.listByRole(role))
    }
    return ok([])
  },

  async update(request: NextRequest) {
    const session = requireAuth(request)
    const body = validate(updateUserSchema, await request.json())
    return ok(await userService.update(session.userId, body))
  },
}
