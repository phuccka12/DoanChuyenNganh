// src/app/(admin)/admin/lessons/[lessonId]/edit/components/EditLessonForm.tsx
'use client';

import { useState } from 'react';
import { updateLessonDetails } from '../action';
import type { Database } from '@/lib/database.types';

type Lesson = Database['public']['Tables']['lessons']['Row'];

export default function EditLessonForm({ lesson }: { lesson: Lesson }) {
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || '');

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await updateLessonDetails(formData);
      }}
      className="mt-6 space-y-6"
    >
      {/* Input ẩn này rất quan trọng để server action biết cần update lesson nào */}
      <input type="hidden" name="lessonId" value={lesson.id} />

      {/* Tiêu đề */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
          Tiêu đề bài học
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-800"
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-800"
        />
      </div>

      {/* Nút Lưu */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}