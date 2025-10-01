-- SQL để chạy migration thêm các trường mới cho analytics
-- Nên chạy trong Supabase SQL Editor

-- 1. Thêm các trường mới vào bảng profiles (nếu chưa có)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(15),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS course VARCHAR(100),
ADD COLUMN IF NOT EXISTS class_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Tạo bảng activity_logs để theo dõi hoạt động
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tạo bảng system_stats để lưu thống kê
CREATE TABLE IF NOT EXISTS system_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Thêm indexes để tăng hiệu năng
CREATE INDEX IF NOT EXISTS idx_profiles_course ON profiles(course);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_stats_date ON system_stats(date);

-- 5. Tạo function để cập nhật thống kê hàng ngày
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS void AS $$
DECLARE
  today DATE := CURRENT_DATE;
  user_count INTEGER;
  active_count INTEGER;
  new_count INTEGER;
BEGIN
  -- Đếm tổng người dùng
  SELECT COUNT(*) INTO user_count
  FROM profiles 
  WHERE email NOT LIKE '%example.com%' 
    AND email NOT LIKE '%test%' 
    AND email NOT LIKE '%fake%'
    AND full_name IS NOT NULL 
    AND full_name != '';

  -- Đếm người dùng hoạt động (đăng nhập trong 7 ngày qua)
  SELECT COUNT(*) INTO active_count
  FROM profiles 
  WHERE last_login >= CURRENT_DATE - INTERVAL '7 days'
    AND email NOT LIKE '%example.com%' 
    AND email NOT LIKE '%test%' 
    AND email NOT LIKE '%fake%'
    AND full_name IS NOT NULL 
    AND full_name != '';

  -- Đếm người dùng mới hôm nay
  SELECT COUNT(*) INTO new_count
  FROM profiles 
  WHERE DATE(created_at) = today
    AND email NOT LIKE '%example.com%' 
    AND email NOT LIKE '%test%' 
    AND email NOT LIKE '%fake%'
    AND full_name IS NOT NULL 
    AND full_name != '';

  -- Upsert thống kê
  INSERT INTO system_stats (date, total_users, active_users, new_users)
  VALUES (today, user_count, active_count, new_count)
  ON CONFLICT (date) 
  DO UPDATE SET 
    total_users = EXCLUDED.total_users,
    active_users = EXCLUDED.active_users,
    new_users = EXCLUDED.new_users,
    created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. Tạo trigger để log hoạt động đăng nhập
CREATE OR REPLACE FUNCTION log_user_activity()
RETURNS trigger AS $$
BEGIN
  -- Log khi user được tạo
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs (user_id, action, details)
    VALUES (NEW.id, 'user_created', json_build_object('email', NEW.email, 'role', NEW.role));
    RETURN NEW;
  END IF;

  -- Log khi user được cập nhật
  IF TG_OP = 'UPDATE' THEN
    -- Nếu last_login được cập nhật
    IF OLD.last_login IS DISTINCT FROM NEW.last_login THEN
      INSERT INTO activity_logs (user_id, action, details)
      VALUES (NEW.id, 'user_login', json_build_object('previous_login', OLD.last_login));
    END IF;
    
    -- Nếu role được thay đổi
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      INSERT INTO activity_logs (user_id, action, details)
      VALUES (NEW.id, 'role_changed', json_build_object('old_role', OLD.role, 'new_role', NEW.role));
    END IF;
    
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Tạo triggers
DROP TRIGGER IF EXISTS profiles_activity_trigger ON profiles;
CREATE TRIGGER profiles_activity_trigger
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_user_activity();

-- 8. Chạy function cập nhật thống kê lần đầu
SELECT update_daily_stats();

-- 9. Comment các bảng và cột
COMMENT ON TABLE activity_logs IS 'Bảng lưu trữ log hoạt động của người dùng';
COMMENT ON TABLE system_stats IS 'Bảng lưu trữ thống kê hệ thống theo ngày';
COMMENT ON COLUMN profiles.phone IS 'Số điện thoại người dùng';
COMMENT ON COLUMN profiles.avatar_url IS 'URL hình đại diện';
COMMENT ON COLUMN profiles.birth_date IS 'Ngày sinh';
COMMENT ON COLUMN profiles.course IS 'Khóa học (TOEIC/IELTS/APTIS)';
COMMENT ON COLUMN profiles.class_name IS 'Tên lớp học';
COMMENT ON COLUMN profiles.last_login IS 'Lần đăng nhập cuối cùng';

-- 10. Tạm thời thêm dữ liệu mẫu cho thống kê (tùy chọn)
INSERT INTO system_stats (date, total_users, active_users, new_users)
SELECT 
  CURRENT_DATE - (n || ' days')::interval,
  CASE WHEN n = 0 THEN (SELECT COUNT(*) FROM profiles WHERE email NOT LIKE '%example.com%')
       ELSE GREATEST(1, (SELECT COUNT(*) FROM profiles WHERE email NOT LIKE '%example.com%') - n)
  END,
  CASE WHEN n <= 7 THEN GREATEST(1, (SELECT COUNT(*) FROM profiles WHERE email NOT LIKE '%example.com%') - n - 2)
       ELSE GREATEST(0, (SELECT COUNT(*) FROM profiles WHERE email NOT LIKE '%example.com%') - n - 5)
  END,
  CASE WHEN n <= 30 THEN GREATEST(0, 3 - (n / 10))
       ELSE 0
  END
FROM generate_series(0, 30) as n
ON CONFLICT (date) DO NOTHING;