// src/components/admin/EditUserModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function EditUserModal({ user, onClose }: { user: Profile; onClose: () => void; }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name || '');
  const [role, setRole] = useState(user.role || 'user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, role: role })
      .eq('id', user.id);
      
    setIsLoading(false);

    if (updateError) {
      setError("Lỗi khi cập nhật: " + updateError.message);
    } else {
      router.refresh(); // Tự động làm mới dữ liệu trên trang
      onClose(); // Đóng modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-950 mb-6">Chỉnh sửa thông tin</h2>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full border border-black-300 text-black rounded-md shadow-sm py-2 px-3"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full border border-black-300 text-black  rounded-md shadow-sm py-2 px-3">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-8 flex justify-end space-x-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-800 rounded-md">Hủy</button>
            <button onClick={handleSave} disabled={isLoading} className="px-4 py-2 bg-pink-600 text-white rounded-md disabled:opacity-50">
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </div>
      </div>
    </div>
  );
}