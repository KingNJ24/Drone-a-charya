import { z } from 'zod'

export const createConnectionSchema = z.object({
  receiverId: z.string().min(1),
})

export const updateConnectionSchema = z.object({
  status: z.enum(['ACCEPTED']),
})
