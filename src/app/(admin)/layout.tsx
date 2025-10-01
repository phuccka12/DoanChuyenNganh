// src/app/(admin)/layout.tsx
import AdminLayout from "../components/admin/AdminLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout />;
}