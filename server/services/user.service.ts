import { prisma } from '@/server/lib/prisma'
import { NotFoundError } from '@/server/lib/errors'

export const userService = {
  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        avatar: true,
        createdAt: true,
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            starsCount: true,
            createdAt: true,
          },
        },
      },
    })

    if (!user) throw new NotFoundError('User not found')
    return user
  },

  async listByRole(role: 'STUDENT' | 'TEACHER' | 'COMPANY') {
    return prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        skills: true,
      },
    })
  },

  async update(userId: string, data: { name?: string; bio?: string; skills?: string[]; avatar?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        avatar: true,
        createdAt: true,
      },
    })
  },
}
