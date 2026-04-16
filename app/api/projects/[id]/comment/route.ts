import { projectController } from '@/server/controllers/project.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

export const POST = withErrorHandler(projectController.comment)
