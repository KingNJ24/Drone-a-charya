import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  tags: z.array(z.string()).min(1),
  repoLink: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
})

export const feedQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(10),
  tag: z.string().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1).max(500),
})
