'use client';

import { useState, useRef } from 'react';
import { createSection } from '../action';
import { Plus } from 'lucide-react';

export default function AddSectionForm({ lessonId }: { lessonId: string }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (formData: FormData) => {
    // Gọi server action để tạo section
    await createSection(formData);
    // Reset form sau khi submit thành công
    formRef.current?.reset();
    // Ẩn form đi
    setIsFormVisible(false);
  };

  return (
    <>
      {/* Nút bấm luôn hiển thị */}
      <button
        onClick={() => setIsFormVisible(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition duration-200"
      >
        <Plus size={16} />
        Thêm Section
      </button>

      {/* Form hiện ra khi isFormVisible là true */}
      {isFormVisible && (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(new FormData(formRef.current!));
          }}
          className="w-full p-6 mt-6 bg-white border border-gray-300 rounded-lg shadow-lg space-y-4"
        >
          <input type="hidden" name="lessonId" value={lessonId} />

          <h3 className="font-semibold text-lg text-gray-800">Tạo Section mới</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tiêu đề Section */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">Tiêu đề Section</label>
              <input
                id="title"
                name="title"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ví dụ: Reading Passage 1"
                required
              />
            </div>

            {/* Loại Section */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-900">Loại Section</label>
              <select
                id="type"
                name="type"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="reading_passage">Đoạn văn Reading</option>
                <option value="listening_audio">File nghe Listening</option>
                <option value="multiple_choice_group">Nhóm câu hỏi trắc nghiệm</option>
              </select>
            </div>
          </div>

          {/* Nội dung */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội dung (Đoạn văn, transcript...)</label>
            <textarea
              id="content"
              name="content"
              rows={5}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Dán đoạn văn hoặc nội dung khác vào đây..."
            />
          </div>

          {/* Nút bấm */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsFormVisible(false)}
              className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg text-sm hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-500 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition duration-200"
            >
              Lưu Section
            </button>
          </div>
        </form>
      )}
    </>
  );
}
