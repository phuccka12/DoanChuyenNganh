'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useContext, createContext } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/app/context/UserContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";

const SidebarContext = createContext({ isCollapsed: false });

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="h-screen sticky top-0">
      <nav className="h-full flex flex-col bg-indigo-500 border-r shadow-sm">
        {/* Header */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all ${
              isCollapsed ? "w-0" : "w-45"
            } text-2xl font-bold text-white`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setIsCollapsed((c) => !c)}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-400"
          >
            {isCollapsed ? <ChevronLast /> : <ChevronFirst />}
          </button>
        </div>

        {/* Sidebar Items */}
        <SidebarContext.Provider value={{ isCollapsed }}>
          <ul className="flex-1 px-3">
            <SidebarItem
              icon={<LayoutDashboard size={30} />}
              text="Bảng điều khiển"
              href="/admin/dashboard"
            />
            <SidebarItem
              icon={<Users size={30} />}
              text="Quản lý người dùng"
              href="/admin/users"
            />
            <SidebarItem
              icon={<GraduationCap size={30} />}
              text="Quản lý lớp học"
              href="/admin/classes"
            />
            <SidebarItem
              icon={<BookOpen size={30} />}
              text="Quản lý đề thi"
              href="/admin/exams"
            />
            <SidebarItem
              icon={<BarChart3 size={30} />}
              text="Thống kê hệ thống"
              href="/admin/statistics"
            />
            <hr className="my-3" />
            <SidebarItem
              icon={<Settings size={30} />}
              text="Cài đặt"
              href="/admin/settings"
            />
          </ul>
        </SidebarContext.Provider>

        {/* Footer */}
        <div className="border-t p-3">
          <button
            onClick={handleSignOut}
            className="w-full text-left flex items-center px-3 py-2 text-white hover:bg-red-400 rounded-md"
          >
            <LogOut size={20} className="mr-2" />
            Đăng xuất
          </button>
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
  text: string;
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
            ? "bg-indigo-700 text-white"
            : "hover:bg-indigo-400 text-white"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            isCollapsed ? "w-0" : "w-40 ml-3"
          }`}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}
