import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Simple redirect middleware
  // More complex auth checks should be done in layout/components with useAuthContext
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
