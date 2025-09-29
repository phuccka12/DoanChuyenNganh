// src/app/(admin)/admin/lessons/[lessonId]/edit/components/AddQuestionForm.tsx
'use client';

import { useState, useRef } from 'react';
import { createQuestion } from '../action';
import { Plus } from 'lucide-react';

interface AddQuestionFormProps {
  sectionId: number;
  lessonId: string;
}

export default function AddQuestionForm({ sectionId, lessonId }: AddQuestionFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (formData: FormData) => {
    await createQuestion(formData);
    formRef.current?.reset();
    setIsFormVisible(false);
  };

  if (!isFormVisible) {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="mt-4 px-3 py-1.5 bg-gray-200 text-gray-700 font-semibold rounded-md text-xs hover:bg-gray-300 transition"
      >
        <Plus size={14} className="inline-block mr-1 " />
        Thêm Câu hỏi
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={handleFormSubmit}
      className="w-full p-4 mt-4 border-t border-gray-300 bg-gray-100 rounded-b-lg space-y-3"
    >
      <input type="hidden" name="sectionId" value={sectionId} />
      <input type="hidden" name="lessonId" value={lessonId} />

      <h5 className="font-semibold text-gray-800">Tạo Câu hỏi mới</h5>

      <div>
        <label className="text-sm text-gray-900 font-medium">Nội dung câu hỏi</label>
        <textarea
          name="question_text"
          rows={2}
          className="mt-1 block w-full text-sm px-3 py-2 border text-gray-800 border-gray-700 rounded-md"
          required
        />
      </div>
      <div>
        <label className="text-sm text-gray-800 font-medium">Các lựa chọn (mỗi lựa chọn một dòng)</label>
        <textarea
          name="options"
          rows={4}
          className="mt-1 block w-full text-sm px-3 py-2 border text-gray-600 border-gray-300 rounded-md"
          placeholder={`Đáp án A\nĐáp án B\nĐáp án C\nĐáp án D`}
          required
        />
      </div>
       <div>
        <label className="text-sm  text-gray-900 font-medium">Đáp án đúng</label>
        <input
          name="correct_answer"
          type="text"
          className="mt-1 block w-full text-sm px-3 py-2 border text-gray-600 border-gray-300 rounded-md"
          placeholder="Ví dụ: A"
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm">
          Hủy
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-sm">
          Lưu Câu hỏi
        </button>
      </div>
    </form>
  );
}