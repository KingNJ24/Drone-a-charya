import { userController } from '@/server/controllers/user.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const GET = withErrorHandler(userController.getById)
