// src/components/DashboardSidebar.tsx
'use client';
import {  User } from "lucide-react";
import { useState, createContext, useRef, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../../app/context/UserContext'; // Sửa đường dẫn nếu cần
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// Import icons từ Lucide React
import { 
    LayoutDashboard, 
    BookCopy, 
    Layers3, 
    ShoppingCart, 
    Settings, 
    LogOut,
    ChevronFirst,
    ChevronLast 
} from 'lucide-react';

// Context để quản lý trạng thái sidebar
const SidebarContext = createContext({ isCollapsed: false });

export default function DashboardSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { profile } = useUser();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- State cho menu dropdown 
    const menuRef = useRef<HTMLDivElement>(null); // <-- Ref để theo dõi menu dropdown
    const supabase = createClientComponentClient();
    
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className="h-screen sticky top-0">
            <nav className="h-full flex flex-col bg-sky-600 border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                   <h1 className={`overflow-hidden transition-all ${isCollapsed ? "w-0" : "w-45"} text-3xl font-semibold`}>
    <span>HIDAY</span>
    <span className="text-neutral-950">BETA</span>
</h1>
                    <button onClick={() => setIsCollapsed(curr => !curr)} className="p-1.5 rounded-lg bg-gray-500 hover:bg-gray-100">
                        {isCollapsed ? <ChevronLast /> : <ChevronFirst />}
                    </button>
                </div>

              <SidebarContext.Provider value={{ isCollapsed }}>
    <ul className="flex-1 px-3">
        <SidebarItem 
            icon={<LayoutDashboard  size={35} />} 
            text={<span className="text-black text-lg">Dashboard</span>} 
            href="/dashboard" 
        />
        <SidebarItem 
            icon={<BookCopy size={35} />} 
            text={<span className="text-black text-lg">Luyện đề</span>} 
            href="/dashboard/practice" 
        />
        <SidebarItem 
            icon={<Layers3 size={35} />} 
            text={<span className="text-black text-lg">Flashcards</span>} 
            href="/dashboard/flashcards" 
        />
        <SidebarItem 
            icon={<ShoppingCart size={35} />} 
            text={<span className="text-black text-lg">Cửa hàng</span>} 
            href="/store" 
        />
        <hr className="my-3" />
        <SidebarItem 
            icon={<Settings size={35} />} 
            text={<span className="text-black text-lg">Cài đặt</span>} 
            href="/dashboard/settings" 
        />
    </ul>
</SidebarContext.Provider>

 {/* Phần thông tin user (đã được cập nhật) */}
                <div className="border-t p-3 relative">
                    {/* Menu Dropdown */}
                    {isMenuOpen && (
                        <div ref={menuRef} className="absolute bottom-full mb-2 w-full bg-white border rounded-md shadow-lg">
                           <ul className="py-1">
                                <li>
                                    <Link href="/dashboard/profile" className="flex items-center px-3 py-2 text-black text-lg hover:bg-gray-100">
                                        <User size={18} className="mr-2" />
                                        Trang cá nhân
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleSignOut} className="w-full text-left flex items-center px-3 py-2 text-black text-lg hover:bg-red-400">
                                        <LogOut size={18} className="mr-2" />
                                        Đăng xuất
                                    </button>
                                </li>
                           </ul>
                        </div>
                    )}
                    
                    {/* Trigger để mở/đóng menu */}
                    <div onClick={() => setIsMenuOpen(curr => !curr)} className="flex items-center cursor-pointer">
                        <img src={`https://ui-avatars.com/api/?name=${profile?.full_name || 'U'}&background=fb7185&color=fff`} alt="User Avatar" className="w-10 h-10 rounded-md" />
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${isCollapsed ? "w-0" : "w-52 ml-3"}`}>
                            <div className="leading-4">
                                <h4 className="font-semibold">{profile?.full_name || "User"}</h4>
                                <span className="text-xs text-gray-600">{profile?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
              
            </nav>
        </aside>
    );
}

// Component con cho mỗi mục trong sidebar
function SidebarItem({ icon, text, href }: { icon: React.ReactNode, text: React.ReactNode, href: string }) {
    const { isCollapsed } = useContext(SidebarContext);
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? "bg-gradient-to-tr from-cyan-50 to-orange-100 text-pink-800" : "hover:bg-gray-50 text-gray-600"}`}>
                {icon}
                <span className={`overflow-hidden transition-all ${isCollapsed ? "w-0" : "w-52 ml-3"}`}>
                    {text}
                </span>

                {!isCollapsed && (
                    <div className={`absolute left-full rounded-md px-4 py-1 ml-6 bg-blue-400 text-pink-1000 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                        {text}
                    </div>
                )}
            </li>
        </Link>
    );
}