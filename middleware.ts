import { NextResponse, type NextRequest } from 'next/server'

function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin') ?? ''
  const allowList =
    process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean) ?? []
  const allow =
    allowList.length === 0
      ? '*'
      : allowList.includes(origin)
        ? origin
        : allowList[0] ?? '*'

  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'Authorization, Content-Type, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  }
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
    }
    const res = NextResponse.next({ request })
    const headers = corsHeaders(request)
    Object.entries(headers).forEach(([k, v]) => {
      res.headers.set(k, v as string)
    })
    return res
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
