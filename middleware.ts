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
  
  // LOG 1: Middleware đã chạy cho đường dẫn nào
  console.log(`--- Middleware đang chạy cho: ${pathname}`);

  // Nếu chưa đăng nhập thì không cần làm gì thêm
  if (!session) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // LOG 2: Đã tìm thấy session của user nào
  console.log(`>>> Đã tìm thấy session cho User ID: ${session.user.id}`);
  
  // Lấy vai trò của người dùng từ DB
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  // LOG 3: Kiểm tra lỗi từ Supabase
  if (error) {
    console.error(`!!! Lỗi khi truy vấn DB: ${error.message}`);
  }

  const userRole = profile?.role;
  // LOG 4 (QUAN TRỌNG NHẤT): Vai trò đọc được là gì?
  console.log(`>>> Vai trò của người dùng trong DB là: >>> ${userRole} <<<`);

  // Xử lý chuyển hướng dựa trên vai trò
  if (userRole === 'admin' && pathname.startsWith('/dashboard')) {
    console.log('>>> Quyết định: Là admin ở dashboard, chuyển về /admin.');
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (userRole !== 'admin' && pathname.startsWith('/admin')) {
    console.log('>>> Quyết định: Không phải admin nhưng vào /admin, chuyển về /dashboard.');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  console.log('--- Middleware kết thúc, cho phép truy cập.');
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};