'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Award,
  ArrowRight,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

type LearningPath = Database['public']['Tables']['learning_paths']['Row'];
type CurriculumItem = Database['public']['Tables']['curriculum_items']['Row'];
type UserLearningPath = Database['public']['Tables']['user_learning_paths']['Row'];

interface PathWithProgress extends LearningPath {
  curriculum_count: number;
  enrolled_users: number;
  avg_completion: number;
}

interface DetailedPath extends LearningPath {
  curriculum_items: CurriculumItem[];
  user_progress?: UserLearningPath;
}

export default function LearningPathPage() {
  const [paths, setPaths] = useState<PathWithProgress[]>([]);
  const [selectedPath, setSelectedPath] = useState<DetailedPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'progress'>('overview');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadPaths = async () => {
      try {
        setLoading(true);
        
        const { data: pathsData, error: pathsError } = await supabase
          .from('learning_paths')
          .select(`
            *,
            curriculum_items!inner(id)
          `)
          .eq('is_active', true)
          .order('course_type')
          .order('difficulty_level');

        if (pathsError) throw pathsError;

        // Process data to include counts
        const pathsWithStats: PathWithProgress[] = pathsData.map(path => ({
          ...path,
          curriculum_count: path.curriculum_items?.length || 0,
          enrolled_users: Math.floor(Math.random() * 50) + 10, // Mock data
          avg_completion: Math.floor(Math.random() * 40) + 60 // Mock data
        }));

        setPaths(pathsWithStats);
      } catch (err) {
        console.error('Error fetching learning paths:', err);
        setError('Không thể tải dữ liệu lộ trình học');
      } finally {
        setLoading(false);
      }
    };

    loadPaths();
  }, [supabase]);

  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          curriculum_items!inner(id)
        `)
        .eq('is_active', true)
        .order('course_type')
        .order('difficulty_level');

      if (pathsError) throw pathsError;

      // Process data to include counts
      const pathsWithStats: PathWithProgress[] = pathsData.map(path => ({
        ...path,
        curriculum_count: path.curriculum_items?.length || 0,
        enrolled_users: Math.floor(Math.random() * 50) + 10, // Mock data
        avg_completion: Math.floor(Math.random() * 40) + 60 // Mock data
      }));

      setPaths(pathsWithStats);
    } catch (err) {
      console.error('Error fetching learning paths:', err);
      setError('Không thể tải dữ liệu lộ trình học');
    } finally {
      setLoading(false);
    }
  };

  const fetchPathDetails = async (pathId: string) => {
    try {
      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          curriculum_items(*)
        `)
        .eq('id', pathId)
        .single();

      if (pathError) throw pathError;

      setSelectedPath(pathData as DetailedPath);
    } catch (err) {
      console.error('Error fetching path details:', err);
      setError('Không thể tải chi tiết lộ trình');
    }
  };

  const filteredPaths = paths.filter(path => {
    const matchesCourse = filterCourse === 'all' || path.course_type === filterCourse;
    const matchesLevel = filterLevel === 'all' || path.level === filterLevel;
    const matchesSearch = path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCourse && matchesLevel && matchesSearch;
  });

  const getCourseColor = (courseType: string) => {
    switch (courseType) {
      case 'TOEIC': return 'bg-blue-500';
      case 'IELTS': return 'bg-green-500';
      case 'APTIS': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Beginner': return '🌱';
      case 'Elementary': return '🌿';
      case 'Intermediate': return '🌳';
      case 'Upper-Intermediate': return '🌲';
      case 'Advanced': return '🏔️';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">⚠️ Lỗi</div>
          <p className="text-red-800">{error}</p>
          <button 
            onClick={fetchLearningPaths}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lộ trình học tiếng Anh
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Khám phá các lộ trình học được thiết kế chuyên biệt cho TOEIC, IELTS và APTIS. 
          Mỗi lộ trình đều có curriculum chi tiết và hệ thống theo dõi tiến độ.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Lọc:</span>
            </div>
            
            <div className="flex flex-wrap gap-4 flex-1">
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả khóa học</option>
                <option value="TOEIC">TOEIC</option>
                <option value="IELTS">IELTS</option>
                <option value="APTIS">APTIS</option>
              </select>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trình độ</option>
                <option value="Beginner">Beginner</option>
                <option value="Elementary">Elementary</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Upper-Intermediate">Upper-Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <div className="relative flex-1 min-w-64">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lộ trình..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={fetchLearningPaths}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
      </div>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              onViewDetails={fetchPathDetails}
              getCourseColor={getCourseColor}
              getLevelIcon={getLevelIcon}
            />
          ))}
      </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy lộ trình</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

      {/* Path Details Modal */}
      {selectedPath && (
        <PathDetailsModal
          path={selectedPath}
          onClose={() => setSelectedPath(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

// Path Card Component
interface PathCardProps {
  path: PathWithProgress;
  onViewDetails: (pathId: string) => void;
  getCourseColor: (courseType: string) => string;
  getLevelIcon: (level: string) => string;
}

function PathCard({ path, onViewDetails, getCourseColor, getLevelIcon }: PathCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Header */}
      <div className={`h-2 ${getCourseColor(path.course_type)}`}></div>
      
      <div className="p-6">
        {/* Course Badge & Level */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getCourseColor(path.course_type)}`}>
            {path.course_type}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{getLevelIcon(path.level)}</span>
            <span>{path.level}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {path.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {path.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Mục tiêu</span>
            </div>
            <div className="font-bold text-gray-900">
              {path.target_score}
              {path.course_type === 'IELTS' ? '/9.0' : path.course_type === 'APTIS' ? '/5' : '+'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Thời gian</span>
            </div>
            <div className="font-bold text-gray-900">{path.duration_weeks} tuần</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{path.curriculum_count} bài học</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{path.enrolled_users} học viên</span>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Độ khó</span>
            <span className="text-gray-800">{path.difficulty_level}/5</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i < (path.difficulty_level || 0) ? 'bg-orange-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(path.id)}
          className={`w-full py-3 px-4 ${getCourseColor(path.course_type)} text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-semibold`}
        >
          Xem chi tiết
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Path Details Modal Component
interface PathDetailsModalProps {
  path: DetailedPath;
  onClose: () => void;
  activeTab: 'overview' | 'details' | 'progress';
  setActiveTab: (tab: 'overview' | 'details' | 'progress') => void;
}

function PathDetailsModal({ path, onClose, activeTab, setActiveTab }: PathDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{path.name}</h2>
              <p className="text-blue-100 mt-1">{path.course_type} • {path.level}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chi tiết curriculum
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'progress'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tiến độ
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <PathOverview path={path} />
          )}
          {activeTab === 'details' && (
            <PathCurriculum curriculum={path.curriculum_items || []} />
          )}
          {activeTab === 'progress' && (
            <PathProgress path={path} />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function PathOverview({ path }: { path: DetailedPath }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
        <p className="text-gray-600">{path.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Thông tin cơ bản</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Khóa học:</span>
              <span className="font-medium">{path.course_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trình độ:</span>
              <span className="font-medium">{path.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-medium">{path.duration_weeks} tuần</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm mục tiêu:</span>
              <span className="font-medium">{path.target_score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Nội dung học tập</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Curriculum đầy đủ theo tuần</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span>Bài tập thực hành hàng ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Kiểm tra định kỳ</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span>Theo dõi tiến độ chi tiết</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Curriculum Tab Component  
function PathCurriculum({ curriculum }: { curriculum: CurriculumItem[] }) {
  const groupedByWeek = curriculum.reduce((acc, item) => {
    const week = item.week_number;
    if (!acc[week]) acc[week] = [];
    acc[week].push(item);
    return acc;
  }, {} as Record<number, CurriculumItem[]>);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'Listening': return '🎧';
      case 'Reading': return '📖';
      case 'Writing': return '✏️';
      case 'Speaking': return '🗣️';
      case 'Test': return '📝';
      case 'Exercise': return '💪';
      default: return '📚';
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedByWeek).map(([week, items]) => (
        <div key={week} className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Tuần {week}
          </h4>
          
          <div className="space-y-2">
            {items
              .sort((a, b) => a.order_index - b.order_index)
              .map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getContentTypeIcon(item.content_type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      Ngày {item.day_number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{item.estimated_minutes}p</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Progress Tab Component
function PathProgress({ path }: { path: DetailedPath }) {
  return (
    <div className="space-y-6">
      <div className="text-center p-8">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Tính năng theo dõi tiến độ</h3>
        <p className="text-gray-500">
          Tính năng này sẽ hiển thị tiến độ học tập chi tiết cho lộ trình {path.name} khi bạn đăng ký.
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Đăng ký lộ trình
        </button>
      </div>
    </div>
  );
}