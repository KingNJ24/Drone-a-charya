import { gigController } from '@/server/controllers/gig.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const GET = withErrorHandler(gigController.list)
export const POST = withErrorHandler(gigController.create)
