import { projectController } from '@/server/controllers/project.controller'
import { withErrorHandler } from '@/server/lib/with-error-handler'

/** Feed (cursor pagination) + create project — Prisma + JWT */
export const GET = withErrorHandler(projectController.getFeed)
export const POST = withErrorHandler(projectController.create)
