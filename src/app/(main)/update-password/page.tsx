// app/update-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Sửa đường dẫn nếu cần

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Kiểm tra xem có session "PASSWORD_RECOVERY" không
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Cho phép người dùng cập nhật mật khẩu
      } else {
        // Nếu không, có thể họ vào trang này trực tiếp, chuyển họ đi
        // router.push('/'); 
      }
    });
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }
    setError('');
    setMessage('');
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });

    setIsLoading(false);
    if (error) {
      setError('Không thể cập nhật mật khẩu. Link có thể đã hết hạn.');
      console.error('Password update error:', error);
    } else {
      setMessage('Cập nhật mật khẩu thành công! Bạn sẽ được chuyển đến trang Đăng nhập.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white font-sans">
      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl shadow-pink-500/10 p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold">Tạo mật khẩu mới</h2>
          </div>
          
          {message && <div className="p-3 bg-green-500/20 text-green-300 rounded-lg text-sm text-center mb-4">{message}</div>}
          {error && <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">Mật khẩu mới</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-1 block w-full bg-black/20 border-none rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500" 
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Nhập lại mật khẩu mới</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
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
              {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}