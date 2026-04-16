import { requestController } from '@/server/controllers/request.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const GET = withErrorHandler(requestController.list)
export const POST = withErrorHandler(requestController.create)
