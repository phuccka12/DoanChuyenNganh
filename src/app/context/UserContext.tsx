// src/app/context/UserContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

// Cập nhật: Thêm các trường mới vào Profile
interface Profile {
  role: string;
  full_name: string;
  email :string;
  onboarding_completed: boolean; 
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserData = async (currentUser: User | null) => {
      if (currentUser) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role, full_name, onboarding_completed,email')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
            console.error("UserContext: Lỗi khi lấy profile:", error);
            setProfile(null);
        } else {
            setProfile(profileData);
            
            // SỬA LỖI LOGIC CHUYỂN HƯỚNG Ở ĐÂY
            const isNewUser = profileData && !profileData.onboarding_completed;
            const isAdmin = profileData && profileData.role === 'admin';
            const isOnboardingPage = pathname === '/dashboard/onboarding';

            // Chỉ chuyển hướng nếu là user mới, KHÔNG phải admin, VÀ đang cố vào dashboard (không phải trang onboarding)
            if (isNewUser && !isAdmin && pathname.startsWith('/dashboard') && !isOnboardingPage) {
                router.push('/dashboard/onboarding');
            }
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchUserData(currentUser);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  const value = { user, profile, isLoading };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}