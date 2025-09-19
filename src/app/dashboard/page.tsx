'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Bell, Calendar, BarChart3, Brain } from 'lucide-react';

interface Profile {
  full_name: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-600">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold mb-2">
            Xin chào, <span className="text-blue-600">{profile?.full_name || 'bạn'}</span> 👋
          </h1>
          <p className="text-gray-600">Chào mừng trở lại với bảng điều khiển học tập.</p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Step placeholder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-200"
            >
              <p className="font-semibold text-sm text-gray-500 mb-2">TIẾP TỤC HỌC</p>
              <h2 className="text-xl font-bold mb-4">Chưa có dữ liệu. Hãy thêm bài học.</h2>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4" />
              <Link href="#" className="inline-flex items-center font-bold text-blue-600 group">
                Bắt đầu ngay
                <motion.span whileHover={{ x: 5 }} className="ml-1">→</motion.span>
              </Link>
            </motion.div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <FeatureCard icon={<BookOpen className="w-6 h-6 text-blue-500" />} title="Luyện thi IELTS" href="/ielts" />
              <FeatureCard icon={<BookOpen className="w-6 h-6 text-green-500" />} title="Luyện thi TOEIC" href="/toeic" />
              <FeatureCard icon={<BarChart3 className="w-6 h-6 text-purple-500" />} title="Thống kê học tập" href="/dashboard/progress" />
              <FeatureCard icon={<Brain className="w-6 h-6 text-pink-500" />} title="Gợi ý từ AI" href="/ai-coach" />
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-8">
            {/* Progress */}
            <Card title="Tổng quan tiến độ">
              <Placeholder text="Chưa có dữ liệu tiến độ." />
              <Link
                href="/dashboard/progress"
                className="block w-full mt-4 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center text-blue-600 font-medium"
              >
                Xem chi tiết
              </Link>
            </Card>

            {/* Notifications */}
            <Card title="Thông báo" icon={<Bell className="w-5 h-5 text-blue-500" />}>
              <Placeholder text="Chưa có thông báo mới." />
            </Card>

            {/* Leaderboard */}
            <Card title="Bảng xếp hạng" icon={<Trophy className="w-5 h-5 text-yellow-500" />}>
              <Placeholder text="Chưa có dữ liệu xếp hạng." />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Components --- */
function FeatureCard({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-6 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
      >
        <div className="mb-2">{icon}</div>
        <h3 className="font-bold">{title}</h3>
      </motion.div>
    </Link>
  );
}

function Card({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        {icon && <div className="mr-2">{icon}</div>}
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return <p className="text-sm text-gray-500 italic">{text}</p>;
}
