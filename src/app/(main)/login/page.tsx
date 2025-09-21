'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

const GoogleIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // BƯỚC 1: XÁC THỰC VỚI SUPABASE AUTH
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Không tìm thấy thông tin người dùng sau khi đăng nhập.");

      // BƯỚC 2: NẾU XÁC THỰC THÀNH CÔNG, HỎI BẢNG `profiles` ĐỂ LẤY VAI TRÒ
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      // BƯỚC 3: DỰA VÀO VAI TRÒ ĐỂ CHUYỂN HƯỚNG
      if (profileData?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      setError("Email hoặc mật khẩu không đúng, hoặc có lỗi xảy ra.");
      console.error("Login process error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Logic đăng nhập Google (giữ nguyên)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };
  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white font-sans overflow-hidden">
      {/* Toàn bộ phần JSX của bạn giữ nguyên vì nó đã rất đẹp */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
          <div className="relative z-10 text-center lg:text-left">
            <div className="absolute inset-0 -z-10 bg-[url('/geometric-pattern.svg')] bg-center opacity-5 pointer-events-none"></div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
              Welcome Back!
            </h1>
            <h2 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-6">
              Mỗi học viên là một chiến lược riêng – AI sẽ dẫn bạn đi đúng đường.
            </h2>
            <p className="max-w-md mx-auto lg:mx-0 text-lg text-gray-300">
              Đây là nền tảng luyện thi Ielts toàn diện, ứng dụng AI để giúp bạn chinh phục mọi mục tiêu.
            </p>
          </div>
          <div className="relative z-10 w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl shadow-pink-500/10 p-8">
              <h2 className="text-4xl font-bold text-center mb-8">Đăng Nhập</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-sm text-center">{error}</div>}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50" required disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400">Mật Khẩu</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50" required disabled={isLoading} />
                </div>
                <button type="submit" className="w-full h-12 font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
              </form>
              <div className="flex justify-between items-center text-sm mt-6">
                <Link href="/forgot-password" className="font-medium text-gray-400 hover:text-pink-500 transition-colors">
                  Quên mật khẩu?
                </Link>
                <Link href="/register" className="font-semibold text-white hover:text-pink-500 transition-colors">
                  Tạo tài khoản mới
                </Link>
              </div>
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-600"/>
                <span className="mx-4 text-gray-400 text-sm">Hoặc</span>
                <hr className="flex-grow border-gray-600"/>
              </div>
              <button type="button" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center h-12 font-semibold text-gray-800 bg-white rounded-lg hover:bg-gray-200 transition-colors">
                <GoogleIcon />
                Đăng nhập với Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}