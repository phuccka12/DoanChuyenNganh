import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Book } from 'lucide-react';
import EditLessonForm from './components/EditLessonForm';
import AddSectionForm from './components/AddSectionForm';
import AddQuestionForm from './components/AddQuestionForm';
type Question = Database['public']['Tables']['questions']['Row'] & {
  order?: number | null;
};

type Section = Database['public']['Tables']['test_sections']['Row'] & {
  order?: number | null;
  questions: Question[];
};

type LessonWithDetails = Database['public']['Tables']['lessons']['Row'] & {
  test_sections: Section[];
};

async function getLessonDetails(lessonId: string): Promise<LessonWithDetails | null> {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      test_sections (
        *,
        questions (
          *
        )
      )
    `)
    .eq('id', lessonId)
    .single();

  if (error || !data) {
    console.error('Lỗi khi tải chi tiết bài học hoặc không tìm thấy dữ liệu:', error);
    return null;
  }

  // Sắp xếp các sections và questions theo thứ tự 'order'
  if (data.test_sections && Array.isArray(data.test_sections)) {
    data.test_sections.sort((a: Section, b: Section) => (a.order || 0) - (b.order || 0));
    data.test_sections.forEach((section: Section) => {
      if (section.questions && Array.isArray(section.questions)) {
        section.questions.sort((a: Question, b: Question) => (a.order || 0) - (b.order || 0));
      }
    });
  }

  return data as LessonWithDetails;
}

// Trang Editor chính
export default async function LessonEditorPage({ params }: { params: { lessonId: string } }) {
  const lesson = await getLessonDetails(params.lessonId);

  if (!lesson) {
    notFound();
  }

  const sections = lesson.test_sections || [];

  return (
    <div className="container mx-auto p-6 md:p-12 space-y-10">
      {/* Header */}
      <div>
        <Link href="/admin/lessons" className="text-sm text-indigo-600 hover:underline transition-all duration-200 ease-in-out">
          ← Quay lại danh sách bài học
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3 mt-4">
          <Book className="w-8 h-8 text-indigo-600" />
          <span>Chỉnh sửa bài học: <span className="font-extrabold">{lesson.title}</span></span>
        </h1>
      </div>

      {/* Phần 1: Form chỉnh sửa thông tin cơ bản của bài học */}
      <div className="p-8 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl shadow-lg border border-gray-200 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">Thông tin cơ bản</h2>
        <EditLessonForm lesson={lesson} />
      </div>

      {/* Phần 2: Quản lý các Sections và Questions */}
      <div className="p-8 bg-gradient-to-br from-blue-700 to-green-50 rounded-2xl shadow-lg border border-gray-200 space-y-6 mt-6">
        <div className="space-y-4">
          {sections.length > 0 ? (
            sections.map(section => (
              <div key={section.id} className="p-6 border rounded-lg bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
                <h3 className="font-semibold text-xl text-gray-800">{section.title || `Section ${section.order}`}</h3>
                <p className="text-sm text-gray-600">{section.content}</p>

                <div className="mt-4 pl-4 space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Câu hỏi:</h4>
                  {(section.questions?.length || 0) > 0 ? (
                    section.questions?.map(question => (
                      <div key={question.id} className="text-sm p-2 border-l-2 border-indigo-500 bg-indigo-500 hover:bg-indigo-400 rounded-md">
                        {question.question_text}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Chưa có câu hỏi nào trong section này.</p>
                  )}
                </div>
                <AddQuestionForm sectionId={section.id} lessonId={lesson.id} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Chưa có nội dung nào trong bài học này. Hãy bắt đầu bằng việc thêm một Section!</p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition-all duration-200 ease-in-out transform hover:scale-105">
            <AddSectionForm lessonId={lesson.id} />
          </button>
        </div>
      </div>
    </div>
  );
}