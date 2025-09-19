'use client';

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Bảng điều khiển Admin 👑</h1>

      {/* Cards thống kê (sẽ lấy từ API sau) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng số người dùng" />
        <StatCard title="Tổng số lớp học" />
        <StatCard title="Tổng số đề thi" />
        <StatCard title="Doanh thu tháng này" />
      </div>

      {/* Các module quản trị */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuleCard 
          title="Quản lý người dùng" 
          description="Thêm, sửa, xóa và phân quyền người dùng." 
        />
        <ModuleCard 
          title="Quản lý lớp học" 
          description="Xem, tạo và chỉnh sửa thông tin lớp học." 
        />
        <ModuleCard 
          title="Quản lý đề thi" 
          description="Tạo và quản lý ngân hàng đề thi." 
        />
        <ModuleCard 
          title="Báo cáo hệ thống" 
          description="Theo dõi số liệu và thống kê chi tiết." 
        />
      </div>
    </div>
  );
}

function StatCard({ title }: { title: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-gray-600 text-sm">{title}</h2>
      {/* Giá trị sẽ lấy từ API sau */}
      <p className="text-2xl font-bold mt-2 text-gray-800">--</p>
    </div>
  );
}

function ModuleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
