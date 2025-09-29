// src/app/(admin)/admin/lessons/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { PlusCircle, BookCopy, Trash2,  FilePenLine } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { deleteLesson } from './actions';

export const dynamic = 'force-dynamic';

export default async function ManageLessonsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookCopy className="w-7 h-7 text-blue-600" />
            Quản lý Bài học
          </h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý các bài học cho hệ thống.</p>
        </div>
        <Link
          href="/admin/lessons/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Tạo bài học mới
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Tiêu đề</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Loại</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {lessons && lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{lesson.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {lesson.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <td className="px-6 py-4 text-right flex justify-end items-center gap-2">
  {/* Link Chỉnh sửa */}
  <Link
    href={`/admin/lessons/${lesson.id}/edit`}
    className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
    title="Chỉnh sửa"
  >
    <FilePenLine size={18} />
  </Link>

  {/* Form Xóa */}
  <form action={deleteLesson}>
    <input type="hidden" name="lessonId" value={lesson.id} />
    <button type="submit" className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors" title="Xóa">
      <Trash2 size={18} />
    </button>
  </form>
</td>
                     
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-500">
                    Chưa có bài học nào. Hãy tạo một bài học mới!
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