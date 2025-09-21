// src/app/(admin)/layout.tsx
import AdminSidebar from "../components/AdminSidebar"; // <-- Sử dụng component mới

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Nền chính của khu vực admin có thể là màu xám nhạt để tương phản
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}