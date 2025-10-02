// src/app/(admin)/layout.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PenTool,
  Settings,
  LogOut,
  ChevronLeft,
  GraduationCap,
  GitBranch
} from "lucide-react";



export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();



  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Modern Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 bg-gradient-to-b from-purple-600 via-purple-700 to-purple-800 text-white flex flex-col h-screen relative`}>
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">EduPath</h1>
                  <p className="text-sm text-purple-200">Admin Panel</p>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${isCollapsed ? 'absolute -right-3 top-6 bg-purple-600 shadow-lg' : ''}`}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1">
          {/* Dashboard - Special highlighted item */}
          <Link href="/admin">
            <div className="flex items-center gap-4 px-4 py-3 mb-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg cursor-pointer">
              <div className="flex items-center justify-center text-white">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              {!isCollapsed && (
                <span className="font-medium text-white text-lg">
                  Dashboard
                </span>
              )}
            </div>
          </Link>

          {/* Other menu items */}
          <div className="space-y-2">
            <Link href="/admin/users">
              <div className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                hover:bg-white/10
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}>
                <div className="flex items-center justify-center text-purple-200 group-hover:text-white">
                  <Users className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium transition-colors text-purple-100 group-hover:text-white">
                    Quản lý Người dùng
                  </span>
                )}
              </div>
            </Link>

            <Link href="/admin/learning-paths">
              <div className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                hover:bg-white/10
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}>
                <div className="flex items-center justify-center text-purple-200 group-hover:text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium transition-colors text-purple-100 group-hover:text-white">
                    Quản lý Bài học
                  </span>
                )}
              </div>
            </Link>

            <Link href="/admin/exercises">
              <div className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                hover:bg-white/10
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}>
                <div className="flex items-center justify-center text-purple-200 group-hover:text-white">
                  <PenTool className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium transition-colors text-purple-100 group-hover:text-white">
                    Quản lý Bài tập
                  </span>
                )}
              </div>
            </Link>

            <Link href="/admin/learning-paths">
              <div className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                hover:bg-white/10
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}>
                <div className="flex items-center justify-center text-purple-200 group-hover:text-white">
                  <GitBranch className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium transition-colors text-purple-100 group-hover:text-white">
                    Lộ trình học
                  </span>
                )}
              </div>
            </Link>

            {/* Thống kê */}
            <div className={`
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
              hover:bg-white/10
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}>
              <div className="flex items-center justify-center text-purple-200 group-hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              {!isCollapsed && (
                <span className="font-medium transition-colors text-purple-100 group-hover:text-white">
                  Thống kê
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className="px-4 mb-4">
          <Link href="/admin/settings">
            <div className={`
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
              hover:bg-white/10
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}>
              <Settings className="w-5 h-5 text-purple-200 group-hover:text-white" />
              {!isCollapsed && (
                <span className="font-medium text-purple-100 group-hover:text-white">
                  Cài đặt
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-purple-500/30 mt-auto">
          <div className={`
            flex items-center gap-3 p-3 rounded-xl bg-white/10 
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            {!isCollapsed ? (
              <>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    Admin
                  </p>
                  <p className="text-xs text-purple-200 truncate">
                    admin@example.com
                  </p>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xs">
                  A
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white/50">
          {children}
        </div>
      </div>
    </div>
  );
}