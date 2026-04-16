import { NextRequest } from 'next/server'
import { ok, created } from '@/server/lib/api-response'
import { requireAuth } from '@/server/middleware/auth'
import { validate } from '@/server/middleware/validate'
import { messageService } from '@/server/services/message.service'
import { sendMessageSchema } from '@/server/validations/message.validation'

export const messageController = {
  async getConversations(request: NextRequest) {
    const session = requireAuth(request)
    return ok(await messageService.getConversations(session.userId))
  },

  async getMessages(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = requireAuth(request)
    const { id } = await params
    return ok(await messageService.getMessages(id, session.userId))
  },

  async sendMessage(request: NextRequest) {
    const session = requireAuth(request)
    const body = validate(sendMessageSchema, await request.json())
    return created(await messageService.sendMessage(session.userId, body))
  },
}
