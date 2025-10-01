-- BƯỚC 1: XÓA TẤT CẢ DỮ LIỆU MẪU
-- Xóa hết dữ liệu mẫu trong bảng profiles (trừ người dùng thật)
DELETE FROM public.profiles 
WHERE email LIKE '%@example.com' 
   OR full_name IN ('Admin User', 'Nguyễn Văn A', 'Trần Thị B', 'Test User', 'Sample User')
   OR id IN (
     SELECT id FROM public.profiles 
     WHERE created_at < (NOW() - INTERVAL '1 day') 
     AND email LIKE '%example%'
   );

-- BƯỚC 2: Xem dữ liệu còn lại sau khi xóa
SELECT 'Dữ liệu thật còn lại:' as status, role, COUNT(*) as count 
FROM public.profiles 
GROUP BY role 
ORDER BY role;

-- BƯỚC 3: Cập nhật role cho dữ liệu thật (nếu có)
UPDATE public.profiles 
SET role = CASE 
    WHEN role IN ('admin') THEN 'admin'
    WHEN role IN ('moderator') THEN 'teacher'
    WHEN role IN ('user', 'student') THEN 'student'
    WHEN role IS NULL THEN 'student'
    ELSE 'student'
END;

-- BƯỚC 4: Áp dụng constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'teacher', 'student'));

ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'student';

-- Thêm cột trạng thái hoạt động
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- BƯỚC 5: Tạo bảng categories đơn giản
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BƯỚC 6: Tạo bảng lessons và products (cấu trúc cơ bản)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    total_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BƯỚC 7: Function tạo profile tự động
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        'student'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- BƯỚC 8: View đơn giản để dashboard query
CREATE OR REPLACE VIEW simple_dashboard_stats AS
SELECT 
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teacher_count,
    COUNT(CASE WHEN role = 'student' THEN 1 END) as student_count,
    COUNT(*) as total_users
FROM public.profiles;

-- BƯỚC 9: View role statistics đơn giản
CREATE OR REPLACE VIEW simple_role_stats AS
SELECT 
    role,
    COUNT(*) as user_count
FROM public.profiles 
GROUP BY role
ORDER BY role;

-- BƯỚC 10: XÓA TẤT CẢ DỮ LIỆU MẪU KHÁC (nếu có)
-- Xóa dữ liệu mẫu từ các bảng khác
DELETE FROM public.categories WHERE name LIKE '%Sample%' OR slug LIKE '%sample%';
DELETE FROM public.lessons WHERE title LIKE '%Sample%' OR title LIKE '%Test%';
DELETE FROM public.products WHERE name LIKE '%Sample%' OR name LIKE '%Test%';

-- KIỂM TRA KẾT QUẢ
SELECT '=== DỮ LIỆU MẪU ĐÃ XÓA SẠCH - CHỈ CÒN DỮ LIỆU THẬT ===' as message;

SELECT 'Người dùng thật còn lại:' as info, 
       COALESCE(role, 'chưa có role') as role, 
       COUNT(*) as count 
FROM public.profiles 
GROUP BY role 
ORDER BY role;

SELECT 'Bảng categories (đã xóa dữ liệu mẫu):' as info, COUNT(*) as total_categories
FROM public.categories;

SELECT 'Dashboard stats (100% dữ liệu thật):' as info, * FROM simple_dashboard_stats;

COMMIT;