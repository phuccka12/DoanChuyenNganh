// src/app/api/admin/create-user/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password, full_name, role } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Kiểm tra xem người thực hiện có phải là admin không
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Không được phép.' }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Chỉ có admin mới có quyền thực hiện hành động này.' }, { status: 403 });
  }

  // 2. Nếu là admin, tiến hành tạo user mới bằng admin client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // 3. Cập nhật role trong bảng profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role: role })
    .eq('id', newUser.user.id);

  if (profileError) {
    return NextResponse.json({ error: `Tạo user thành công nhưng không thể cập nhật role: ${profileError.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: 'Tạo người dùng thành công', user: newUser.user });
}