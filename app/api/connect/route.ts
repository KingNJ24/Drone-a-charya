import { connectionController } from '@/server/controllers/connection.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const POST = withErrorHandler(connectionController.create)
