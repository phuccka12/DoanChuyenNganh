'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Target,
  TrendingUp,
  Activity,
  Award,
  Clock,
  FileText,
  BarChart3,
  PieChart,
  UserCheck,

  Eye
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalExercises: number;
  activeUsersToday: number;
  newUsersToday: number;
  exercisesWithFiles: number;
}

interface Exercise {
  id: string;
  title: string;
  exercise_type: string;
  difficulty_level: string;
  created_at: string;
  source_file_url?: string;
}

interface RecentActivity {
  id: string;
  type: 'exercise_created' | 'file_uploaded';
  title: string;
  time: string;
  exerciseType?: string;
}

export default function NewDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExercises: 0,
    activeUsersToday: 0,
    newUsersToday: 0,
    exercisesWithFiles: 0
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from both APIs
        const [exercisesResponse, usersResponse] = await Promise.all([
          fetch('/api/exercises'),
          fetch('/api/users')
        ]);

        const exercisesData = await exercisesResponse.json();
        const usersData = await usersResponse.json();

        const exercisesList = exercisesData.exercises || [];
        const usersStats = usersData.success ? usersData.data.stats : {
          totalUsers: 0,
          activeUsersToday: 0,
          newUsersToday: 0
        };
        
        setExercises(exercisesList);

        // Calculate real stats
        const totalExercises = exercisesList.length;
        const exercisesWithFiles = exercisesList.filter((ex: Exercise) => ex.source_file_url).length;

        setStats({
          totalUsers: usersStats.totalUsers,
          totalExercises,
          activeUsersToday: usersStats.activeUsersToday,
          newUsersToday: usersStats.newUsersToday,
          exercisesWithFiles
        });

        // Generate recent activities from real exercises (sorted by creation date)
        const sortedExercises = [...exercisesList].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const activities: RecentActivity[] = sortedExercises
          .slice(0, 5)
          .map((exercise: Exercise) => {
            const createdAt = new Date(exercise.created_at);
            const now = new Date();
            const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
            
            let timeText = 'vừa xong';
            if (diffMinutes < 60) {
              timeText = `${diffMinutes} phút trước`;
            } else if (diffMinutes < 1440) {
              timeText = `${Math.floor(diffMinutes / 60)} giờ trước`;
            } else {
              timeText = `${Math.floor(diffMinutes / 1440)} ngày trước`;
            }

            return {
              id: exercise.id,
              type: exercise.source_file_url ? 'file_uploaded' : 'exercise_created',
              title: exercise.title,
              time: timeText,
              exerciseType: exercise.exercise_type
            };
          });

        setRecentActivities(activities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data on error
        setStats({
          totalUsers: 0,
          totalExercises: 0,
          activeUsersToday: 0,
          newUsersToday: 0,
          exercisesWithFiles: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getExerciseTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'multiple_choice': 'bg-blue-500',
      'essay': 'bg-green-500',
      'fill_in_blank': 'bg-purple-500',
      'listening': 'bg-orange-500',
      'reading': 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      'easy': 'text-green-600 bg-green-50',
      'medium': 'text-yellow-600 bg-yellow-50',
      'hard': 'text-red-600 bg-red-50'
    };
    return colors[level] || 'text-gray-600 bg-gray-50';
  };

  const exerciseTypeStats = exercises.reduce((acc, exercise) => {
    acc[exercise.exercise_type] = (acc[exercise.exercise_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Đang tải dữ liệu thực...</p>
          <p className="mt-2 text-gray-400 text-sm">Lấy thông tin từ hệ thống</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Quản trị
            </h1>
            <p className="text-gray-600 mt-1">Tổng quan hệ thống giáo dục trực tuyến</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Dữ liệu thực từ API
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/setup-db', { method: 'POST' });
                    if (response.ok) {
                      alert('Database setup hoàn tất! Có thể tạo bài tập ngay.');
                    }
                  } catch (error) {
                    console.error('Error setting up database:', error);
                  }
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Setup Database
              </button>
              {stats.totalExercises === 0 && (
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/exercises/seed', { method: 'POST' });
                      if (response.ok) {
                        window.location.reload(); // Reload to see new data
                      }
                    } catch (error) {
                      console.error('Error seeding data:', error);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Tạo dữ liệu mẫu
                </button>
              )}
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng người dùng</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+{stats.newUsersToday}</span>
                  <span className="text-gray-500 ml-1">người mới hôm nay</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng bài tập</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalExercises}</p>
                <div className="flex items-center mt-2 text-sm">
                  <FileText className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-purple-600">{stats.exercisesWithFiles}</span>
                  <span className="text-gray-500 ml-1">có file đính kèm</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Hoạt động hôm nay</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeUsersToday}</p>
                <div className="flex items-center mt-2 text-sm">
                  <UserCheck className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{((stats.activeUsersToday / stats.totalUsers) * 100).toFixed(0)}%</span>
                  <span className="text-gray-500 ml-1">tỷ lệ hoạt động</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tỷ lệ có file</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalExercises > 0 ? ((stats.exercisesWithFiles / stats.totalExercises) * 100).toFixed(0) : 0}%
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <Award className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-orange-600">Chất lượng nội dung</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Exercise Types Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Phân loại bài tập
              </h3>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                Dữ liệu thực
              </span>
            </div>

            {Object.keys(exerciseTypeStats).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(exerciseTypeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getExerciseTypeColor(type)}`}></div>
                      <span className="font-medium capitalize text-gray-700">
                        {type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getExerciseTypeColor(type)}`}
                          style={{ width: `${(count / stats.totalExercises) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có bài tập nào</p>
                <p className="text-gray-400 text-sm">Hãy tạo bài tập đầu tiên</p>
              </div>
            )}
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Hoạt động gần đây
              </h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Live
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'file_uploaded' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'file_uploaded' ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                        {activity.exerciseType && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {activity.exerciseType}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Chưa có hoạt động</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Bài tập gần đây
            </h3>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Xem tất cả →
            </button>
          </div>

          {exercises.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.slice(0, 6).map((exercise) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {exercise.title}
                    </h4>
                    {exercise.source_file_url && (
                      <FileText className="w-4 h-4 text-purple-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
                      {exercise.difficulty_level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(exercise.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có bài tập nào</p>
              <p className="text-gray-400 text-sm mt-1">Bài tập sẽ xuất hiện ở đây khi được tạo</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}