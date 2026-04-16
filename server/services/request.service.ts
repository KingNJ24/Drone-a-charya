import { RequestType } from '@prisma/client'
import { prisma } from '@/server/lib/prisma'
import { AppError, NotFoundError } from '@/server/lib/errors'

export const requestService = {
  async create(senderId: string, data: { receiverId: string; message: string; type?: 'COLLABORATION' | 'MENTORSHIP' }) {
    if (senderId === data.receiverId) {
      throw new AppError('Cannot create a request for yourself', 400, 'SELF_REQUEST')
    }

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId }, select: { role: true } }),
      prisma.user.findUnique({ where: { id: data.receiverId }, select: { role: true } }),
    ])

    if (!sender || !receiver) throw new NotFoundError('Sender or receiver not found')

    const type =
      sender.role === 'STUDENT' && receiver.role === 'TEACHER'
        ? RequestType.MENTORSHIP
        : data.type ?? RequestType.COLLABORATION

    return prisma.collaborationRequest.create({
      data: {
        senderId,
        receiverId: data.receiverId,
        message: data.message,
        type,
      },
    })
  },

  async list(userId: string) {
    return prisma.collaborationRequest.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
    })
  },

  async update(id: string, userId: string, status: 'ACCEPTED' | 'REJECTED') {
    const existing = await prisma.collaborationRequest.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Request not found')
    if (existing.receiverId !== userId) {
      throw new AppError('Only the receiver can update this request', 403, 'FORBIDDEN')
    }

    return prisma.collaborationRequest.update({
      where: { id },
      data: { status },
    })
  },
}
