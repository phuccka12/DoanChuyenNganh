'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

// Simple Bar Chart Component (CSS-based)
function SimpleBarChart({ data, title }: { data: ChartData[]; title: string }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-gray-600 truncate">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  minWidth: item.value > 0 ? '8px' : '0'
                }}
              />
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Growth Metrics Component
function GrowthMetrics() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const monthlyData = [
    { month: 'Jan', users: 120, lessons: 45, orders: 23 },
    { month: 'Feb', users: 150, lessons: 52, orders: 31 },
    { month: 'Mar', users: 180, lessons: 48, orders: 28 },
    { month: 'Apr', users: 220, lessons: 61, orders: 35 },
    { month: 'May', users: 280, lessons: 58, orders: 42 },
    { month: 'Jun', users: 320, lessons: 67, orders: 48 }
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const growthMetrics = [
    {
      title: 'Người dùng mới',
      current: currentMonth.users,
      growth: calculateGrowth(currentMonth.users, previousMonth.users),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Bài học mới',
      current: currentMonth.lessons,
      growth: calculateGrowth(currentMonth.lessons, previousMonth.lessons),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      title: 'Đơn hàng',
      current: currentMonth.orders,
      growth: calculateGrowth(currentMonth.orders, previousMonth.orders),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          Tăng trưởng tháng này
        </h3>
        <span className="text-sm text-gray-500">So với tháng trước</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {growthMetrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-600">{metric.title}</div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {metric.current}
              </div>
              <div className={`flex items-center text-sm font-medium ${
                parseFloat(metric.growth) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  parseFloat(metric.growth) < 0 ? 'rotate-180' : ''
                }`} />
                {Math.abs(parseFloat(metric.growth))}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Line Chart */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Xu hướng 6 tháng gần đây</h4>
        <div className="flex items-end justify-between h-24 bg-gradient-to-t from-blue-50 to-transparent rounded-lg p-3">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-8 transition-all duration-1000 ease-out ${
                  isVisible ? '' : 'h-0'
                }`}
                style={{
                  height: isVisible ? `${(data.users / 320) * 60}px` : '0px',
                  transitionDelay: `${index * 100}ms`
                }}
              />
              <span className="text-xs text-gray-600 mt-1">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// User Activity Heatmap (Simplified)
function ActivityHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate random activity data
  const getActivityLevel = (day: number, hour: number) => {
    const baseActivity = Math.sin((hour - 12) / 24 * Math.PI * 2) * 0.5 + 0.5;
    const weekendMultiplier = day >= 5 ? 0.7 : 1;
    const randomFactor = Math.random() * 0.3;
    return Math.max(0, Math.min(1, baseActivity * weekendMultiplier + randomFactor));
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-gray-100';
    if (intensity < 0.4) return 'bg-blue-200';
    if (intensity < 0.6) return 'bg-blue-400';
    if (intensity < 0.8) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-green-500" />
        Hoạt động người dùng theo giờ
      </h3>
      
      <div className="overflow-x-auto">
        <div className="grid grid-rows-7 gap-1 min-w-max">
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-1">
              <div className="w-8 text-xs font-medium text-gray-600">
                {day}
              </div>
              <div className="flex gap-1">
                {hours.map((hour) => {
                  const intensity = getActivityLevel(dayIndex, hour);
                  return (
                    <div
                      key={hour}
                      className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)} hover:scale-110 transition-transform cursor-pointer`}
                      title={`${day} ${hour}:00 - Activity: ${Math.round(intensity * 100)}%`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>0:00</span>
          <span>12:00</span>
          <span>23:00</span>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-gray-600">Ít</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm" />
            <div className="w-3 h-3 bg-blue-200 rounded-sm" />
            <div className="w-3 h-3 bg-blue-400 rounded-sm" />
            <div className="w-3 h-3 bg-blue-600 rounded-sm" />
            <div className="w-3 h-3 bg-blue-800 rounded-sm" />
          </div>
          <span className="text-xs text-gray-600">Nhiều</span>
        </div>
      </div>
    </div>
  );
}

// Main Analytics Component
export default function AnalyticsCharts() {
  const userRegistrationData: ChartData[] = [
    { label: 'Tháng 1', value: 45, color: 'bg-blue-500' },
    { label: 'Tháng 2', value: 62, color: 'bg-blue-500' },
    { label: 'Tháng 3', value: 38, color: 'bg-blue-500' },
    { label: 'Tháng 4', value: 71, color: 'bg-blue-500' },
    { label: 'Tháng 5', value: 89, color: 'bg-blue-500' },
    { label: 'Tháng 6', value: 94, color: 'bg-blue-500' }
  ];

  const courseCompletionData: ChartData[] = [
    { label: 'React Cơ bản', value: 92, color: 'bg-green-500' },
    { label: 'JavaScript ES6', value: 78, color: 'bg-green-500' },
    { label: 'Node.js API', value: 65, color: 'bg-yellow-500' },
    { label: 'Database Design', value: 43, color: 'bg-red-500' },
    { label: 'UI/UX Design', value: 87, color: 'bg-green-500' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <SimpleBarChart 
        data={userRegistrationData} 
        title="Đăng ký người dùng mới" 
      />
      <SimpleBarChart 
        data={courseCompletionData} 
        title="Tỷ lệ hoàn thành khóa học" 
      />
      <GrowthMetrics />
      <ActivityHeatmap />
    </div>
  );
}