import { requestController } from '@/server/controllers/request.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const PATCH = withErrorHandler(requestController.update)
