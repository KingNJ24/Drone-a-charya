import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import { env } from '@/server/config/env'

export interface JwtPayload {
  userId: string
  role: 'STUDENT' | 'TEACHER' | 'COMPANY'
  email: string
}

export function signJwt(payload: JwtPayload) {
  const secret = env.JWT_SECRET as Secret
  const options = {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  } as SignOptions
  return jwt.sign(payload, secret, options)
}

export function verifyJwt(token: string) {
  return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload
}
