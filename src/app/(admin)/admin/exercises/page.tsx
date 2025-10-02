'use client';

import { useState, useEffect, useCallback } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import type { Database } from '@/lib/database.types';
import {
  BookOpen,
  Clock,
  Target,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Upload,
  FileText,
  File
} from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string | null;
  exercise_type: string;
  difficulty_level: string;
  max_score: number;
  time_limit_minutes: number | null;
  lesson_id: string | null;
  is_active: boolean;
  created_at: string;
  questions?: Question[];
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
  options?: string[];
  correct_answer: string;
}

interface NewExercise {
  title: string;
  description: string;
  exercise_type: string;
  difficulty_level: string;
  max_score: string;
  time_limit_minutes: string;
  lesson_id: string;
}

interface NewQuestion {
  question_text: string;
  question_type: string;
  points: string;
  options: string[];
  correct_answer: string;
}

interface ParsedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ParsedContent {
  title: string;
  description: string;
  questions: ParsedQuestion[];
  totalQuestions: number;
}

export default function ExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedContent, setParsedContent] = useState<ParsedContent | null>(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const [formData, setFormData] = useState<NewExercise>({
    title: '',
    description: '',
    exercise_type: '',
    difficulty_level: '',
    max_score: '',
    time_limit_minutes: '',
    lesson_id: ''
  });

  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<NewQuestion>({
    question_text: '',
    question_type: '',
    points: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });

  // const supabase = createClientComponentClient<Database>();

  const exerciseTypes = [
    { value: 'multiple_choice', label: 'Trắc nghiệm' },
    { value: 'true_false', label: 'Đúng/Sai' },
    { value: 'fill_blank', label: 'Điền khuyết' },
    { value: 'essay', label: 'Tự luận' },
    { value: 'speaking', label: 'Nói tự do' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Dễ' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'hard', label: 'Khó' }
  ];

  const questionTypes = [
    { value: 'multiple_choice', label: 'Trắc nghiệm' },
    { value: 'true_false', label: 'Đúng/Sai' },
    { value: 'fill_blank', label: 'Điền khuyết' },
    { value: 'essay', label: 'Tự luận' }
  ];

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      
      // Gọi API để lấy danh sách bài tập
      const params = new URLSearchParams();
      if (filterType !== 'all') params.set('exercise_type', filterType);
      if (filterDifficulty !== 'all') params.set('difficulty_level', filterDifficulty);
      if (searchQuery) params.set('search', searchQuery);

      const response = await fetch(`/api/exercises?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setExercises(data.exercises || []);
      } else {
        throw new Error(data.error || 'Không thể tải danh sách bài tập');
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách bài tập');
      
      // Fallback to mock data if API fails
      const mockExercises: Exercise[] = [
        {
          id: '1',
          title: 'TOEIC Listening Practice 1',
          description: 'Luyện tập nghe hiểu cơ bản cho TOEIC',
          exercise_type: 'multiple_choice',
          difficulty_level: 'easy',
          max_score: 100,
          time_limit_minutes: 30,
          lesson_id: null,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          title: 'IELTS Writing Task 2',
          description: 'Viết luận argumentative essay',
          exercise_type: 'essay',
          difficulty_level: 'hard',
          max_score: 200,
          time_limit_minutes: 60,
          lesson_id: null,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      setExercises(mockExercises);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterDifficulty, searchQuery]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleCreateExercise = async () => {
    try {
      setCreateLoading(true);
      setError('');

      if (!formData.title || !formData.exercise_type || !formData.difficulty_level) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Gửi dữ liệu tới API
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          exercise_type: formData.exercise_type,
          difficulty_level: formData.difficulty_level,
          max_score: parseInt(formData.max_score) || 100,
          time_limit_minutes: formData.time_limit_minutes ? parseInt(formData.time_limit_minutes) : null,
          lesson_id: formData.lesson_id || null,
          questions
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Thêm bài tập mới vào danh sách
        setExercises(prev => [data.exercise, ...prev]);

        // Reset form
        setFormData({
          title: '',
          description: '',
          exercise_type: '',
          difficulty_level: '',
          max_score: '',
          time_limit_minutes: '',
          lesson_id: ''
        });
        setQuestions([]);
        setShowCreateModal(false);
      } else {
        throw new Error(data.error || 'Không thể tạo bài tập mới');
      }

    } catch (err) {
      console.error('Error creating exercise:', err);
      setError(err instanceof Error ? err.message : 'Không thể tạo bài tập mới');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      title: exercise.title,
      description: exercise.description || '',
      exercise_type: exercise.exercise_type,
      difficulty_level: exercise.difficulty_level,
      max_score: exercise.max_score.toString(),
      time_limit_minutes: exercise.time_limit_minutes?.toString() || '',
      lesson_id: exercise.lesson_id || ''
    });
    setQuestions(exercise.questions || []);
    setShowEditModal(true);
  };

  const handleUpdateExercise = async () => {
    if (!editingExercise) return;

    if (!formData.title.trim() || !formData.exercise_type || !formData.difficulty_level) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setCreateLoading(true);
      setError('');

      const response = await fetch(`/api/exercises/${editingExercise.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          max_score: parseInt(formData.max_score) || 0,
          time_limit_minutes: formData.time_limit_minutes ? parseInt(formData.time_limit_minutes) : null,
          questions
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Cập nhật bài tập trong danh sách
        setExercises(prev => prev.map(ex => 
          ex.id === editingExercise.id ? data.exercise : ex
        ));

        // Reset form
        setFormData({
          title: '',
          description: '',
          exercise_type: '',
          difficulty_level: '',
          max_score: '',
          time_limit_minutes: '',
          lesson_id: ''
        });
        setQuestions([]);
        setShowEditModal(false);
        setEditingExercise(null);
      } else {
        throw new Error(data.error || 'Không thể cập nhật bài tập');
      }

    } catch (err) {
      console.error('Error updating exercise:', err);
      setError(err instanceof Error ? err.message : 'Không thể cập nhật bài tập');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;

    try {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Không thể xóa bài tập');
      }
    } catch (err) {
      console.error('Error deleting exercise:', err);
      setError(err instanceof Error ? err.message : 'Không thể xóa bài tập');
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question_text || !currentQuestion.question_type) {
      setError('Vui lòng điền đầy đủ thông tin câu hỏi');
      return;
    }

    setQuestions(prev => [...prev, { ...currentQuestion }]);
    setCurrentQuestion({
      question_text: '',
      question_type: '',
      points: '',
      options: ['', '', '', ''],
      correct_answer: ''
    });
    setShowAddQuestion(false);
    setError('');
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || exercise.exercise_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty_level === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getTypeLabel = (type: string) => {
    return exerciseTypes.find(t => t.value === type)?.label || type;
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficultyLevels.find(d => d.value === difficulty)?.label || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    return questionTypes.find(q => q.value === type)?.label || type;
  };

  const handleFileUpload = async (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/pdf'
    ];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ hỗ trợ file Word (.docx) và PDF');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError('Kích thước file không được vượt quá 10MB');
      return;
    }

    setUploadedFile(file);
    setError('');
  };

  const handleParseFile = async () => {
    if (!uploadedFile) return;

    try {
      setUploadLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('/api/exercises/parse-file', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setParsedContent(data.content);
      } else {
        throw new Error(data.error || 'Không thể phân tích file');
      }
    } catch (err) {
      console.error('Error parsing file:', err);
      setError(err instanceof Error ? err.message : 'Không thể phân tích file');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCreateFromFile = async () => {
    if (!parsedContent) return;

    try {
      setCreateLoading(true);
      setError('');

      // Convert parsed questions to NewQuestion format and add to questions list
      const convertedQuestions = parsedContent.questions.map((q: ParsedQuestion) => ({
        question_text: q.question,
        question_type: 'multiple_choice',
        points: '10',
        options: q.options,
        correct_answer: q.options[q.correctAnswer]
      }));

      // Auto-fill form data if empty
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: parsedContent.title || `Bài tập từ file: ${uploadedFile?.name}`,
          description: parsedContent.description || 'Bài tập được tạo từ file upload',
          exercise_type: 'multiple_choice',
          difficulty_level: 'medium',
          max_score: (parsedContent.questions?.length * 10 || 100).toString(),
          time_limit_minutes: (parsedContent.questions?.length * 2 || 30).toString()
        }));
      }

      // Add questions to existing list
      setQuestions(prev => [...prev, ...convertedQuestions]);
      
      // Close upload modal
      setShowUploadModal(false);
      setUploadedFile(null);
      setParsedContent(null);

    } catch (err) {
      console.error('Error importing questions from file:', err);
      setError(err instanceof Error ? err.message : 'Không thể import câu hỏi từ file');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 relative">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-white">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quản lý Bài tập
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tạo và quản lý các bài tập cho học viên. Hỗ trợ nhiều loại bài tập khác nhau từ trắc nghiệm đến tự luận.
        </p>
        
        {/* Action Buttons */}
        <div className="absolute top-0 right-0 flex gap-3">
          <button
            onClick={fetchExercises}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Thêm bài tập mới
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Lọc:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tất cả loại</option>
            {exerciseTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tất cả độ khó</option>
            {difficultyLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">
                    {getTypeLabel(exercise.exercise_type)}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
                  {getDifficultyLabel(exercise.difficulty_level)}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {exercise.title}
              </h3>

              {exercise.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {exercise.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>Điểm tối đa: {exercise.max_score}</span>
                </div>
                {exercise.time_limit_minutes && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian: {exercise.time_limit_minutes} phút</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Trạng thái: {exercise.is_active ? 'Đang hoạt động' : 'Tạm dừng'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </button>
                <button 
                  onClick={() => handleEditExercise(exercise)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Chỉnh sửa bài tập"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  title="Xóa bài tập"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy bài tập</h3>
          <p className="text-gray-500">
            {searchQuery || filterType !== 'all' || filterDifficulty !== 'all' 
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              : 'Hãy tạo bài tập đầu tiên của bạn'
            }
          </p>
        </div>
      )}

      {/* Create Exercise Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Thêm bài tập mới</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề bài tập"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về bài tập"
                  />
                </div>

                {/* Type & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại bài tập <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.exercise_type}
                      onChange={(e) => setFormData({ ...formData, exercise_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn loại</option>
                      {exerciseTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độ khó <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Chọn độ khó</option>
                      {difficultyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Score & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.max_score}
                      onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian (phút)
                    </label>
                    <input
                      type="number"
                      value={formData.time_limit_minutes}
                      onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>
                </div>

                {/* Lesson */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bài học liên quan
                  </label>
                  <select
                    value={formData.lesson_id}
                    onChange={(e) => setFormData({ ...formData, lesson_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Không liên kết</option>
                    <option value="lesson1">Bài 1: Giới thiệu TOEIC</option>
                    <option value="lesson2">Bài 2: Listening Practice</option>
                    <option value="lesson3">Bài 3: Reading Comprehension</option>
                  </select>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Câu hỏi</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Import từ file
                    </button>
                    <button
                      onClick={() => setShowAddQuestion(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm câu hỏi
                    </button>
                  </div>
                </div>

                {questions.length > 0 && (
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Câu {index + 1}: {question.question_text}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Loại: {questionTypes.find(t => t.value === question.question_type)?.label} • 
                              Điểm: {question.points || 10}
                            </p>
                          </div>
                          <button
                            onClick={() => setQuestions(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {questions.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Chưa có câu hỏi nào</p>
                    <p className="text-sm text-gray-500">Nhấn &quot;Thêm câu hỏi&quot; để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateExercise}
                disabled={createLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </>
                ) : (
                  'Tạo bài tập'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Thêm câu hỏi</h3>
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Câu hỏi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={currentQuestion.question_text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập nội dung câu hỏi"
                />
              </div>

              {/* Question Type & Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại câu hỏi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={currentQuestion.question_type}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Chọn loại</option>
                    {questionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Options for Multiple Choice */}
              {currentQuestion.question_type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Các lựa chọn (chọn đáp án đúng):
                  </label>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${
                          currentQuestion.correct_answer === option 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-600 min-w-[20px]">
                            {String.fromCharCode(65 + index)}.
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[index] = e.target.value;
                              // Update correct answer if this was the selected option
                              const newCorrectAnswer = currentQuestion.correct_answer === option ? e.target.value : currentQuestion.correct_answer;
                              setCurrentQuestion({ 
                                ...currentQuestion, 
                                options: newOptions,
                                correct_answer: newCorrectAnswer
                              });
                            }}
                            className={`w-full px-3 py-2 border-0 bg-transparent focus:ring-0 focus:outline-none ${
                              currentQuestion.correct_answer === option ? 'font-medium' : ''
                            }`}
                            placeholder={`Nhập lựa chọn ${String.fromCharCode(65 + index)}...`}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          {currentQuestion.correct_answer === option ? (
                            <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-200 rounded-full">
                              ✓ Đúng
                            </span>
                          ) : (
                            <button
                              onClick={() => setCurrentQuestion({ ...currentQuestion, correct_answer: option })}
                              className="px-3 py-1 text-sm font-medium text-green-600 border border-green-300 rounded-full hover:bg-green-50 transition-colors"
                              disabled={!option.trim()}
                            >
                              Đúng
                            </button>
                          )}
                          
                          {currentQuestion.options.length > 2 && (
                            <button
                              onClick={() => {
                                const newOptions = currentQuestion.options.filter((_, i) => i !== index);
                                const newCorrectAnswer = currentQuestion.correct_answer === option ? '' : currentQuestion.correct_answer;
                                setCurrentQuestion({ 
                                  ...currentQuestion, 
                                  options: newOptions,
                                  correct_answer: newCorrectAnswer
                                });
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-7 h-7 flex items-center justify-center"
                              title="Xóa lựa chọn này"
                            >
                              <span className="text-lg font-bold leading-none">−</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => {
                        setCurrentQuestion({ 
                          ...currentQuestion, 
                          options: [...currentQuestion.options, '']
                        });
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-green-600 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm lựa chọn
                    </button>
                  </div>
                </div>
              )}

              {/* True/False Options */}
              {currentQuestion.question_type === 'true_false' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Đáp án đúng:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="true_false_answer"
                        value="Đúng"
                        checked={currentQuestion.correct_answer === 'Đúng'}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Đúng</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="true_false_answer"
                        value="Sai"
                        checked={currentQuestion.correct_answer === 'Sai'}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Sai</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Fill in the blank answer */}
              {currentQuestion.question_type === 'fill_blank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đáp án (cách nhau bởi dấu |):
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="đáp án 1|đáp án 2|đáp án 3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nhập các đáp án có thể, cách nhau bởi dấu |. VD: am|is|are
                  </p>
                </div>
              )}

              {/* Essay guidance */}
              {currentQuestion.question_type === 'essay' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gợi ý đáp án hoặc hướng dẫn chấm điểm:
                  </label>
                  <textarea
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Gợi ý đáp án mẫu hoặc hướng dẫn chấm điểm..."
                  />
                </div>
              )}

              {/* Default answer input for other types */}
              {!['multiple_choice', 'true_false', 'fill_blank', 'essay'].includes(currentQuestion.question_type) && currentQuestion.question_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đáp án đúng
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập đáp án đúng"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowAddQuestion(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Thêm câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exercise Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài tập</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingExercise(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài tập *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề bài tập"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bài tập *
                  </label>
                  <select
                    value={formData.exercise_type}
                    onChange={(e) => setFormData({ ...formData, exercise_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Chọn loại bài tập</option>
                    {exerciseTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ khó *
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Chọn độ khó</option>
                    {difficultyLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm tối đa *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập điểm tối đa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian làm bài (phút)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.time_limit_minutes}
                    onChange={(e) => setFormData({ ...formData, time_limit_minutes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nhập thời gian (tùy chọn)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả bài tập
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nhập mô tả chi tiết về bài tập..."
                />
              </div>

              {/* Existing Questions */}
              {questions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Câu hỏi đã thêm ({questions.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Câu {index + 1}: {question.question_text}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Loại: {getQuestionTypeLabel(question.question_type)}</span>
                              <span>Điểm: {question.points}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setQuestions(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingExercise(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateExercise}
                disabled={createLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                {createLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                Cập nhật bài tập
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Import bài tập từ file</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedFile(null);
                    setParsedContent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Tải lên file Word (.docx) hoặc PDF để tự động tạo bài tập
              </p>
            </div>

            <div className="p-6 space-y-6">
              {!uploadedFile && !parsedContent && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept=".docx,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Chọn file để tải lên
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Kéo thả file hoặc click để chọn
                    </p>
                    <div className="text-sm text-gray-500">
                      Hỗ trợ: Word (.docx), PDF • Tối đa 10MB
                    </div>
                  </label>
                </div>
              )}

              {uploadedFile && !parsedContent && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{uploadedFile.name}</h4>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleParseFile}
                      disabled={uploadLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
                    >
                      {uploadLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {uploadLoading ? 'Đang phân tích...' : 'Phân tích nội dung'}
                    </button>
                  </div>
                </div>
              )}

              {parsedContent && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Nội dung đã phân tích thành công!
                    </h3>
                    <div className="space-y-2 text-sm text-green-700">
                      <p><strong>Tiêu đề:</strong> {parsedContent.title || 'Không xác định'}</p>
                      <p><strong>Số câu hỏi:</strong> {parsedContent.questions?.length || 0}</p>
                      <p><strong>Loại bài tập:</strong> {parsedContent.type || 'Trắc nghiệm'}</p>
                    </div>
                  </div>

                  {parsedContent.questions?.length > 0 && (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Preview câu hỏi:</h4>
                      <div className="space-y-3">
                        {parsedContent.questions.slice(0, 3).map((q: ParsedQuestion, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-sm">Câu {index + 1}: {q.question}</p>
                            {q.options && (
                              <div className="mt-2 text-xs text-gray-600">
                                <p>Lựa chọn: {q.options.join(', ')}</p>
                                <p className="text-green-600">Đáp án: {q.options[q.correctAnswer]}</p>
                              </div>
                            )}
                          </div>
                        ))}
                        {parsedContent.questions.length > 3 && (
                          <p className="text-sm text-gray-500 text-center">
                            ... và {parsedContent.questions.length - 3} câu hỏi khác
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                  setParsedContent(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              {parsedContent && (
                <button
                  onClick={handleCreateFromFile}
                  disabled={createLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {createLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Tạo bài tập
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}