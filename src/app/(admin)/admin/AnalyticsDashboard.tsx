'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Users,
  BookOpen,
  Activity,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { format, subDays, startOfMonth, eachDayOfInterval } from 'date-fns';
import { MetricCard, LoadingSpinner } from '../../components/ui/Analytics';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  courseDistribution: Array<{ name: string; value: number; color: string }>;
  userGrowth: Array<{ date: string; users: number; newUsers: number }>;
  activityData: Array<{ date: string; activity: number }>;
  roleDistribution: Array<{ name: string; value: number; color: string }>;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const loadData = async () => {
      await fetchAnalyticsData();
    };
    loadData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all users data
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .not('email', 'like', '%example.com%')
        .not('email', 'like', '%test%')
        .not('email', 'like', '%fake%')
        .not('full_name', 'is', null)
        .neq('full_name', '');

      if (usersError) throw usersError;

      const totalUsers = users?.length || 0;
      
      // Calculate new users this month
      const startMonth = startOfMonth(new Date());
      const newUsersThisMonth = users?.filter(user => 
        new Date(user.id) >= startMonth
      ).length || 0;

      // Course distribution
      const courseDistribution = [
        {
          name: 'TOEIC',
          value: users?.filter(u => u.course === 'TOEIC').length || 0,
          color: '#3B82F6'
        },
        {
          name: 'IELTS',
          value: users?.filter(u => u.course === 'IELTS').length || 0,
          color: '#10B981'
        },
        {
          name: 'APTIS',
          value: users?.filter(u => u.course === 'APTIS').length || 0,
          color: '#F59E0B'
        },
        {
          name: 'Chưa chọn',
          value: users?.filter(u => !u.course).length || 0,
          color: '#6B7280'
        }
      ];

      // Role distribution
      const roleDistribution = [
        {
          name: 'Học viên',
          value: users?.filter(u => u.role === 'student').length || 0,
          color: '#10B981'
        },
        {
          name: 'Giáo viên',
          value: users?.filter(u => u.role === 'teacher').length || 0,
          color: '#3B82F6'
        },
        {
          name: 'Admin',
          value: users?.filter(u => u.role === 'admin').length || 0,
          color: '#EF4444'
        }
      ];

      // Generate user growth data (last 30 days)
      const last30Days = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date()
      });

      const userGrowth = last30Days.map(date => {
        const usersUpToDate = users?.filter(user => 
          new Date(user.id).toDateString() <= date.toDateString()
        ).length || 0;
        
        const newUsersOnDate = users?.filter(user => 
          new Date(user.id).toDateString() === date.toDateString()
        ).length || 0;

        return {
          date: format(date, 'MM/dd'),
          users: usersUpToDate,
          newUsers: newUsersOnDate
        };
      });

      // Generate mock activity data
      const activityData = last30Days.map(date => ({
        date: format(date, 'MM/dd'),
        activity: Math.floor(Math.random() * 100) + 20
      }));

      setAnalyticsData({
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.7), // Mock: 70% active
        newUsersThisMonth,
        courseDistribution,
        userGrowth,
        activityData,
        roleDistribution
      });

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
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
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Thống kê và phân tích dữ liệu hệ thống</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Activity className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng người dùng"
          value={analyticsData.totalUsers}
          previousValue={Math.floor(analyticsData.totalUsers * 0.9)}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Người dùng hoạt động"
          value={analyticsData.activeUsers}
          previousValue={Math.floor(analyticsData.activeUsers * 0.92)}
          icon={<Activity className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Người dùng mới (tháng)"
          value={analyticsData.newUsersThisMonth}
          previousValue={Math.floor(analyticsData.newUsersThisMonth * 0.76)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Tổng khóa học"
          value={3}
          previousValue={3}
          icon={<BookOpen className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Tăng trưởng người dùng</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3B82F6"
                fill="url(#gradientBlue)"
                strokeWidth={2}
                name="Tổng người dùng"
              />
              <defs>
                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Phân bố khóa học</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.courseDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {analyticsData.courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [`${value} người`, name]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string) => value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Phân bố vai trò</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.roleDistribution} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} người`, 'Số lượng']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                {analyticsData.roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Hoạt động hệ thống</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Hoạt động']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

