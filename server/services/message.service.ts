import { prisma } from '@/server/lib/prisma'
import { NotFoundError, ForbiddenError } from '@/server/lib/errors'

const userPreview = {
  id: true,
  name: true,
  avatar: true,
  role: true,
}

export const messageService = {
  async getConversations(userId: string) {
    return prisma.conversation.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: {
        participants: {
          where: { NOT: { id: userId } },
          select: userPreview,
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
  },

  async getMessages(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: userId } },
      },
    })

    if (!conversation) throw new ForbiddenError('Access denied to conversation')

    return prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: userPreview },
      },
      orderBy: { createdAt: 'asc' },
    })
  },

  async sendMessage(userId: string, input: { receiverId?: string; conversationId?: string; content: string }) {
    let conversationId = input.conversationId

    if (!conversationId && input.receiverId) {
      // Find or create conversation
      const existing = await prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { id: userId } } },
            { participants: { some: { id: input.receiverId } } },
          ],
        },
      })

      if (existing) {
        conversationId = existing.id
      } else {
        const created = await prisma.conversation.create({
          data: {
            participants: {
              connect: [{ id: userId }, { id: input.receiverId }],
            },
          },
        })
        conversationId = created.id
      }
    }

    if (!conversationId) throw new Error('Could not determine conversation')

    const message = await prisma.message.create({
      data: {
        content: input.content,
        senderId: userId,
        conversationId,
      },
      include: {
        sender: { select: userPreview },
      },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return message
  },
}
