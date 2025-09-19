// src/app/layout.tsx
'use client'; // <-- Bắt buộc phải thêm dòng này

import { usePathname } from 'next/navigation';
import { Onest } from 'next/font/google';
import "./globals.css";
import { UserProvider } from "@/app/context/UserContext";
import Navbar from "@/app/components/Navbar";
import DashboardSidebar from "@/app/components/DashboardSidebar";

const onest = Onest({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-onest',
});

// Lưu ý: Metadata không thể dùng trong Client Component,
// bạn có thể đặt nó trong các trang con (page.tsx) nếu cần.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Lấy đường dẫn URL hiện tại

  // Kiểm tra xem có phải là các trang trong khu vực dashboard hoặc admin không
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="vi" className={onest.variable}>
      <body className="bg-gray-900">
        <UserProvider>
          {isAdminRoute ? (
            // KỊCH BẢN 1: Nếu là trang admin, hiển thị giao diện admin
            <div className="min-h-screen bg-gray-900 text-white">
              {/* Bạn có thể thêm Header riêng cho Admin ở đây nếu muốn */}
              <main className="p-8">{children}</main>
            </div>
          ) : isDashboardRoute ? (
            // KỊCH BẢN 2: Nếu là trang dashboard, hiển thị Sidebar
            <div className="flex min-h-screen">
              <DashboardSidebar />
              <main className="flex-grow">{children}</main>
            </div>
          ) : (
            // KỊCH BẢN 3: Các trang còn lại, hiển thị Navbar
            <>
              <Navbar />
              <main className="pt-20">{children}</main>
            </>
          )}
        </UserProvider>
      </body>
    </html>
  );
}