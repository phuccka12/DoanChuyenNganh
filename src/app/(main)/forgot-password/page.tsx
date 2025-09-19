// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient'; // Sửa đường dẫn nếu cần

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/update-password`, // Link người dùng sẽ quay lại sau khi reset
    });

    setIsLoading(false);

    if (error) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Password reset error:', error);
    } else {
      setMessage('Nếu tài khoản tồn tại, một link khôi phục mật khẩu đã được gửi đến email của bạn.');
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white font-sans">
      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl shadow-pink-500/10 p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold">Khôi phục mật khẩu</h2>
            <p className="text-gray-400 mt-2">Nhập email của bạn để nhận hướng dẫn.</p>
          </div>
          
          {message && <div className="p-3 bg-green-500/20 text-green-300 rounded-lg text-sm text-center mb-4">{message}</div>}
          {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500" 
                required 
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="w-full h-12 font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi link khôi phục'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Nhớ ra mật khẩu? <Link href="/login" className="text-pink-500 hover:underline font-semibold">Quay lại Đăng nhập</Link>
          </p>
        </div>
      </div>
    </main>
  );
}