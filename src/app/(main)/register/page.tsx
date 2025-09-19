'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import SuccessModal from '@/app/components/SuccessModal';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      setIsSuccess(true);

    } catch (error: unknown) {
      let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      console.error("Supabase registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SuccessModal
        isOpen={isSuccess}
        onClose={() => router.push('/login')}
        title="Đăng ký thành công!"
        message="Vui lòng kiểm tra email của bạn để xác thực tài khoản trước khi đăng nhập."
        buttonText="Đi đến trang Đăng nhập"
      />

      <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white font-sans overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
            {/* Cột trái: Welcome */}
            <div className="relative z-10 text-center lg:text-left">
              <div className="absolute inset-0 -z-10 bg-[url('/geometric-pattern.svg')] bg-center opacity-5 pointer-events-none"></div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
                Welcome!
              </h1>
              <h2 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-6">
                Mỗi học viên là một chiến lược riêng – AI sẽ dẫn bạn đi đúng đường.
              </h2>
              <p className="max-w-md mx-auto lg:mx-0 text-lg text-gray-300">
                Đây là nền tảng luyện thi Ielts toàn diện, ứng dụng AI để giúp bạn chinh phục mọi mục tiêu.
              </p>
              <button className="mt-8 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-full font-semibold transition-transform transform hover:scale-105">
                Tìm hiểu thêm
              </button>
            </div>

            {/* Cột phải: Form Đăng Ký */}
            <div className="relative z-10 w-full max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl shadow-pink-500/10 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold">Tạo Tài Khoản</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-sm text-center">{error}</div>}
                  
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-400">Họ và Tên</label>
                    <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50" required disabled={isLoading} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50" required disabled={isLoading} />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">Mật khẩu</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50" required disabled={isLoading} />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Nhập Lại Mật Khẩu</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50" required disabled={isLoading} />
                  </div>
                  
                  <button type="submit" className="w-full h-12 font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                  </button>
                </form>
                <p className="text-center text-gray-400 text-sm mt-6">
                  Đã có tài khoản? <a href="/login" className="text-pink-500 hover:underline font-semibold">Đăng nhập ngay</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}