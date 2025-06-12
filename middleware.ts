import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/landing', '/faqs', '/signin', '/signup', '/onboarding/step-1', '/onboarding/step-2', '/onboarding/step-3', '/onboarding/step-4', '/onboarding/step-5', '/onboarding/step-6','policy-page', '/about', '/help', '/verifyEmail', '/forgot-password', '/logout','/careers']

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

  // Get the tokens from cookies and headers
  const authCookie = request.cookies.get('authorization')?.value
  const tokenCookie = request.cookies.get('token')?.value
  const authHeader = request.headers.get('authorization')

  const token = tokenCookie ||
    (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) ||
    (authCookie?.startsWith('Bearer ') ? authCookie.split(' ')[1] : null)
console.log(token);

  // STRICT DASHBOARD LOCK - Check this FIRST, before ANY other checks
  if (request.cookies.get('dashboardLock')?.value === 'true') {
    // Only allow dashboard and logout, block EVERYTHING else
    if (pathname !== '/dashboard' && pathname !== '/logout') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // STRICT ADMIN DASHBOARD LOCK - Check this right after regular dashboard lock
  if (request.cookies.get('adminDashboardLock')?.value === 'true') {
    // Only allow admin dashboard and logout, block EVERYTHING else
    if (pathname !== '/admin/dashboard' && pathname !== '/logout') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // If it's a public route, allow access immediately
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  // If it's a protected route and there's no token, redirect to signin
  if (isProtectedRoute && !token) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // If authenticated and on dashboard, set strict lock
  if (pathname === '/dashboard' && token) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.cookies.set('dashboardLock', 'true', { path: '/' })
    return response
  }

  // If authenticated and on admin dashboard, set strict lock
  if (pathname === '/admin/dashboard' && token) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.cookies.set('adminDashboardLock', 'true', { path: '/' })
    return response
  }

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
    response.cookies.delete('token')
    response.cookies.delete('authorization')
    response.cookies.delete('adminDashboardLock')
    response.cookies.delete('dashboardLock')
    return response
  }

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

  // Store current step in cookie when on onboarding
  if (pathname.startsWith('/onboarding/step-')) {
    const currentStep = pathname.split('step-')[1]
    const response = NextResponse.next()
    response.cookies.set('currentStep', currentStep || '1', { path: '/' })
    response.cookies.set('inOnboarding', 'true', { path: '/' })
    return response
  }

  // If trying to access dashboard while on onboarding, keep them on current step
  if (pathname === '/dashboard' && request.cookies.get('inOnboarding')?.value === 'true') {
    const currentStep = request.cookies.get('currentStep')?.value || '1'
    return NextResponse.redirect(new URL(`/onboarding/step-${currentStep}`, request.url))
  }

  // Clear onboarding cookies when not in onboarding
  if (!pathname.startsWith('/onboarding/')) {
    const response = NextResponse.next()
    response.cookies.delete('inOnboarding')
    response.cookies.delete('currentStep')
    return response
  }

  // If there's a token, allow access
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