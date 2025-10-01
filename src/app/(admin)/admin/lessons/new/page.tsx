// src/app/(admin)/admin/lessons/new/page.tsx
import { createLesson } from '../actions';
import Link from 'next/link';

export default function NewLessonPage() {
  return (
    <div className="p-6 md:p-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tạo Bài học mới</h1>
        <Link href="/admin/lessons" className="text-blue-600 font-medium hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <form action={createLesson} className="space-y-8">
          {/* Tiêu đề */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Tiêu đề bài học <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="mt-2 block w-full px-4 py-3 border border-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Ví dụ: Reading Passage 1: The History of Tea" 
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-2 block w-full px-4 py-3 border border-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Mô tả ngắn về nội dung bài học..."
            />
          </div>

          {/* Loại bài học */}
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
              Loại bài học <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              required
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
            >
              <option value="">-- Chọn loại --</option>
              <option value="Reading">Reading</option>
              <option value="Listening">Listening</option>
              <option value="Speaking">Speaking</option>
              <option value="Writing">Writing</option>
              <option value="Grammar">Grammar</option>
              <option value="Vocabulary">Vocabulary</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
            >
              Tạo bài học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}