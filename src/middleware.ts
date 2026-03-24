import { NextRequest, NextResponse } from 'next/server';

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

// Solo /admin requiere rol de admin
const ADMIN_ROUTES = ['/admin'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verificar si la ruta requiere autenticación
    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    if (!isProtected) return NextResponse.next();

    // Leer sesión desde cookie/localStorage no es posible en middleware (solo cookies)
    // Usamos una cookie 'techhub_session' que setearemos desde el cliente
    const sessionCookie = request.cookies.get('techhub_session');

    if (!sessionCookie) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const user = JSON.parse(decodeURIComponent(sessionCookie.value));

        // Verificar que solo admins accedan a /admin
        const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
        if (isAdminRoute && user.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
    } catch {
        // Cookie inválida — redirigir a login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('techhub_session');
        return response;
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
