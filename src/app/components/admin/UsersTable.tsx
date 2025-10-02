// src/components/admin/UsersTable.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserIcon, PencilSquareIcon, XCircleIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/lib/database.types';
import EditUserModal from './EditUserModal';
import NewAddUserModal from './NewAddUserModal';
import DeleteUserModal from './ConfirmDeleteModal';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function UsersTable({
  profiles,
  totalPages,
  currentPage,
  searchQuery,
}: {
  profiles: Profile[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchQuery);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null);

  // 🔎 Tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?q=${encodeURIComponent(search)}&page=1`);
  };

  // ❌ Xóa tìm kiếm
  const handleClearSearch = () => {
    setSearch('');
    router.push('/admin/users');
  };

  // 📄 Phân trang
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`/admin/users?q=${encodeURIComponent(searchQuery)}&page=${page}`);
  };

  // 🗑️ Xác nhận xóa user
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      const { error } = await supabase.rpc('delete_user_by_admin', {
        user_id_to_delete: deletingUser.id,
      });

      if (error) throw error;

      setDeletingUser(null);
      router.refresh();
    } catch (err: any) {
      console.error('Lỗi khi xóa user:', err);
      alert('Đã có lỗi xảy ra khi xóa người dùng: ' + err.message);
      setDeletingUser(null);
    }
  };

  return (
    <>
      {/* Modal chỉnh sửa */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* Modal thêm user mới */}
      {isAddModalOpen && (
        <NewAddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onUserAdded={() => {
            setIsAddModalOpen(false);
            router.refresh();
          }}
        />
      )}

      {/* Modal xóa user */}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Người dùng
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-semibold transition-colors text-sm"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Thêm User mới
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm font-medium"
          >
            Tìm kiếm
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
            >
              <XCircleIcon className="w-4 h-4" />
              Xóa
            </button>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                  Họ và Tên
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {profile.full_name || 'Chưa có tên'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {profile.email || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`capitalize px-3 py-1 text-xs font-medium rounded-full ${
                          profile.role === 'admin'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {profile.role}
                      </span>
                    </td>
                 <td className="px-6 py-4 text-right">
  <div className="flex justify-end gap-2">
    {/* Nút chỉnh sửa */}
    <button
      onClick={() => setEditingUser(profile)}
      aria-label="Chỉnh sửa người dùng"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-pink-600 
                 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition"
    >
      <PencilSquareIcon className="w-4 h-4" />
      <span>Chỉnh sửa</span>
    </button>

    {/* Nút xóa */}
    <button
      onClick={() => setDeletingUser(profile)}
      aria-label="Xóa người dùng"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 
                 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
    >
      <TrashIcon className="w-4 h-4" />
      <span>Xóa</span>
    </button>
  </div>
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    Không tìm thấy người dùng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
            >
              ← Trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
