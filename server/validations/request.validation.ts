import { z } from 'zod'

export const createRequestSchema = z.object({
  receiverId: z.string().min(1),
  message: z.string().min(3).max(1000),
  type: z.enum(['COLLABORATION', 'MENTORSHIP']).optional(),
})

export const updateRequestSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
})
