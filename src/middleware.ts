import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
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

        console.log('Middleware - Admin route check:', {
            path: request.nextUrl.pathname,
            hasUser: !!user,
            error: error?.message
        })

        if (!user || error) {
            const locale = request.nextUrl.pathname.split('/')[1] || 'en'
            const loginUrl = new URL(`/${locale}/auth/login`, request.url)
            console.log('Redirecting to:', loginUrl.toString())
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
