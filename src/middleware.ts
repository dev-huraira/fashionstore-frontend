import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // /admin/login is always public
    if (pathname.startsWith('/admin/login')) {
        return NextResponse.next();
    }

    // /admin (redirect page) — let it through; the page itself does role-based redirect
    if (pathname === '/admin') {
        return NextResponse.next();
    }

    // All other /admin/* routes require the admin_session cookie
    if (pathname.startsWith('/admin/')) {
        const adminSession = request.cookies.get('admin_session');
        if (!adminSession || adminSession.value !== '1') {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
};
