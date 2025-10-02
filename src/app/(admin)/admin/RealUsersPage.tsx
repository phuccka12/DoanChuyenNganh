// Real Users Management Page - Uses Supabase Data Only
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_active?: boolean;
};

// Helper Functions
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return '👑';
    case 'teacher': return '👨‍🏫';
    case 'student': return '🎓';
    default: return '👤';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Quản trị viên';
    case 'teacher': return 'Giáo viên';  
    case 'student': return 'Học viên';
    default: return 'Người dùng';
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700 border-red-200';
    case 'teacher': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'student': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getUserAvatar = (user: Profile) => {
  return user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U';
};

// Add New User Modal Component
function AddUserModal({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      if (!fullName.trim() || !email.trim()) {
        setError('Vui lòng điền đầy đủ thông tin');
        return;
      }

      // Tạo người dùng mới trong profiles table
      const { error } = await supabase
        .from('profiles')
        .insert({
          full_name: fullName.trim(),
          email: email.trim(),
          role: role as 'admin' | 'teacher' | 'student',
          is_active: isActive
        });

      if (error) throw error;
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">Thêm người dùng mới</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Họ tên:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder=""
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder=""
              />
            </div>

            {/* Quyền hạn */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Quyền hạn:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="student">Người dùng</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Trạng thái:
              </label>
              <select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



// Edit User Modal Component (similar to Add User Modal)
function EditUserModal({ 
  user, 
  onClose, 
  onSave 
}: { 
  user: Profile; 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [role, setRole] = useState(user.role || 'student');
  const [isActive, setIsActive] = useState(true); // Mặc định là hoạt động
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [birthDate, setBirthDate] = useState(user.birth_date || '');
  const [course, setCourse] = useState(user.course || '');
  const [className, setClassName] = useState(user.class_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName,
          role: role as 'admin' | 'teacher' | 'student',
          phone: phone || null,
          avatar_url: avatarUrl || null,
          birth_date: birthDate || null,
          course: course || null,
          class_name: className || null
        })
        .eq('id', user.id);

      if (error) throw error;

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Gradient colors for EditUserModal (different from main getRoleColor)
  const getGradientColor = (roleValue: string) => {
    switch (roleValue) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'teacher': return 'from-blue-500 to-indigo-500';
      case 'student': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] transform transition-all border border-gray-200 overflow-hidden flex flex-col">
        {/* Header với nền trắng */}
        <div className="bg-white p-6 rounded-t-2xl border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${getGradientColor(role)} rounded-full flex items-center justify-center text-2xl text-white`}>
                {getRoleIcon(role)}
              </div>
              <div className="text-gray-900">
                <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin</h3>
                <p className="text-gray-600 text-sm">Cập nhật thông tin người dùng</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Avatar và Email */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">Email không thể thay đổi</p>
              </div>
            </div>

            {/* Họ và tên */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                👤 Họ và tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors bg-white text-black"
              />
            </div>

            {/* Vai trò */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                🏷️ Vai trò trong hệ thống
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'student', label: 'Học viên', icon: '🎓', color: 'border-green-200 bg-green-50 text-green-700' },
                  { value: 'teacher', label: 'Giáo viên', icon: '👨‍🏫', color: 'border-blue-200 bg-blue-50 text-blue-700' },
                  { value: 'admin', label: 'Quản trị', icon: '👑', color: 'border-red-200 bg-red-50 text-red-700' }
                ].map((roleOption) => (
                  <button
                    key={roleOption.value}
                    onClick={() => setRole(roleOption.value)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      role === roleOption.value 
                        ? roleOption.color + ' border-current' 
                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'
                    }`}
                  >
                    <div className="text-xl mb-1">{roleOption.icon}</div>
                    <div className="text-xs font-medium">{roleOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
                📋 Thông tin bổ sung
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📱 Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🎂 Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Khóa học */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    📚 Khóa học
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="APTIS">APTIS</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>

                {/* Lớp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🏫 Lớp
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="12A1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* URL Hình đại diện */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  🖼️ URL Hình đại diện
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {avatarUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Xem trước:</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={avatarUrl} 
                      alt="Preview" 
                      className="w-8 h-8 rounded-full object-cover border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Trạng thái hoạt động */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">⚡</div>
                  <div>
                    <p className="font-medium text-black">Trạng thái tài khoản</p>
                    <p className="text-sm text-gray-500">Cho phép người dùng đăng nhập</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ml-3 text-sm font-medium text-black">
                    {isActive ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="text-red-500">⚠️</div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons - Fixed at bottom */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-white hover:bg-gray-100 rounded-xl font-medium transition-colors border border-gray-200"
              disabled={loading}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${getGradientColor(role)} text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang lưu...
                </div>
              ) : (
                '💾 Lưu thay đổi'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RealUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const supabase = createClientComponentClient();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('email', 'like', '%example.com%') // Loại bỏ email test
        .not('email', 'like', '%test%') // Loại bỏ email chứa test
        .not('email', 'like', '%fake%') // Loại bỏ email fake
        .not('full_name', 'is', null) // Loại bỏ records không có tên
        .neq('full_name', '') // Loại bỏ tên rỗng
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleUserStatus = async (user: Profile) => {
    try {
      // Lấy trạng thái hiện tại (mặc định là true nếu chưa có)
      const currentStatus = user.is_active ?? true;
      const newStatus = !currentStatus;

      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      // Reload users để cập nhật UI
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái người dùng');
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <span className="text-sm text-gray-600">
            Quản lý và theo dõi tài khoản người dùng ({filteredUsers.length} người dùng)
          </span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm người dùng
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Khóa học / Lớp
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  {search ? (
                    <div className="text-gray-500">
                      <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Không tìm thấy người dùng với từ khóa &quot;{search}&quot;</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">Chưa có người dùng thật</p>
                      <p className="text-sm">Hãy chạy script guaranteed_setup.sql để xóa dữ liệu mẫu</p>
                      <p className="text-xs text-orange-600 mt-2">
                        Hoặc đăng ký tài khoản mới để thấy dữ liệu thật ở đây
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold overflow-hidden">
                        {user.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={user.avatar_url} 
                            alt={user.full_name || 'Avatar'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const sibling = target.nextElementSibling as HTMLElement;
                              if (sibling) sibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <span>{getUserAvatar(user)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.full_name || 'Chưa có tên'}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.birth_date && (
                          <p className="text-xs text-gray-500">
                            Sinh: {new Date(user.birth_date).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role || 'student')}`}>
                      {getRoleIcon(user.role || 'student')} {getRoleLabel(user.role || 'student')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {user.phone && (
                        <p className="text-gray-900 flex items-center gap-1">
                          📱 {user.phone}
                        </p>
                      )}
                      {!user.phone && (
                        <p className="text-gray-400 text-xs">Chưa có SĐT</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {user.course && (
                        <p className="text-gray-900 font-medium">📚 {user.course}</p>
                      )}
                      {user.class_name && (
                        <p className="text-gray-600 text-xs">🏫 Lớp {user.class_name}</p>
                      )}
                      {!user.course && !user.class_name && (
                        <p className="text-gray-400 text-xs">Chưa phân lớp</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        (user.is_active ?? true) ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${(user.is_active ?? true) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {(user.is_active ?? true) ? 'Hoạt động' : 'Không hoạt động'}
                    </button>
                  </td>
                  <td className="px-6 py-4 relative">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Banner */}
      {filteredUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Hiển thị dữ liệu thật từ Supabase</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Tất cả {filteredUsers.length} người dùng này là dữ liệu thực tế từ database của bạn.
          </p>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            loadUsers();
          }}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}