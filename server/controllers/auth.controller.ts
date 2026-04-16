import { NextRequest } from 'next/server'
import { created, ok } from '@/server/lib/api-response'
import { validate } from '@/server/middleware/validate'
import { authService } from '@/server/services/auth.service'
import { loginSchema, signupSchema } from '@/server/validations/auth.validation'

export const authController = {
  async signup(request: NextRequest) {
    const body = validate(signupSchema, await request.json())
    return created(await authService.signup(body))
  },

  async login(request: NextRequest) {
    const body = validate(loginSchema, await request.json())
    return ok(await authService.login(body))
  },
}
