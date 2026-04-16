import { connectionController } from '@/server/controllers/connection.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const GET = withErrorHandler(connectionController.list)
export const POST = withErrorHandler(connectionController.create)
export const DELETE = withErrorHandler(connectionController.remove)
