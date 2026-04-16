import { z } from 'zod'

export const sendMessageSchema = z.object({
  receiverId: z.string().cuid().optional(),
  conversationId: z.string().cuid().optional(),
  content: z.string().min(1).max(2000),
}).refine(data => data.receiverId || data.conversationId, {
  message: "Either receiverId or conversationId must be provided",
})

export const createConversationSchema = z.object({
  participantId: z.string().cuid(),
})
