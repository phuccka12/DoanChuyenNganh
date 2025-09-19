// app/components/Navbar.tsx - PHIÊN BẢN TINH CHỈNH TYPOGRAPHY
'use client';

import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    // THAY ĐỔI: Thêm tracking-wider để các link thoáng hơn
    <Link href={href} className={`relative group text-xl font-semibold tracking-wider transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
      <span>{children}</span>
      <span
        className={`absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-pink-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
          isActive ? 'scale-x-100' : ''
        }`}
      />
    </Link>
  );
};


export default function Navbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [pillStyle, setPillStyle] = useState({});
  const loginRef = useRef<HTMLAnchorElement>(null);
  const registerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const currentTab = pathname === '/login' ? '/login' : '/register';
    setActiveTab(currentTab);
  }, [pathname]);

  useEffect(() => {
    const targetRef = activeTab === '/login' ? loginRef : registerRef;
    if (targetRef.current) {
      const { offsetWidth, offsetLeft } = targetRef.current;
      setPillStyle({
        width: `${offsetWidth}px`,
        transform: `translateX(${offsetLeft}px)`,
      });
    }
  }, [activeTab]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/80">
      <div className="h-0.5 bg-gradient-to-r from--500 via-purple-500 to-orange-500 animate-gradient-x"></div>
      <nav className="relative container mx-auto px-6 py-3 flex justify-between items-center">
     <div className="flex-1 flex justify-start">
          {/* Đảm bảo href ở đây là "/" */}
          <Link href="/intro" className="flex items-center space-x-3">
            <div className="relative w-9 h-9">
         <Image 
      src="/logo.png" // <-- Next.js sẽ tự động tìm file này trong thư mục /public
      alt="HIDAYBETA Logo" 
      layout="fill" 
      objectFit="contain"
    />
            </div>
            <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              HIDAYBETA
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex  flex-1 justify-center font-semibold  items-center space-x-10">
            <NavLink href="/intro">Giới Thiệu</NavLink>
            <NavLink href="/ielts">Ielts</NavLink>
            <NavLink href="/toeic">Toeic</NavLink>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="relative flex items-center h-10 p-1 bg-gray-800/50 rounded-full">
            <div className="absolute top-0 bottom-0 left-0 bg-white rounded-full transition-all duration-300 ease-in-out shadow-md" style={pillStyle}></div>

            {/* THAY ĐỔI: Dùng font-semibold cho các nút */}
            <Link ref={loginRef} href="/login" onClick={() => setActiveTab('/login')} className={`relative z-10 px-5 h-full flex items-center text-lg transition-colors duration-300 ${activeTab === '/login' ? 'text-pink-600 font-semibold' : 'text-gray-300 font-semibold'}`}>
              Đăng nhập
            </Link>

            <Link ref={registerRef} href="/register" onClick={() => setActiveTab('/register')} className={`relative z-10 px-5 h-full flex items-center text-lg transition-colors duration-300 ${activeTab === '/register' ? 'text-pink-600 font-semibold' : 'text-gray-300 font-semibold'}`}>
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}