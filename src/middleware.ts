import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const locales = ['en', 'es'];
    const segment = pathname.split('/')[1];
    const locale = locales.includes(segment) ? segment : 'en';

    // Check if maintenance mode is enabled
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

    // Allow access to admin, auth, api, and coming-soon routes even in maintenance mode
    const isAllowedPath =
        pathname.includes('/admin') ||
        pathname.includes('/auth') ||
        pathname.includes('/api') ||
        pathname.includes('/coming-soon') ||
        pathname.includes('/_next') ||
        pathname.includes('/_vercel') ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf)$/)

    // Check if user is authenticated (for preview access)
    let isAuthenticated = false
    if (isMaintenanceMode && !isAllowedPath) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()
        isAuthenticated = !!user
    }

    // Redirect to coming soon if in maintenance mode, not an allowed path, and not authenticated
    if (isMaintenanceMode && !isAllowedPath && !isAuthenticated) {
        return NextResponse.redirect(new URL(`/${locale}/coming-soon`, request.url))
    }

    let response = intlMiddleware(request);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Protect admin routes
    if (request.nextUrl.pathname.includes('/admin')) {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (!user || error) {
            const loginUrl = new URL(`/${locale}/auth/login`, request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    // Refresh session if expired - do this after auth check
    await supabase.auth.getUser()

    return response
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
