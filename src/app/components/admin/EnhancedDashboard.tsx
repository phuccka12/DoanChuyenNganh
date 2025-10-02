// Enhanced Admin Dashboard Page
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  Users, 
  BookCopy, 
  ShoppingBag, 
  ShoppingCart, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Target,
  Award,
  BarChart3,
  Calendar,
  Eye
} from 'lucide-react';
import type { Database } from '../../../lib/database.types';

// Enhanced Stat Card Component
function StatCard({ 
  icon, 
  title, 
  value, 
  change, 
  trend, 
  color = "blue" 
}: { 
  icon: React.ReactNode;
  title: string;
  value: number | string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-200',
    green: 'from-green-500 to-green-600 shadow-green-200',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200',
    red: 'from-red-500 to-red-600 shadow-red-200',
    orange: 'from-orange-500 to-orange-600 shadow-orange-200'
  };

  const trendColors = {
    up: 'text-green-600 bg-green-100',
    down: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change && trend && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${trendColors[trend]}`}>
            {trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
            {trend === 'down' && <ArrowUpRight className="w-4 h-4 mr-1 rotate-180" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      title: 'Thêm người dùng',
      description: 'Tạo tài khoản mới cho người dùng',
      icon: <Users className="w-6 h-6" />,
      href: '/admin/users',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Tạo bài học',
      description: 'Thêm nội dung học tập mới',
      icon: <BookCopy className="w-6 h-6" />,
      href: '/admin/lessons',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Quản lý sản phẩm',
      description: 'Cập nhật catalog sản phẩm',
      icon: <ShoppingBag className="w-6 h-6" />,
      href: '/admin/products',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Xem báo cáo',
      description: 'Phân tích dữ liệu chi tiết',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/admin/analytics',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => (
        <a
          key={index}
          href={action.href}
          className="block p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className={`inline-flex p-3 rounded-lg text-white ${action.color} mb-4`}>
            {action.icon}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
          <p className="text-sm text-gray-600">{action.description}</p>
        </a>
      ))}
    </div>
  );
}

// Recent Activities Component
function RecentActivities({ activities }: { activities: any[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          Hoạt động gần đây
        </h2>
        <a href="/admin/activities" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Xem tất cả
        </a>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title || 'Hoạt động mới'}</p>
                <p className="text-xs text-gray-500">{activity.time || 'Vừa xong'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có hoạt động nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Performance Metrics Component
function PerformanceMetrics() {
  const metrics = [
    { label: 'Tỷ lệ hoàn thành khóa học', value: '85%', color: 'text-green-600' },
    { label: 'Thời gian trung bình/bài', value: '12 phút', color: 'text-blue-600' },
    { label: 'Số bài học được tạo/tháng', value: '24', color: 'text-purple-600' },
    { label: 'Tỷ lệ hài lòng người dùng', value: '4.8/5', color: 'text-orange-600' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-green-500" />
        Chỉ số hiệu suất
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <Award className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-2xl font-bold ${metric.color} mt-1`}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default async function EnhancedAdminDashboard() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [
        { count: userCount },
        { count: lessonCount },
        { count: productCount },
        { count: orderCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true })
      ]);

      // Fetch recent users for activity feed
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const activities = recentUsers?.map(user => ({
        title: `${user.full_name || user.email} đã tham gia`,
        time: new Date(user.created_at).toLocaleDateString('vi-VN')
      })) || [];

      return {
        userCount: userCount || 0,
        lessonCount: lessonCount || 0,
        productCount: productCount || 0,
        orderCount: orderCount || 0,
        activities,
        error: null
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        userCount: 0,
        lessonCount: 0,
        productCount: 0,
        orderCount: 0,
        activities: [],
        error: "Không thể tải dữ liệu dashboard."
      };
    }
  };

  const { userCount, lessonCount, productCount, orderCount, activities, error } = await fetchDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Users className="w-6 h-6" />}
            title="Tổng số người dùng" 
            value={userCount.toLocaleString()}
            change="+12%"
            trend="up"
            color="blue"
          />
          <StatCard 
            icon={<BookCopy className="w-6 h-6" />}
            title="Bài học" 
            value={lessonCount.toLocaleString()} 
            change="+8%"
            trend="up"
            color="green"
          />
          <StatCard 
            icon={<ShoppingBag className="w-6 h-6" />}
            title="Sản phẩm" 
            value={productCount.toLocaleString()} 
            change="+3%"
            trend="up"
            color="purple"
          />
          <StatCard 
            icon={<ShoppingCart className="w-6 h-6" />}
            title="Đơn hàng" 
            value={orderCount.toLocaleString()} 
            change="-2%"
            trend="down"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Thao tác nhanh
          </h2>
          <QuickActions />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivities activities={activities} />
          <PerformanceMetrics />
        </div>
      </div>
    </div>
  );
}