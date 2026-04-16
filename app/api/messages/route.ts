import { messageController } from '@/server/controllers/message.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const POST = withErrorHandler(messageController.sendMessage)
