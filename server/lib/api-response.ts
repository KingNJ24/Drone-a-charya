import { NextResponse } from 'next/server'

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function created(data: unknown) {
  return NextResponse.json(data, { status: 201 })
}
