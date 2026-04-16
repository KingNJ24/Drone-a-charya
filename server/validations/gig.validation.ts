import { z } from 'zod'

export const createGigSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  budget: z.string().min(1),
  requiredSkills: z.array(z.string()).min(1),
})

export const applyGigSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED']).optional(),
})
