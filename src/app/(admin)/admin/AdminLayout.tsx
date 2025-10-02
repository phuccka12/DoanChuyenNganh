'use client';

import { useState } from 'react';
import Dashboard from './Dashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import LearningPathPage from './LearningPathPage';
import UsersPage from './UsersPage';
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  Users,
  BarChart3,
  GraduationCap,
  ChevronLeft,
  Calendar
} from 'lucide-react';

type ActivePage = 'dashboard' | 'learning-paths' | 'lessons' | 'exercises' | 'analytics' | 'users' | 'settings';

export default function AdminLayout() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: activePage === 'dashboard'
    },
    {
      id: 'users' as const,
      label: 'Quản lý Người dùng',
      icon: Users,
      isActive: activePage === 'users'
    },
    {
      id: 'lessons' as const,
      label: 'Quản lý Bài học',
      icon: BookOpen,
      isActive: activePage === 'lessons'
    },
    {
      id: 'exercises' as const,
      label: 'Quản lý Bài tập',
      icon: Calendar,
      isActive: activePage === 'exercises'
    },
    {
      id: 'learning-paths' as const,
      label: 'Lộ trình học',
      icon: GraduationCap,
      isActive: activePage === 'learning-paths'
    },
    {
      id: 'analytics' as const,
      label: 'Thống kê',
      icon: BarChart3,
      isActive: activePage === 'analytics'
    },
    {
      id: 'settings' as const,
      label: 'Cài đặt',
      icon: Settings,
      isActive: activePage === 'settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Purple Sidebar */}
      <div className={`bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } sticky top-0 h-screen flex flex-col border-r`}>
        
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">EduPath</h1>
                <p className="text-sm text-purple-200">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActivePage(item.id)}
                    className={`relative flex items-center py-3 px-4 my-1 font-medium rounded-lg cursor-pointer transition-all group w-full ${
                      item.isActive 
                        ? 'bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/30' 
                        : 'hover:bg-white/10 text-purple-100 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                      <span className="overflow-hidden transition-all w-52 ml-3">
                        <span className="text-lg font-medium">{item.label}</span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          
          {/* Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-purple-500/30">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="text-xs font-medium mb-2 opacity-90">Quick Stats</div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Lộ trình:</span>
                    <span className="font-semibold">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Học viên:</span>
                    <span className="font-semibold">284</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activePage)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Hôm nay: 1/10/2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'users' && <UsersPage />}
          {activePage === 'lessons' && (
            <div className="p-6">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Quản lý Bài học</h3>
                <p className="text-gray-500">Tính năng đang phát triển...</p>
              </div>
            </div>
          )}
          {activePage === 'exercises' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Quản lý Bài tập</h3>
                <p className="text-gray-500">Tính năng đang phát triển...</p>
              </div>
            </div>
          )}
          {activePage === 'learning-paths' && <LearningPathPage />}
          {activePage === 'analytics' && <AnalyticsDashboard />}
          {activePage === 'settings' && (
            <div className="p-6">
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Cài đặt hệ thống</h3>
                <p className="text-gray-500">Tính năng đang phát triển...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}