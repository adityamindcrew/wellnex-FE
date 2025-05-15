import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/signin', '/signup', '/landing', '/about', '/help', '/verifyEmail', '/forgot-password']

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // Handle verification URL redirect
  if (pathname === '/signin' && url.hash.includes('verifyEmail')) {
    // Extract businessId and token from hash
    const hashParts = url.hash.split('/')
    const businessId = hashParts[hashParts.length - 1].split('?')[0]
    const token = url.hash.split('token=')[1]
    
    // Redirect to verification page
    url.pathname = `/verifyEmail/${businessId}`
    url.search = `?token=${token}`
    url.hash = ''
    
    return NextResponse.redirect(url)
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Get the tokens from cookies and headers
  const authCookie = request.cookies.get('authorization')?.value
  const tokenCookie = request.cookies.get('token')?.value
  const authHeader = request.headers.get('authorization')

  const token = tokenCookie || 
                (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) ||
                (authCookie?.startsWith('Bearer ') ? authCookie.split(' ')[1] : null)

  const onboardingToken = request.cookies.get('onboardingToken')?.value
  const currentOnboardingStep = request.cookies.get('currentOnboardingStep')?.value

  console.log('Middleware - Path:', pathname)
  console.log('Middleware - Token:', token ? 'Present' : 'Missing')
  console.log('Middleware - Is Public:', isPublicRoute)

  // Prevent going back to signup if onboarding has started
  if (pathname === '/signup' && onboardingToken) {
    return NextResponse.redirect(new URL('/onboarding/step-1', request.url))
  }

  // Prevent going back to previous steps if on step 5
  if (currentOnboardingStep === '5' && pathname.match(/\/onboarding\/step-[1-4]/)) {
    return NextResponse.redirect(new URL('/onboarding/step-5', request.url))
  }

  // Special case for onboarding: allow if onboardingToken exists
  if (pathname.startsWith('/onboarding') && onboardingToken) {
    return NextResponse.next()
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If there's no token and it's not a public route, redirect to signin
  if (!token) {
    console.log('Middleware - Redirecting to signin')
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // If there's a token, allow access
  console.log('Middleware - Allowing access to:', pathname)
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 