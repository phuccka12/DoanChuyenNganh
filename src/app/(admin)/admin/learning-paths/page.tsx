// src/app/(admin)/admin/learning-paths/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { PlusCircle, BookOpen } from 'lucide-react';
import type { Database } from '@/lib/database.types';

export default async function ManageLearningPathsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: paths, error } = await supabase
    .from('learning_paths')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-600 bg-red-50 rounded-xl shadow-sm">
        ❌ Lỗi khi tải dữ liệu lộ trình: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-pink-600" />
            Quản lý Lộ trình học
          </h1>
          <p className="text-gray-500 mt-1">Xem, chỉnh sửa hoặc tạo mới lộ trình học cho học viên.</p>
        </div>
        <Link
          href="/admin/learning-paths/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          <PlusCircle size={20} />
          Tạo Lộ trình mới
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Tên Lộ trình</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Mục tiêu (Band)</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Thời gian học</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paths && paths.length > 0 ? (
                paths.map((path) => (
                  <tr
                    key={path.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                   <td className="px-6 py-4 font-medium text-gray-900">
                    <Link 
                      href={`/admin/learning-paths/${path.id}`} 
                    className="hover:underline"
                                              >
                                  {path.name}
                                    </Link>
</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                        {path.min_score} – {path.max_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{path.daily_minutes} phút/ngày</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/learning-paths/${path.id}`}
                        className="text-pink-600 hover:text-pink-800 font-medium transition"
                      >
                        ✏️ Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <BookOpen className="w-10 h-10 text-gray-400" />
                      <p>Chưa có lộ trình nào. Hãy tạo một lộ trình mới!</p>
                      <Link
                        href="/admin/learning-paths/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                      >
                        <PlusCircle size={18} />
                        Tạo ngay
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
