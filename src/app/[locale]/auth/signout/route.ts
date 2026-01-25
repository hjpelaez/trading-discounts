import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const origin = request.nextUrl.origin
    const locale = request.nextUrl.pathname.split('/')[1] || 'en'

    return NextResponse.redirect(new URL(`/${locale}/auth/login`, origin))
}
