import bcrypt from 'bcryptjs'
import { prisma } from '@/server/lib/prisma'
import { AppError, UnauthorizedError } from '@/server/lib/errors'
import { signJwt } from '@/server/lib/jwt'

export const authService = {
  async signup(input: {
    name: string
    email: string
    password: string
    role: 'STUDENT' | 'TEACHER' | 'COMPANY'
    bio?: string
    skills?: string[]
    avatar?: string
  }) {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } })
    if (existingUser) {
      throw new AppError('Email is already registered', 409, 'EMAIL_TAKEN')
    }

    const password = await bcrypt.hash(input.password, 10)
    const user = await prisma.user.create({
      data: { ...input, password, skills: input.skills ?? [] },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        skills: true,
        avatar: true,
        createdAt: true,
      },
    })

    return {
      user,
      token: signJwt({ userId: user.id, email: user.email, role: user.role }),
    }
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const valid = await bcrypt.compare(input.password, user.password)
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    return {
      token: signJwt({ userId: user.id, email: user.email, role: user.role }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        avatar: user.avatar,
      },
    }
  },
}
