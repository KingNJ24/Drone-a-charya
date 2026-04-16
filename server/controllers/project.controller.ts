import { NextRequest } from 'next/server'
import { created, ok } from '@/server/lib/api-response'
import { requireAuth } from '@/server/middleware/auth'
import { validate } from '@/server/middleware/validate'
import { projectService } from '@/server/services/project.service'
import {
  commentSchema,
  createProjectSchema,
  feedQuerySchema,
} from '@/server/validations/project.validation'

export const projectController = {
  async create(request: NextRequest) {
    const session = requireAuth(request)
    const parsed = validate(createProjectSchema, await request.json())
    const body = {
      ...parsed,
      visibility: parsed.visibility ?? 'PUBLIC',
    }
    return created(await projectService.create(session.userId, body))
  },

  async getFeed(request: NextRequest) {
    const query = validate(
      feedQuerySchema,
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    )
    return ok(await projectService.getFeed(query))
  },

  async getById(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return ok(await projectService.getById(id))
  },

  async like(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = requireAuth(request)
    const { id } = await params
    return ok(await projectService.like(id, session.userId))
  },

  async comment(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = requireAuth(request)
    const { id } = await params
    const body = validate(commentSchema, await request.json())
    return created(await projectService.comment(id, session.userId, body.content))
  },
}
