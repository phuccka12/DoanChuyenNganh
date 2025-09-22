// src/app/(dashboard)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import DashboardClientUI from '../components/DashboardClientUI'; // Import component client

// Hàm lấy dữ liệu
async function getDashboardData(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { profile: null, pathItems: [] };

  // Lấy profile và lộ trình học cùng lúc
  const [profileRes, pathRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase
      .from('user_path_items')
      .select('*, lessons(id, title)')
      .eq('user_id', user.id)
      .order('item_order', { ascending: true })
  ]);

  return {
    profile: profileRes.data,
    pathItems: pathRes.data || []
  };
}

// Đây là Server Component
export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { profile, pathItems } = await getDashboardData(supabase);

  // Truyền dữ liệu đã lấy được xuống cho Client Component
  return <DashboardClientUI profile={profile} pathItems={pathItems} />;
}