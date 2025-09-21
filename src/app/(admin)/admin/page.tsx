// src/app/(admin)/admin/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Users, BookCopy, Tag, ShoppingCart, ArrowUpRight } from 'lucide-react';
import type { Database } from '../../../lib/database.types'; // Đảm bảo bạn có file types cho Supabase

// Component Card thống kê
function StatCard({ icon, title, value, change }: { icon: React.ReactNode, title: string, value: number, change?: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
      {change && (
        <div className="flex items-center text-sm text-green-600 mt-2">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}

// Đây là một Server Component, nên chúng ta có thể dùng async/await trực tiếp
export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Lấy dữ liệu thống kê từ Supabase
  // Chúng ta sẽ lấy số lượng bản ghi từ các bảng
  const fetchCounts = async () => {
    try {
      const [
        { count: userCount },
        { count: lessonCount },
        { count: productCount },
        { count: orderCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('lessons').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
      ]);

      return {
        userCount: userCount || 0,
        lessonCount: lessonCount || 0,
        productCount: productCount || 0,
        orderCount: orderCount || 0,
        error: null
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        userCount: 0,
        lessonCount: 0,
        productCount: 0,
        orderCount: 0,
        error: "Không thể tải dữ liệu thống kê."
      }
    }
  };
  
  const { userCount, lessonCount, productCount, orderCount, error } = await fetchCounts();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tổng quan</h1>
      
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users className="w-8 h-8 text-blue-500" />} 
            title="Tổng số User" 
            value={userCount}
          />
          <StatCard 
            icon={<BookCopy className="w-8 h-8 text-green-500" />} 
            title="Tổng số Bài học" 
            value={lessonCount} 
          />
          <StatCard 
            icon={<Tag className="w-8 h-8 text-purple-500" />} 
            title="Tổng số Sản phẩm" 
            value={productCount} 
          />
          <StatCard 
            icon={<ShoppingCart className="w-8 h-8 text-red-500" />} 
            title="Tổng số Đơn hàng" 
            value={orderCount} 
          />
        </div>
      )}

      {/* Trong tương lai, có thể thêm các biểu đồ hoặc bảng dữ liệu ở đây */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl text-black font-semibold mb-4">Hoạt động gần đây</h2>
          <p className="text-gray-600">Khu vực hiển thị các hoạt động mới nhất (ví dụ: user mới đăng ký, đơn hàng mới...).</p>
        </div>
      </div>
    </div>
  );
}