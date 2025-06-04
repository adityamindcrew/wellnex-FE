import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/landing', '/faqs', '/signin', '/signup', '/policy-page', '/about', '/help', '/verifyEmail', '/forgot-password', '/logout','/careers']

// Define protected routes that require authentication
const protectedRoutes = [
  '/payment/planSelection', 
  '/payment/cardDetails', 
  '/payment/success', 
  '/payment/methodSlection',
  '/payment/currencySelection',
  '/dashboard',
  '/admin/dashboard'
]

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // Handle logout
  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/signup', request.url))
    
    // Clear all cookies
    const cookies = request.cookies.getAll()
    cookies.forEach(cookie => {
      response.cookies.delete(cookie.name)
    })
    
    // Clear specific important cookies
    response.cookies.delete('onboardingToken')
    response.cookies.delete('currentOnboardingStep')
    response.cookies.delete('token')
    response.cookies.delete('authorization')
    
    // Add script to clear localStorage and sessionStorage
    response.headers.set('Clear-Site-Data', '"localStorage", "sessionStorage", "cookies"')
    return response
  }
  console.log(pathname);

  // Redirect /lading to /landing (typo fix)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

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
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // Get the tokens from cookies and headers
  const authCookie = request.cookies.get('authorization')?.value
  const tokenCookie = request.cookies.get('token')?.value
  const authHeader = request.headers.get('authorization')

  const token = tokenCookie ||
    (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) ||
    (authCookie?.startsWith('Bearer ') ? authCookie.split(' ')[1] : null)

  const onboardingToken = request.cookies.get('onboardingToken')?.value
  const currentOnboardingStep = request.cookies.get('currentOnboardingStep')?.value

  // Add debug logging
  console.log('Middleware - Auth Cookie:', authCookie ? 'Present' : 'Missing')
  console.log('Middleware - Token Cookie:', tokenCookie ? 'Present' : 'Missing')
  console.log('Middleware - Auth Header:', authHeader ? 'Present' : 'Missing')
  console.log('Middleware - Final Token:', token ? 'Present' : 'Missing')

  console.log('Middleware - Path:', pathname)
  console.log('Middleware - Token:', token ? 'Present' : 'Missing')
  console.log('Middleware - Is Public:', isPublicRoute)

  // Set dashboard lock cookie when on dashboard
  if (token && (pathname === '/dashboard' || pathname.startsWith('/dashboard/'))) {
    const response = NextResponse.next();
    response.cookies.set('dashboardLock', 'true', { path: '/' });
    return response;
  }

  // Get dashboard lock cookie
  const dashboardLock = request.cookies.get('dashboardLock')?.value === 'true';

  // If dashboard lock is set, block all navigation except dashboard and logout
  if (
    token &&
    dashboardLock &&
    !(pathname === '/dashboard' || pathname.startsWith('/dashboard/') || pathname === '/logout')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Prevent going back to signup if onboarding has started
  if (pathname === '/signup' && onboardingToken) {
    // Only redirect if we're not on the create-account page
    if (!pathname.includes('/create-account')) {
      // If there's a current step, redirect to that step
      if (currentOnboardingStep) {
        return NextResponse.redirect(new URL(`/onboarding/step-${currentOnboardingStep}`, request.url))
      }
      return NextResponse.redirect(new URL('/onboarding/step-1', request.url))
    }
  }

  // Prevent going back to previous steps if on step 5
  if (currentOnboardingStep === '6' && pathname.match(/\/onboarding\/step-[1-5]/)) {
    return NextResponse.redirect(new URL('/onboarding/step-6', request.url))
  }

  // Special case for onboarding: allow if onboardingToken exists
  if (pathname.startsWith('/onboarding') && onboardingToken) {
    // Store current step in a long-lasting cookie
    if (pathname.match(/\/onboarding\/step-\d+/)) {
      const step = pathname.split('/').pop()?.replace('step-', '')
      if (step) {
        const response = NextResponse.next()
        response.cookies.set('currentOnboardingStep', step, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        })
        return response
      }
    }
    return NextResponse.next()
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If it's a protected route and there's no token, redirect to signin
  if (isProtectedRoute && !token) {
    console.log('Middleware - Redirecting to signin from protected route')
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
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
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)',

//   ],
// } 

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)',
}