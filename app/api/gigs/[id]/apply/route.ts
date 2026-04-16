import { gigController } from '@/server/controllers/gig.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const POST = withErrorHandler(gigController.apply)
