import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  avatar: z.string().url().optional(),
})
