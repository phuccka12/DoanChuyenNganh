'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Users, 
  BookOpen, 
  UserCheck,
  Play,
  AlertCircle
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalLessons: number;
  activeUsers: number;
  activeLessons: number;
}

interface Activity {
  id: string;
  message: string;
  type: 'user' | 'lesson' | 'system' | 'activity';
  created_at: string;
}

// Stat Card Component
function StatCard({ 
  icon, 
  title, 
  value, 
  bgColor,
  iconBg 
}: { 
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
  iconBg: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: Activity }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'activity':
        return <UserCheck className="h-4 w-4 text-cyan-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600">{activity.message}</p>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalLessons: 0,
    activeUsers: 0,
    activeLessons: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Lấy tất cả users thật từ database (HOÀN TOÀN đồng bộ với RealUsersPage)
        const { data: allUsersData, error: usersError } = await supabase
          .from('profiles')
          .select('*') // Giống hệt RealUsersPage
          .not('email', 'like', '%example.com%') // Loại bỏ email test
          .not('email', 'like', '%test%') // Loại bỏ email chứa test
          .not('email', 'like', '%fake%') // Loại bỏ email fake
          .not('full_name', 'is', null) // Loại bỏ records không có tên
          .neq('full_name', '') // Loại bỏ tên rỗng
          .order('full_name'); // Giống hệt RealUsersPage

        if (usersError) {
          console.error('Error fetching users:', usersError);
        }

        // Debug: console.log('Real users from DB:', allUsersData);

        // Đếm users thật (đồng bộ với trang Quản lý người dùng)
        const totalUsers = allUsersData?.length || 0;
        
        // Sử dụng cùng dữ liệu đã được filter từ database
        const cleanUsers = allUsersData || [];

        // Kiểm tra xem có bảng lessons không, nếu không thì = 0
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('id')
          .limit(1);
        
        const totalLessons = lessonsData ? lessonsData.length : 0; // Thực tế = 0 vì chưa có bảng lessons
        
        // Debug: console.log('Stats calculated:', { totalUsers, cleanUsersCount: cleanUsers.length, totalLessons });
        
        // Tính người dùng hoạt động (đăng ký trong 30 ngày qua)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeUsers = cleanUsers?.filter(user => {
          const createdDate = new Date(user.created_at);
          return createdDate >= thirtyDaysAgo;
        }).length || 0;
        
        // Tính bài học đang hoạt động (= tổng bài học vì chưa có trạng thái active/inactive)
        const activeLessons = totalLessons;

        setStats({
          totalUsers,
          totalLessons,
          activeUsers,
          activeLessons
        });

        // Tạo dữ liệu hoạt động gần đây từ dữ liệu thật
        const recentActivities: Activity[] = [];
        
        // Thống kê theo role từ tất cả users
        const adminCount = allUsersData?.filter(u => u.role === 'admin').length || 0;
        const teacherCount = allUsersData?.filter(u => u.role === 'teacher').length || 0;
        const studentCount = allUsersData?.filter(u => u.role === 'student').length || 0;
        
        // Thêm hoạt động dựa trên dữ liệu thật
        if (totalUsers > 0) {
          recentActivities.push({
            id: '1',
            message: `Có ${adminCount} quản trị viên, ${teacherCount} giáo viên, ${studentCount} học viên`,
            type: 'user',
            created_at: new Date().toISOString()
          });
        }
        
        if (activeUsers > 0) {
          recentActivities.push({
            id: '2',
            message: `${activeUsers} người dùng đã đăng ký trong 30 ngày qua`,
            type: 'activity',
            created_at: new Date().toISOString()
          });
        }
        
        if (totalLessons > 0) {
          recentActivities.push({
            id: '3',
            message: `Có ${totalLessons} bài học khả dụng trong hệ thống`,
            type: 'lesson',
            created_at: new Date().toISOString()
          });
        } else {
          recentActivities.push({
            id: '3',
            message: `Chưa có bài học nào được tạo trong hệ thống`,
            type: 'lesson',
            created_at: new Date().toISOString()
          });
        }
        
        if (allUsersData && allUsersData.length > 0) {
          const latestUser = allUsersData.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];
          
          recentActivities.push({
            id: '4',
            message: `Người dùng mới nhất: ${latestUser.email?.split('@')[0] || 'Unknown'}`,
            type: 'user',
            created_at: latestUser.created_at
          });
        }

        setActivities(recentActivities);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Tổng quan</h1>
        <p className="text-gray-600">Thống kê realtime từ cơ sở dữ liệu Supabase</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6 text-white" />}
          title="Tổng người dùng"
          value={stats.totalUsers}
          bgColor="bg-white"
          iconBg="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        
        <StatCard
          icon={<BookOpen className="h-6 w-6 text-white" />}
          title="Tổng bài học"
          value={stats.totalLessons}
          bgColor="bg-white"
          iconBg="bg-gradient-to-r from-pink-500 to-pink-600"
        />
        
        <StatCard
          icon={<UserCheck className="h-6 w-6 text-white" />}
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          bgColor="bg-white"
          iconBg="bg-gradient-to-r from-cyan-500 to-cyan-600"
        />
        
        <StatCard
          icon={<Play className="h-6 w-6 text-white" />}
          title="Bài học đang hoạt động"
          value={stats.activeLessons}
          bgColor="bg-white"
          iconBg="bg-gradient-to-r from-green-500 to-green-600"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Hoạt động gần đây</h2>
        
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có hoạt động nào gần đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}