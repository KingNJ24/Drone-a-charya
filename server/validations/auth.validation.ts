import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['STUDENT', 'TEACHER', 'COMPANY']),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  avatar: z.string().url().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
