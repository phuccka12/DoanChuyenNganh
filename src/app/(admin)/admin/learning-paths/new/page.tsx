// src/app/(admin)/admin/learning-paths/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function NewLearningPathPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!name) return 'Tên lộ trình không được để trống.';
    if (minScore >= maxScore) return 'Điểm tối thiểu phải nhỏ hơn điểm tối đa.';
    if (maxScore <= 0) return 'Điểm tối đa phải lớn hơn 0.';
    if (dailyMinutes <= 0) return 'Thời gian học mỗi ngày phải lớn hơn 0.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    const { data, error: insertError } = await supabase
      .from('learning_paths')
      .insert({
        name,
        description,
        min_score: minScore,
        max_score: maxScore,
        daily_minutes: dailyMinutes,
      })
      .select()
      .single();

    setIsLoading(false);

    if (insertError) {
      setError('Lỗi khi tạo lộ trình: ' + insertError.message);
    } else if (data) {
      router.push(`/admin/learning-paths/${data.id}`);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">✨ Tạo Lộ trình học mới</h1>
        <Link
          href="/admin/learning-paths"
          className="text-pink-600 font-medium hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên lộ trình */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
              Tên Lộ trình <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray text-black rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              placeholder="Ví dụ: Lộ trình Nâng cao (7.0+)"
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              placeholder="Mô tả ngắn về lộ trình này..."
            />
          </div>

          {/* Điểm tối thiểu / tối đa */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="minScore"
                className="block text-sm font-semibold text-gray-700"
              >
                Band điểm tối thiểu
              </label>
              <input
                id="minScore"
                type="number"
                step="0.5"
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value))}
                className="mt-2 block w-full px-4 py-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label
                htmlFor="maxScore"
                className="block text-sm font-semibold text-gray-700"
              >
                Band điểm tối đa
              </label>
              <input
                id="maxScore"
                type="number"
                step="0.5"
                value={maxScore}
                onChange={(e) => setMaxScore(parseFloat(e.target.value))}
                className="mt-2 block w-full px-4 py-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Thời gian học */}
          <div>
            <label
              htmlFor="dailyMinutes"
              className="block text-sm font-semibold text-gray-700"
            >
              Thời gian học yêu cầu (phút/ngày)
            </label>
            <input
              id="dailyMinutes"
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(parseInt(e.target.value, 10))}
              className="mt-2 block w-full px-4 py-3  text-black border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-md text-lg font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
              {isLoading ? 'Đang tạo...' : '🚀 Tạo và tiếp tục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
