// src/app/layout.tsx
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { UserProvider } from "../app/context/UserContext"; // Đảm bảo import đúng

const onest = Onest({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: "HIDAYBETA",
  description: "Nền tảng luyện thi IELTS ứng dụng AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={onest.variable}>
      <body className="bg-amber-50-900">
        {/* Bọc toàn bộ ứng dụng bằng UserProvider ở đây */}
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}