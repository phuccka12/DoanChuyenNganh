'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Users, 
  BookCopy, 
  GraduationCap,
  UserCheck,
  Target,
  BarChart3,
  Shield,
  UserCog,
  BookOpen
} from 'lucide-react';

interface RoleStats {
  admin: number;
  teacher: number;
  student: number;
  total: number;
}

interface DashboardStats {
  roleStats: RoleStats;
  lessons: number;
  learningPaths: number;
  activeStudents: number;
}

// Role-based Stat Card
function RoleStatCard({ 
  icon, 
  title, 
  value, 
  roleType,
  percentage 
}: { 
  icon: React.ReactNode;
  title: string;
  value: number;
  roleType: 'admin' | 'teacher' | 'student' | 'total';
  percentage?: number;
}) {
  const colorClasses = {
    admin: 'from-red-500 to-red-600 shadow-red-200',
    teacher: 'from-blue-500 to-blue-600 shadow-blue-200',
    student: 'from-green-500 to-green-600 shadow-green-200',
    total: 'from-purple-500 to-purple-600 shadow-purple-200'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[roleType]} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {icon}
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
          </div>
          <p className="text-3xl font-bold">{value}</p>
          {percentage !== undefined && (
            <p className="text-sm opacity-90">
              {percentage.toFixed(1)}% tổng số
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Role Management Section
function RoleManagement({ roleStats }: { roleStats: RoleStats }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">Quản lý phân quyền</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <UserCog className="h-8 w-8 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Quản trị viên</h3>
              <p className="text-sm text-red-600">Quản lý toàn bộ hệ thống</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-red-600">{roleStats.admin}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Giáo viên</h3>
              <p className="text-sm text-blue-600">Tạo và quản lý bài học</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600">{roleStats.teacher}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Học viên</h3>
              <p className="text-sm text-green-600">Học tập và theo dõi tiến độ</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-green-600">{roleStats.student}</span>
        </div>
      </div>
    </div>
  );
}

export default function RoleBasedDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    roleStats: { admin: 0, teacher: 0, student: 0, total: 0 },
    lessons: 0,
    learningPaths: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchStats = useCallback(async () => {
    try {
      // Lấy thống kê từ view đơn giản
      const { data: dashboardData, error: dashboardError } = await supabase
        .from('simple_dashboard_stats')
        .select('*')
        .single();

      if (dashboardError) {
        console.error('Error fetching dashboard stats:', dashboardError);
        // Fallback: lấy trực tiếp từ profiles với xử lý dữ liệu thật
        const { data: roleData } = await supabase
          .from('profiles')
          .select('role')
          .not('email', 'like', '%example.com%'); // Chỉ lấy dữ liệu thật

        const roleStats: RoleStats = {
          admin: roleData?.filter(u => u.role === 'admin').length || 0,
          teacher: roleData?.filter(u => u.role === 'teacher').length || 0,
          student: roleData?.filter(u => u.role === 'student').length || 0,
          total: roleData?.length || 0
        };

        setStats({
          roleStats,
          lessons: 0,
          learningPaths: 0,
          activeStudents: roleStats.student
        });
        return;
      }

      // Sử dụng data từ view
      const roleStats: RoleStats = {
        admin: dashboardData.admin_count || 0,
        teacher: dashboardData.teacher_count || 0,
        student: dashboardData.student_count || 0,
        total: dashboardData.total_users || 0
      };

      // Lấy thống kê lessons và learning paths (dữ liệu thật từ Supabase)
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      const { count: pathsCount } = await supabase
        .from('learning_paths')
        .select('*', { count: 'exact', head: true });

      // Lấy số categories thật
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      setStats({
        roleStats,
        lessons: lessonsCount || 0,
        learningPaths: pathsCount || 0,
        activeStudents: roleStats.student
      });

      console.log('📊 Dashboard Stats (Dữ liệu thật từ Supabase):', {
        users: roleStats,
        lessons: lessonsCount || 0,
        paths: pathsCount || 0,
        categories: categoriesCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard Quản lý Phân quyền
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Hệ thống quản lý: Quản trị viên • Giáo viên • Học viên
          </p>
          
          {/* Data Status Banner */}
          {stats.roleStats.total === 0 ? (
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-4 mx-auto max-w-2xl">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="font-semibold">Chưa có dữ liệu người dùng</span>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Hãy chạy script guaranteed_setup.sql để xóa dữ liệu mẫu và bắt đầu với dữ liệu thật!
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4 mx-auto max-w-2xl">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Dữ liệu thật từ Supabase</span>
              </div>
              <p className="text-sm opacity-90 mt-1">
                Hiển thị {stats.roleStats.total} người dùng thật từ database
              </p>
            </div>
          )}
        </div>

        {/* Role Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoleStatCard
            icon={<UserCog className="h-6 w-6" />}
            title="Quản trị viên"
            value={stats.roleStats.admin}
            roleType="admin"
            percentage={(stats.roleStats.admin / stats.roleStats.total) * 100}
          />
          <RoleStatCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Giáo viên"
            value={stats.roleStats.teacher}
            roleType="teacher"
            percentage={(stats.roleStats.teacher / stats.roleStats.total) * 100}
          />
          <RoleStatCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Học viên"
            value={stats.roleStats.student}
            roleType="student"
            percentage={(stats.roleStats.student / stats.roleStats.total) * 100}
          />
          <RoleStatCard
            icon={<Users className="h-6 w-6" />}
            title="Tổng người dùng"
            value={stats.roleStats.total}
            roleType="total"
          />
        </div>

        {/* Content Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-3">
              <BookCopy className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">Bài học</h3>
                <p className="text-3xl font-bold">{stats.lessons}</p>
                <p className="text-sm opacity-90">
                  {stats.lessons === 0 ? 'Chưa có dữ liệu' : 'Đã có trong database'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">Lộ trình học</h3>
                <p className="text-3xl font-bold">{stats.learningPaths}</p>
                <p className="text-sm opacity-90">
                  {stats.learningPaths === 0 ? 'Chưa có dữ liệu' : 'Khóa học có cấu trúc'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-8 w-8" />
              <div>
                <h3 className="text-lg font-semibold">Học viên đã đăng ký</h3>
                <p className="text-3xl font-bold">{stats.activeStudents}</p>
                <p className="text-sm opacity-90">
                  {stats.activeStudents === 0 ? 'Chưa có học viên' : 'Đang tham gia học tập'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RoleManagement roleStats={stats.roleStats} />
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Phân bố người dùng</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Học viên</span>
                <span className="font-semibold text-green-600">
                  {((stats.roleStats.student / stats.roleStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.roleStats.student / stats.roleStats.total) * 100 || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Giáo viên</span>
                <span className="font-semibold text-blue-600">
                  {((stats.roleStats.teacher / stats.roleStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.roleStats.teacher / stats.roleStats.total) * 100 || 0}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quản trị viên</span>
                <span className="font-semibold text-red-600">
                  {((stats.roleStats.admin / stats.roleStats.total) * 100 || 0).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.roleStats.admin / stats.roleStats.total) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <UserCog className="h-6 w-6 text-red-600 mb-2" />
              <div className="text-left">
                <h3 className="font-medium text-gray-800">Quản lý Admin</h3>
                <p className="text-sm text-gray-600">Thêm/sửa quản trị viên</p>
              </div>
            </button>
            
            <button className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              <GraduationCap className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-left">
                <h3 className="font-medium text-gray-800">Quản lý Giáo viên</h3>
                <p className="text-sm text-gray-600">Phê duyệt giáo viên mới</p>
              </div>
            </button>
            
            <button className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
              <BookOpen className="h-6 w-6 text-green-600 mb-2" />
              <div className="text-left">
                <h3 className="font-medium text-gray-800">Quản lý Học viên</h3>
                <p className="text-sm text-gray-600">Xem tiến độ học tập</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}