import { authController } from '@/server/controllers/auth.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const POST = withErrorHandler(authController.signup)
