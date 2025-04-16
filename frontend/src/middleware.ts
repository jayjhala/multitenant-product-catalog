import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')  // assuming you use auth_token to store session/token

  // Check if token exists
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Proceed to requested path if token exists
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*'],
}
