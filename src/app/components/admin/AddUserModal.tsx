// src/components/admin/AddUserModal.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AddUserModal({ onClose, onUserAdded }: { onClose: () => void; onUserAdded: () => void; }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddUser = async () => {
    if (!email || !password || !fullName) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Dùng hàm signUp thông thường
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          // Role sẽ được trigger tự động đặt là 'user'
        },
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError("Lỗi khi tạo user: " + signUpError.message);
    } else {
      setSuccess(`Tạo tài khoản thành công cho ${email}. Người dùng cần xác thực email để đăng nhập.`);
      onUserAdded(); // Gọi hàm để làm mới bảng
      // Không tự đóng modal để admin có thể đọc thông báo thành công
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-black mb-6">Thêm User mới</h2>
        
        {/* Chỉ hiển thị form nếu chưa thành công */}
        {!success && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md text-gray-800 shadow-sm py-2 px-3"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md text-gray-800 shadow-sm py-2 px-3"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu tạm thời</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 text-gray-800 rounded-md shadow-sm py-2 px-3"/>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        {/* Hiển thị thông báo thành công */}
        {success && <p className="text-green-600 bg-green-50 p-4 rounded-md text-sm">{success}</p>}

        <div className="mt-8 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
            {success ? 'Đóng' : 'Hủy'}
          </button>
          {!success && (
             <button onClick={handleAddUser} disabled={isLoading} className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50">
                {isLoading ? 'Đang tạo...' : 'Tạo User'}
             </button>
          )}
        </div>
      </div>
    </div>
  );
}