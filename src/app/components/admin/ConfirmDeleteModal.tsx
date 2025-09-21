import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

type ConfirmDeleteModalProps = {
  user: Profile; // 👈 nhận nguyên object user
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function ConfirmDeleteModal({ user, onConfirm, onClose }: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Xác nhận xóa người dùng
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa người dùng{' '}
          <span className="font-medium text-pink-600">{user.full_name || user.email}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
