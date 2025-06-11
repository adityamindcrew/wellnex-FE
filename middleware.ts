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
console.log(token);

  // Set dashboard lock cookie when on dashboard
  if (token && pathname === '/dashboard') {
    const response = NextResponse.next();
    response.cookies.set('dashboardLock', 'true', { path: '/' });
    // Add cache control headers to prevent back navigation
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // Set admin dashboard lock cookie when on admin dashboard
  if (token && pathname === '/admin/dashboard') {
    const response = NextResponse.next();
    response.cookies.set('adminDashboardLock', 'true', { path: '/' });
    // Add cache control headers to prevent back navigation
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // Get dashboard locks
  const dashboardLock = request.cookies.get('dashboardLock')?.value === 'true';
  const adminDashboardLock = request.cookies.get('adminDashboardLock')?.value === 'true';

  // If regular dashboard lock is set, block navigation except dashboard and logout
  if (
    token &&
    dashboardLock &&
    !(pathname === '/dashboard' || pathname === '/logout')
  ) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    // Add cache control headers to prevent back navigation
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // If admin dashboard lock is set, block navigation except admin dashboard and logout
  if (
    token &&
    adminDashboardLock &&
    !(pathname === '/admin/dashboard' || pathname === '/logout')
  ) {
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
    // Add cache control headers to prevent back navigation
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If it's a protected route and there's no token, redirect to signin
  if (isProtectedRoute && !token) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // If there's no token and it's not a public route, redirect to signin
  if (!token) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
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