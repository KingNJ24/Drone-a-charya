import { Prisma } from '@prisma/client'
import { prisma } from '@/server/lib/prisma'
import { redis } from '@/server/lib/redis'
import { NotFoundError } from '@/server/lib/errors'

const projectFeedSelect = {
  id: true,
  title: true,
  description: true,
  tags: true,
  visibility: true,
  starsCount: true,
  createdAt: true,
  repoLink: true,
  fileUrl: true,
  author: {
    select: {
      id: true,
      name: true,
      role: true,
      avatar: true,
      bio: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} satisfies Prisma.ProjectSelect

export const projectService = {
  async create(authorId: string, data: {
    title: string
    description: string
    tags: string[]
    repoLink?: string
    fileUrl?: string
    visibility: 'PUBLIC' | 'PRIVATE'
  }) {
    const project = await prisma.project.create({
      data: { authorId, ...data },
      select: projectFeedSelect,
    })
    await redis?.del('feed:public')
    return project
  },

  async getFeed(input: { cursor?: string; limit?: number; tag?: string }) {
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 20)
    const cacheKey = !input.cursor && !input.tag ? 'feed:public' : null
    if (cacheKey) {
      const cached = await redis?.get(cacheKey)
      if (cached) return JSON.parse(cached)
    }

    const projects = await prisma.project.findMany({
      take: limit + 1,
      skip: input.cursor ? 1 : 0,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      where: {
        visibility: 'PUBLIC',
        ...(input.tag ? { tags: { has: input.tag } } : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: projectFeedSelect,
    })

    const hasNextPage = projects.length > limit
    const data = hasNextPage ? projects.slice(0, -1) : projects
    const payload = {
      data,
      pageInfo: {
        nextCursor: hasNextPage ? data.at(-1)?.id ?? null : null,
        hasNextPage,
      },
    }

    if (cacheKey) await redis?.set(cacheKey, JSON.stringify(payload), 'EX', 60)
    return payload
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        ...projectFeedSelect,
        comments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, name: true, role: true, avatar: true },
            },
          },
        },
      },
    })

    if (!project) throw new NotFoundError('Project not found')
    return project
  },

  async like(projectId: string, userId: string) {
    await prisma.like.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: {},
      create: { userId, projectId },
    })

    return prisma.project.update({
      where: { id: projectId },
      data: { starsCount: { increment: 1 } },
      select: { id: true, starsCount: true },
    })
  },

  async comment(projectId: string, userId: string, content: string) {
    return prisma.comment.create({
      data: { projectId, userId, content },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    })
  },
}
