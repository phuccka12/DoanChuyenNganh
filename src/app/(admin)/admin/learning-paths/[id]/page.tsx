// src/app/(admin)/admin/learning-paths/[id]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Database } from '@/lib/database.types';
import { addLessonToPath, removeLessonFromPath } from './actions';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';

// Định nghĩa kiểu dữ liệu rõ ràng
type Lesson = {
  id: string;
  title: string | null;
};

type PathItemWithLesson = {
  id: string;
  item_order: number | null;
  lessons: Lesson[] | null;
};

async function getPathData(pathId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: learningPath } = await supabase.from('learning_paths').select('*').eq('id', pathId).single();
  if (!learningPath) notFound();

  const { data: pathItemsData } = await supabase
    .from('path_items')
    .select('id, item_order, lessons(id, title)')
    .eq('path_id', pathId)
    .order('item_order');

  const pathItems = (pathItemsData as PathItemWithLesson[] || []);

  const lessonIdsInPath = pathItems
    .map(item => item.lessons?.[0]?.id)
    .filter(Boolean) as string[];

  let availableLessonsQuery = supabase.from('lessons').select('id, title');
  if (lessonIdsInPath.length > 0) {
    availableLessonsQuery = availableLessonsQuery.not('id', 'in', `(${lessonIdsInPath.join(',')})`);
  }
  const { data: availableLessons } = await availableLessonsQuery;

  return {
    learningPath,
    pathItems,
    availableLessons: (availableLessons as Lesson[]) || []
  };
}

export default async function LearningPathDetailPage({ params }: { params: { id: string } }) {
  const { learningPath, pathItems, availableLessons } = await getPathData(params.id);

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-10 border-b pb-6">
        <Link
          href="/admin/learning-paths"
          className="text-pink-600 hover:underline text-sm font-bold"
        >
          ← Quay lại danh sách lộ trình
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 flex items-center gap-2">
          <BookOpen className="text-pink-600" size={32} />
          {learningPath.name}
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          {learningPath.description || 'Không có mô tả.'}
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cột 1: Các bài học trong lộ trình */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center justify-between">
            <span>Bài học trong Lộ trình</span>
            <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-medium">
              {pathItems.length} bài
            </span>
          </h2>
          <div className="space-y-3">
            {pathItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border"
              >
                <span className="font-bold text-gray-900">
                  {item.lessons?.[0]?.title || 'Lỗi tải tên bài học'}
                </span>
                <form action={removeLessonFromPath}>
                  <input type="hidden" name="pathItemId" value={item.id} />
                  <input type="hidden" name="pathId" value={learningPath.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                    title="Xóa bài học"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            ))}
            {pathItems.length === 0 && (
              <p className="text-sm text-gray-500 italic">Chưa có bài học nào.</p>
            )}
          </div>
        </div>

        {/* Cột 2: Các bài học có sẵn */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center justify-between">
            <span>Các bài học có sẵn</span>
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
              {availableLessons.length} bài
            </span>
          </h2>
          <div className="space-y-3">
            {availableLessons.map(lesson => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border"
              >
                <span className="font-medium text-gray-900">{lesson.title}</span>
                <form action={addLessonToPath}>
                  <input type="hidden" name="pathId" value={learningPath.id} />
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition"
                    title="Thêm vào lộ trình"
                  >
                    <PlusCircle size={18} />
                  </button>
                </form>
              </div>
            ))}
            {availableLessons.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Không có bài học nào có sẵn để thêm.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
