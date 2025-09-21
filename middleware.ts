// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Xử lý người dùng chưa đăng nhập
  if (!session) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // Xử lý người dùng đã đăng nhập
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const userRole = profile?.role;

  // *** LOGIC SỬA LỖI NẰM Ở ĐÂY ***
  // Nếu là admin và đang không ở trong khu vực admin, BẮT BUỘC chuyển về /admin.
  if (userRole === 'admin' && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Nếu là user thường mà cố vào khu vực admin, BẮT BUỘC chuyển về /dashboard.
  if (userRole !== 'admin' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This ensures middleware runs on all pages but not on static assets.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};