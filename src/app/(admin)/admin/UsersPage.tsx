'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  RefreshCw
} from 'lucide-react';

type User = Database['public']['Tables']['profiles']['Row'];

interface UserWithStats extends User {
  learning_paths_count: number;
  progress_percentage: number;
  last_activity: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithStats | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'student',
    onboarding_completed: false,
    study_time_per_day: 1,
    target_exam: '',
    target_score: '',
    course: '',
    class_name: ''
  });
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching users from Supabase profiles table...');

      // Lấy dữ liệu từ profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      console.log('📊 Supabase query result:', { 
        success: !usersError, 
        error: usersError, 
        count: usersData?.length,
        data: usersData 
      });

      // Debug: Show first user data structure
      if (usersData && usersData.length > 0) {
        console.log('🔍 First user structure:', usersData[0]);
        console.log('🔍 All user names:', usersData.map(u => u.full_name));
      }

      if (usersError) {
        console.error('❌ Supabase error:', usersError);
        console.log('📝 Error details:', {
          message: usersError.message,
          details: usersError.details,
          hint: usersError.hint,
          code: usersError.code
        });
        throw usersError;
      }

      if (usersData && usersData.length > 0) {
        console.log(`✅ Successfully loaded ${usersData.length} users from Supabase!`);
        
        // Xử lý dữ liệu thật từ Supabase với thống kê mock
        const usersWithStats: UserWithStats[] = usersData.map((user, index) => ({
          ...user,
          learning_paths_count: Math.floor(Math.random() * 5) + 1,
          progress_percentage: Math.floor(Math.random() * 100),
          last_activity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
        }));

        setUsers(usersWithStats);
        return;
      }

      // Nếu không có dữ liệu trong database, sử dụng mock data
      console.log('⚠️ No users found in Supabase, using fallback mock data...');
      console.log('💡 Tip: Run the SQL script in supabase-insert-profiles.sql to add sample data!');
      
      const mockUsers: UserWithStats[] = [
        {
          id: '1',
          email: 'admin@edupath.com',
          full_name: 'Admin User (Mock)',
          role: 'admin',
          onboarding_completed: true,
          study_time_per_day: 2,
          target_exam: 'TOEIC',
          target_score: 900,
          avatar_url: null,
          birth_date: null,
          course: null,
          class_name: null,
          learning_paths_count: 3,
          progress_percentage: 85,
          last_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          email: 'teacher@edupath.com',
          full_name: 'Teacher Mock Data',
          role: 'teacher',
          onboarding_completed: true,
          study_time_per_day: 1,
          target_exam: null,
          target_score: null,
          avatar_url: null,
          birth_date: null,
          course: null,
          class_name: null,
          learning_paths_count: 5,
          progress_percentage: 92,
          last_activity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setUsers(mockUsers);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      console.error('❌ Error fetching users:', err);
      setError(`Không thể tải danh sách người dùng: ${errorMessage}`);
      
      // Fallback to mock data on error
      console.log('🔄 Falling back to mock data due to error');
      const fallbackUsers: UserWithStats[] = [
        {
          id: '1',
          email: 'fallback@edupath.com',
          full_name: 'Fallback User (Error)',
          role: 'admin',
          onboarding_completed: true,
          study_time_per_day: 2,
          target_exam: 'TOEIC',
          target_score: 900,
          avatar_url: null,
          birth_date: null,
          course: null,
          class_name: null,
          learning_paths_count: 3,
          progress_percentage: 85,
          last_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setUsers(fallbackUsers);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Functions
  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role: 'student',
      onboarding_completed: false,
      study_time_per_day: 1,
      target_exam: '',
      target_score: '',
      course: '',
      class_name: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserWithStats) => {
    setFormData({
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role || 'student',
      onboarding_completed: user.onboarding_completed || false,
      study_time_per_day: user.study_time_per_day || 1,
      target_exam: user.target_exam || '',
      target_score: user.target_score?.toString() || '',
      course: user.course || '',
      class_name: user.class_name || ''
    });
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.full_name) {
      alert('Email và tên đầy đủ là bắt buộc!');
      return;
    }

    setFormLoading(true);
    try {
      const userData = {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        onboarding_completed: formData.onboarding_completed,
        study_time_per_day: formData.study_time_per_day,
        target_exam: formData.target_exam || null,
        target_score: formData.target_score ? parseInt(formData.target_score) : null,
        course: formData.course || null,
        class_name: formData.class_name || null
      };

      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update(userData)
          .eq('id', editingUser.id);

        if (error) {
          console.error('Error updating user:', error);
          alert(`Lỗi cập nhật người dùng: ${error.message}`);
          return;
        }

        console.log('✅ User updated successfully');
        alert('Cập nhật người dùng thành công!');
      } else {
        // Add new user
        const { error } = await supabase
          .from('profiles')
          .insert(userData);

        if (error) {
          console.error('Error creating user:', error);
          alert(`Lỗi thêm người dùng: ${error.message}`);
          return;
        }

        console.log('✅ User created successfully');
        alert('Thêm người dùng thành công!');
      }

      // Refresh the users list and close modal
      await fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu!');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (user: UserWithStats) => {
    if (!confirm(`Bạn có chắc muốn xóa người dùng "${user.full_name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) {
        console.error('Error deleting user:', error);
        alert(`Lỗi xóa người dùng: ${error.message}`);
        return;
      }

      console.log('✅ User deleted successfully');
      alert('Xóa người dùng thành công!');
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra khi xóa người dùng!');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'teacher': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'teacher': return UserCheck;
      case 'student': return Users;
      default: return Users;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getActivityStatus = (lastActivity: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 7) return { text: 'Hoạt động gần đây', color: 'text-green-600' };
    if (daysSince < 30) return { text: 'Hoạt động trong tháng', color: 'text-yellow-600' };
    return { text: 'Không hoạt động', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-lg text-gray-600">Đang tải danh sách người dùng...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <UserX className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin và quyền hạn của người dùng trong hệ thống
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Lọc và tìm kiếm:</span>
          </div>
          
          <div className="flex flex-wrap gap-4 flex-1">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="teacher">Giáo viên</option>
              <option value="student">Học viên</option>
            </select>

            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-500"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Tìm thấy {filteredUsers.length} người dùng
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quản trị viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giáo viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'teacher').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Học viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'student').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lộ trình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tham gia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role || 'student');
                const activityStatus = getActivityStatus(user.last_activity);
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Chưa có tên'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role || 'student')}`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role === 'admin' ? 'Quản trị viên' : 
                         user.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${activityStatus.color} font-medium`}>
                        {activityStatus.text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(user.last_activity)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.learning_paths_count} lộ trình
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-purple-600 h-1.5 rounded-full" 
                          style={{ width: `${user.progress_percentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                          title="Chỉnh sửa người dùng"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
              <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                    required
                    disabled={!!editingUser} // Disable email editing for existing users
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đầy đủ *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  >
                    <option value="student">Học viên</option>
                    <option value="teacher">Giáo viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian học mỗi ngày (giờ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={formData.study_time_per_day}
                    onChange={(e) => setFormData({ ...formData, study_time_per_day: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỳ thi mục tiêu
                  </label>
                  <select
                    value={formData.target_exam}
                    onChange={(e) => setFormData({ ...formData, target_exam: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                  >
                    <option value="">Chọn kỳ thi</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                {formData.target_exam && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điểm mục tiêu
                    </label>
                    <input
                      type="number"
                      value={formData.target_score}
                      onChange={(e) => setFormData({ ...formData, target_score: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                      placeholder={formData.target_exam === 'TOEIC' ? '990' : formData.target_exam === 'IELTS' ? '9.0' : '120'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khóa học
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                    placeholder="Tên khóa học"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp học
                  </label>
                  <input
                    type="text"
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
                    placeholder="Mã lớp học"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onboarding_completed"
                    checked={formData.onboarding_completed}
                    onChange={(e) => setFormData({ ...formData, onboarding_completed: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="onboarding_completed" className="ml-2 block text-sm text-gray-900">
                    Đã hoàn thành hướng dẫn ban đầu
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={formLoading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Đang lưu...' : (editingUser ? 'Cập nhật' : 'Thêm mới')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}