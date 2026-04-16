import { prisma } from '@/server/lib/prisma'

export const gigService = {
  async create(companyId: string, data: { title: string; description: string; budget: string; requiredSkills: string[] }) {
    return prisma.gig.create({
      data: {
        companyId,
        ...data,
      },
      include: {
        company: {
          select: { id: true, name: true, role: true },
        },
      },
    })
  },

  async list() {
    return prisma.gig.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { id: true, name: true, role: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    })
  },

  async apply(userId: string, gigId: string) {
    return prisma.application.upsert({
      where: { userId_gigId: { userId, gigId } },
      update: {},
      create: { userId, gigId },
    })
  },
}
