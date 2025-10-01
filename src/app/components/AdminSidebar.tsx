// src/components/AdminSidebar.tsx
'use client';

import { useState, useRef, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext"; // chỉnh đường dẫn nếu khác
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// Icon
import {
  LayoutDashboard,
  Users,
  Layers3,
  FileText,
  BarChart,
  Settings,
  LogOut,
  ChevronFirst,
  ChevronLast,
  User as UserIcon,
  GitMerge 
} from "lucide-react";

// Context để quản lý trạng thái sidebar
const SidebarContext = createContext({ isCollapsed: false });

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-sky-500 border-r shadow-sm">
        {/* Logo + Toggle */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all ${
              isCollapsed ? "w-0" : "w-60"
            } text-3xl font-semibold`}
          >
            <span>Admin</span>
            <span className="text-neutral-900">Panel</span>
          </h1>
          <button
            onClick={() => setIsCollapsed((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-500 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronLast /> : <ChevronFirst />}
          </button>
        </div>

        {/* Sidebar Items */}
        <SidebarContext.Provider value={{ isCollapsed }}>
          <ul className="flex-1 px-3">
            <SidebarItem
              icon={<LayoutDashboard size={35} />}
              text={<span className="text-black text-lg">Dashboard</span>}
              href="/admin"
            />
            <SidebarItem
              icon={<Users size={35} />}
              text={<span className="text-black text-lg">Người dùng</span>}
              href="/admin/users"
            />
             <SidebarItem
              icon={<GitMerge size={35} />}
              text={<span className="text-black text-lg">Lộ trình học </span>}
              href="/admin/learning-paths"
            />
            <SidebarItem
              icon={<Layers3 size={35} />}
              text={<span className="text-black text-lg">Bài Học </span>}
              href="/admin/lessons"
            />
            <SidebarItem
              icon={<FileText size={35} />}
              text={<span className="text-black text-lg">Đề thi</span>}
              href="/admin/exams"
            />
            <SidebarItem
              icon={<BarChart size={35} />}
              text={<span className="text-black text-lg">Báo cáo</span>}
              href="/admin/reports"
            />
            <hr className="my-3" />
            <SidebarItem
              icon={<Settings size={35} />}
              text={<span className="text-black text-lg">Cài đặt</span>}
              href="/admin/settings"
            />
          </ul>
        </SidebarContext.Provider>

        {/* User info + dropdown */}
        <div className="border-t p-3 relative">
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute bottom-full mb-2 w-full bg-white border rounded-md shadow-lg"
            >
              <ul className="py-1">
                <li>
                  <Link
                    href="/admin/profile"
                    className="flex items-center px-3 py-2 text-black text-lg hover:bg-gray-100"
                  >
                    <UserIcon size={18} className="mr-2" />
                    Trang cá nhân
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center px-3 py-2 text-black text-lg hover:bg-red-400"
                  >
                    <LogOut size={18} className="mr-2" />
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div
            onClick={() => setIsMenuOpen((curr) => !curr)}
            className="flex items-center cursor-pointer"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${
                profile?.full_name || "A"
              }&background=0284c7&color=fff`}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                isCollapsed ? "w-0" : "w-52 ml-3"
              }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">
                  {profile?.full_name || "Admin"}
                </h4>
                <span className="text-xs text-gray-600">
                  {profile?.role || "admin"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
  href: string;
}) {
  const { isCollapsed } = useContext(SidebarContext);
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          isActive
            ? "bg-gradient-to-tr from-cyan-50 to-orange-100 text-pink-800"
            : "hover:bg-gray-50 text-gray-600"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            isCollapsed ? "w-0" : "w-52 ml-3"
          }`}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}
