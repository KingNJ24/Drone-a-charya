import { NextResponse } from 'next/server'

/**
 * Notifications inbox — extend with a Prisma `Notification` model + Redis pub/sub when needed.
 * Returns an empty list so production does not depend on MongoDB.
 */
export async function GET() {
  return NextResponse.json({ notifications: [] })
}

export async function PATCH() {
  return NextResponse.json({ success: true })
}
