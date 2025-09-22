// src/components/dashboard/DashboardClientUI.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Trophy, Bell, BarChart3, PlayCircle,
  CheckCircle2, Circle
} from 'lucide-react';

type Profile = { full_name: string | null; target_score?: number | null };
type PathItem = {
  id: string;
  status: string;
  item_order: number;
  lesson_id: string;
  lessons: { id: string; title: string | null } | null;
};

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-green-500" />;
  if (status === 'in_progress') return <PlayCircle className="w-6 h-6 text-blue-500 animate-pulse" />;
  return <Circle className="w-6 h-6 text-gray-300" />;
}

export default function DashboardClientUI({
  profile,
  pathItems,
}: {
  profile: Profile | null;
  pathItems: PathItem[];
}) {
  const nextLesson = pathItems.find(
    (item) => item.status === 'not_started' || item.status === 'in_progress'
  );
  const completedCount = pathItems.filter((i) => i.status === 'completed').length;
  const totalCount = pathItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row justify-between items-center"
        >
          <div>
  <h1 className="text-4xl md:text-5xl font-semibold mb-3 drop-shadow">
  Xin chào, {profile?.full_name ? profile.full_name : 'bạn'} 👋
</h1>

            <p className="text-white/90 text-lg">
              🎯 Mục tiêu của bạn: <b>{profile?.target_score || '---'} điểm</b>
            </p>
          </div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mt-8 md:mt-0"
          >
            <div className="relative w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold">{progressPercent}%</span>
              <svg className="absolute inset-0" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side */}
          <div className="lg:col-span-2 space-y-8">

            {/* Continue learning */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100 transition"
            >
              <p className="text-sm text-gray-500 mb-3 font-semibold tracking-wide uppercase">
                Tiếp tục học
              </p>
              {nextLesson ? (
                <>
                  <h2 className="text-2xl font-bold mb-5 text-gray-800">
                    Bài {nextLesson.item_order}: {nextLesson.lessons?.title}
                  </h2>
                  <Link
                    href={`/dashboard/lessons/${nextLesson.lesson_id}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all"
                  >
                    Bắt đầu ngay →
                  </Link>
                </>
              ) : (
                <p className="text-gray-600 text-lg">🎉 Chúc mừng! Bạn đã hoàn thành lộ trình học.</p>
              )}
            </motion.div>

            {/* Learning path timeline */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-500" /> Lộ trình học
              </h3>
              {pathItems.length > 0 ? (
                <ol className="relative border-l border-gray-300 space-y-6 pl-2">
                  {pathItems.map((item) => (
                    <li key={item.id} className="ml-6 group">
                      <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-white rounded-full border shadow-sm">
                        <StatusIcon status={item.status} />
                      </span>
                      <Link
                        href={`/dashboard/lessons/${item.lesson_id}`}
                        className="block p-4 rounded-lg transition group-hover:bg-indigo-50"
                      >
                        <p className="font-medium text-gray-800 group-hover:text-indigo-600">
                          Bài {item.item_order}: {item.lessons?.title}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{item.status.replace('_', ' ')}</p>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-400 italic">Chưa có lộ trình học được gán.</p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Tiến độ
              </h3>
              {totalCount > 0 ? (
                <p className="text-gray-700">
                  Bạn đã hoàn thành <b>{completedCount}</b> / {totalCount} bài học 🎯
                </p>
              ) : (
                <p className="text-gray-400 italic">Chưa có dữ liệu tiến độ.</p>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Bell className="w-5 h-5 text-blue-500" /> Thông báo
              </h3>
              <p className="text-gray-400 italic">Chưa có thông báo mới.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Trophy className="w-5 h-5 text-yellow-500" /> Bảng xếp hạng
              </h3>
              <p className="text-gray-400 italic">Chưa có dữ liệu xếp hạng.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
