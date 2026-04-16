import { prisma } from '@/server/lib/prisma'
import { AppError, ForbiddenError, NotFoundError } from '@/server/lib/errors'

const userPreview = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  bio: true,
} as const

export const connectionService = {
  async listForUser(userId: string) {
    return prisma.connection.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: userPreview },
        receiver: { select: userPreview },
      },
    })
  },

  async getPendingRequests(userId: string) {
    return prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: { select: userPreview },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async create(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new AppError('Cannot connect with yourself', 400, 'SELF_CONNECTION')
    }

    return prisma.connection.create({
      data: { senderId, receiverId },
    })
  },

  async update(id: string, userId: string, status: 'ACCEPTED') {
    const connection = await prisma.connection.findUnique({ where: { id } })
    if (!connection) throw new NotFoundError('Connection not found')
    if (connection.receiverId !== userId) {
      throw new AppError('Only the receiver can accept this connection', 403, 'FORBIDDEN')
    }

    return prisma.connection.update({
      where: { id },
      data: { status },
    })
  },

  async remove(connectionId: string, userId: string) {
    const connection = await prisma.connection.findUnique({ where: { id: connectionId } })
    if (!connection) throw new NotFoundError('Connection not found')
    if (connection.senderId !== userId && connection.receiverId !== userId) {
      throw new ForbiddenError('You cannot remove this connection')
    }
    return prisma.connection.delete({ where: { id: connectionId } })
  },
}
