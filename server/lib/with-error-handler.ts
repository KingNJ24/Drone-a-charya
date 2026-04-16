import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from '@/server/lib/errors'

/** Next.js passes route context (e.g. `params`); keep this permissive for App Router handlers. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (request: NextRequest, context?: any) => Promise<NextResponse>

export function withErrorHandler(handler: Handler): Handler {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.flatten() },
          { status: 400 },
        )
      }

      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode },
        )
      }

      console.error(error)
      return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' },
        { status: 500 },
      )
    }
  }
}
