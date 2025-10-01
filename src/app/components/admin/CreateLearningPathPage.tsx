'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import {
  Save,
  Plus,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react';

type CurriculumItem = Database['public']['Tables']['curriculum_items']['Insert'];

interface FormData {
  name: string;
  description: string;
  course_type: 'TOEIC' | 'IELTS' | 'APTIS';
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper-Intermediate' | 'Advanced';
  target_score: string;
  duration_weeks: number;
  difficulty_level: number;
  prerequisites: string;
  is_active: boolean;
}

interface CurriculumItemForm extends Omit<CurriculumItem, 'id' | 'learning_path_id' | 'created_at'> {
  week_number: number;
  day_number: number;
  order_index: number;
  title: string;
  description: string;
  content_type: 'Listening' | 'Reading' | 'Writing' | 'Speaking' | 'Test' | 'Exercise' | 'Review';
  estimated_minutes: number;
  is_required: boolean;
}

export default function CreateLearningPathPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    course_type: 'TOEIC',
    level: 'Beginner',
    target_score: '',
    duration_weeks: 8,
    difficulty_level: 1,
    prerequisites: '',
    is_active: true
  });

  const [curriculumItems, setCurriculumItems] = useState<CurriculumItemForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'curriculum'>('basic');

  const supabase = createClientComponentClient<Database>();

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCurriculumItem = () => {
    const newItem: CurriculumItemForm = {
      week_number: 1,
      day_number: 1,
      order_index: curriculumItems.length + 1,
      title: '',
      description: '',
      content_type: 'Reading',
      estimated_minutes: 30,
      is_required: true
    };
    setCurriculumItems([...curriculumItems, newItem]);
  };

  const updateCurriculumItem = (index: number, field: keyof CurriculumItemForm, value: string | number | boolean) => {
    const updated = [...curriculumItems];
    updated[index] = { ...updated[index], [field]: value };
    setCurriculumItems(updated);
  };

  const removeCurriculumItem = (index: number) => {
    setCurriculumItems(curriculumItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!formData.name || !formData.description) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      // Create learning path
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .insert([formData])
        .select()
        .single();

      if (pathError) throw pathError;

      // Create curriculum items if any
      if (curriculumItems.length > 0) {
        const curriculumWithPathId = curriculumItems.map(item => ({
          ...item,
          learning_path_id: pathData.id
        }));

        const { error: curriculumError } = await supabase
          .from('curriculum_items')
          .insert(curriculumWithPathId);

        if (curriculumError) throw curriculumError;
      }

      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          course_type: 'TOEIC',
          level: 'Beginner',
          target_score: '',
          duration_weeks: 8,
          difficulty_level: 1,
          prerequisites: '',
          is_active: true
        });
        setCurriculumItems([]);
        setSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Error creating learning path:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo lộ trình');
    } finally {
      setLoading(false);
    }
  };

  const getCourseColor = (courseType: string) => {
    switch (courseType) {
      case 'TOEIC': return 'from-blue-500 to-blue-600';
      case 'IELTS': return 'from-green-500 to-green-600';
      case 'APTIS': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'Listening': return '🎧';
      case 'Reading': return '📖';
      case 'Writing': return '✏️';
      case 'Speaking': return '🗣️';
      case 'Test': return '📝';
      case 'Exercise': return '💪';
      case 'Review': return '🔄';
      default: return '📚';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 bg-gradient-to-r ${getCourseColor(formData.course_type)} rounded-full text-white`}>
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo lộ trình học mới</h1>
            <p className="text-gray-600">Thiết kế lộ trình học tiếng Anh chuyên nghiệp</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Lộ trình đã được tạo thành công!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'basic'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Thông tin cơ bản
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'curriculum'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Curriculum ({curriculumItems.length} bài học)
        </button>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên lộ trình *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: TOEIC Starter - Mục tiêu 450+"
              />
            </div>

            {/* Course Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại khóa học *
              </label>
              <select
                value={formData.course_type}
                onChange={(e) => handleInputChange('course_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="TOEIC">TOEIC</option>
                <option value="IELTS">IELTS</option>
                <option value="APTIS">APTIS</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trình độ *
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Elementary">Elementary</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Upper-Intermediate">Upper-Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Target Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm mục tiêu
              </label>
              <input
                type="text"
                value={formData.target_score}
                onChange={(e) => handleInputChange('target_score', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="450+, 6.5, 4/5"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian (tuần)
              </label>
              <input
                type="number"
                value={formData.duration_weeks}
                onChange={(e) => handleInputChange('duration_weeks', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                max="52"
              />
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ khó (1-5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleInputChange('difficulty_level', level)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      formData.difficulty_level >= level
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu trước khi học
              </label>
              <textarea
                value={formData.prerequisites}
                onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Ví dụ: Kiến thức tiếng Anh cơ bản A2"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả lộ trình *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Mô tả chi tiết về lộ trình học, mục tiêu và phương pháp..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Tab */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Curriculum Items</h3>
            <button
              onClick={addCurriculumItem}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm bài học
            </button>
          </div>

          <div className="space-y-4">
            {curriculumItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getContentTypeIcon(item.content_type)}</span>
                    <span className="font-medium text-gray-900">Bài học {index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeCurriculumItem(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tuần</label>
                    <input
                      type="number"
                      value={item.week_number}
                      onChange={(e) => updateCurriculumItem(index, 'week_number', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ngày</label>
                    <input
                      type="number"
                      value={item.day_number}
                      onChange={(e) => updateCurriculumItem(index, 'day_number', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      min="1"
                      max="7"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Loại</label>
                    <select
                      value={item.content_type}
                      onChange={(e) => updateCurriculumItem(index, 'content_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="Reading">Reading</option>
                      <option value="Listening">Listening</option>
                      <option value="Writing">Writing</option>
                      <option value="Speaking">Speaking</option>
                      <option value="Test">Test</option>
                      <option value="Exercise">Exercise</option>
                      <option value="Review">Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Thời gian (phút)</label>
                    <input
                      type="number"
                      value={item.estimated_minutes}
                      onChange={(e) => updateCurriculumItem(index, 'estimated_minutes', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      min="5"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateCurriculumItem(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Tên bài học..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateCurriculumItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      rows={2}
                      placeholder="Mô tả nội dung bài học..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {curriculumItems.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Chưa có bài học nào</p>
                <button
                  onClick={addCurriculumItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thêm bài học đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={loading || !formData.name || !formData.description}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            loading || !formData.name || !formData.description
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? 'Đang tạo...' : 'Tạo lộ trình'}
        </button>
      </div>
    </div>
  );
}