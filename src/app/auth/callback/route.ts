// src/app/auth/callback/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    // Dùng 'code' nhận được để đổi lấy session của người dùng
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Sau khi có session, chuyển hướng người dùng về trang chủ
  // hoặc trang dashboard
  return NextResponse.redirect(requestUrl.origin)
}