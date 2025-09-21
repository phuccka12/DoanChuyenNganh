// src/app/(admin)/admin/users/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import UsersTable from '../../../components/admin/UsersTable'; // Import component con



const USERS_PER_PAGE = 10; // 10 người dùng mỗi trang

// Trang này là Server Component, nhận searchParams từ URL
export default async function ManageUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const searchQuery = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);

  // Tính toán phân trang
  const start = (page - 1) * USERS_PER_PAGE;
  const end = start + USERS_PER_PAGE - 1;

  // Xây dựng câu query Supabase
  let query = supabase
    .from('profiles')
    .select('id, full_name, email, role', { count: 'exact' });

  // Thêm điều kiện tìm kiếm nếu có
  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
  }

  // Thêm phân trang và sắp xếp
  query = query.range(start, end).order('full_name', { ascending: true });

  const { data: profiles, error, count } = await query;

  if (error) {
    console.error("Lỗi khi tải dữ liệu người dùng:", error.message);
  }

  const totalPages = Math.ceil((count || 0) / USERS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
      </div>

      {/* Truyền dữ liệu xuống Client Component để xử lý tương tác */}
      <UsersTable
        profiles={profiles || []}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={searchQuery}
      />
    </div>
  );
}