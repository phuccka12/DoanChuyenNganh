'use client';

import { useState } from 'react';
import { 
  UserIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

interface SimpleUsersTableProps {
  profiles: Profile[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}

export default function SimpleUsersTable({ 
  profiles, 
  totalPages, 
  currentPage, 
  searchQuery 
}: SimpleUsersTableProps) {
  const [search, setSearch] = useState(searchQuery);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reload page with search query
    const url = new URL(window.location.href);
    url.searchParams.set('q', search);
    url.searchParams.set('page', '1');
    window.location.href = url.toString();
  };

  const clearSearch = () => {
    setSearch('');
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    url.searchParams.set('page', '1');
    window.location.href = url.toString();
  };

  // Pagination
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    }
    window.location.href = url.toString();
  };

  // User selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === profiles.length 
        ? [] 
        : profiles.map(p => p.id)
    );
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    
    try {
      // Simulate delete - you can implement actual delete here
      alert('Chức năng xóa sẽ được implement sau');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-8 h-8 text-blue-600" />
              Quản lý người dùng
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi tài khoản người dùng ({profiles.length} người dùng)
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <UserPlusIcon className="w-4 h-4" />
              Thêm người dùng
            </button>
            
            {selectedUsers.length > 0 && (
              <button
                onClick={() => alert('Bulk delete sẽ được implement sau')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Xóa ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === profiles.length && profiles.length > 0}
                  onChange={toggleAllUsers}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr 
                key={profile.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  selectedUsers.includes(profile.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(profile.id)}
                    onChange={() => toggleUserSelection(profile.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {profile.full_name || 'Chưa có tên'}
                      </div>
                      <div className="text-sm text-gray-500">{profile.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(profile.role)}`}>
                    {profile.role === 'admin' ? 'Quản trị viên' : 
                     profile.role === 'moderator' ? 'Điều hành viên' : 'Người dùng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => alert('Chức năng chỉnh sửa sẽ được thêm sau')}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                      title="Chỉnh sửa người dùng"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(profile.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                      title="Xóa người dùng"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {profiles.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Thử điều chỉnh từ khóa tìm kiếm' : 'Bắt đầu bằng cách thêm người dùng đầu tiên'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <UserPlusIcon className="w-4 h-4" />
              Thêm người dùng đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>Trang {currentPage} trên {totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return pageNum <= totalPages ? (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-2 rounded-lg border ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ) : null;
            })}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}