-- Learning Paths Database Schema
-- Tạo các bảng để quản lý lộ trình học tiếng Anh

-- 1. Bảng learning_paths - Lưu thông tin các lộ trình học
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  course_type VARCHAR(50) NOT NULL CHECK (course_type IN ('TOEIC', 'IELTS', 'APTIS')),
  level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced')),
  target_score INTEGER,
  duration_weeks INTEGER NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bảng curriculum_items - Các mục trong chương trình học
CREATE TABLE IF NOT EXISTS curriculum_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 7),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('Lesson', 'Exercise', 'Test', 'Review', 'Speaking', 'Listening', 'Reading', 'Writing')),
  estimated_minutes INTEGER DEFAULT 30,
  order_index INTEGER NOT NULL,
  is_mandatory BOOLEAN DEFAULT true,
  resources JSONB, -- Links, materials, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng user_progress - Theo dõi tiến độ học của học viên
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  curriculum_item_id UUID REFERENCES curriculum_items(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  score INTEGER,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  time_spent_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, curriculum_item_id)
);

-- 4. Bảng user_learning_paths - Lộ trình được gán cho học viên
CREATE TABLE IF NOT EXISTS user_learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  target_completion_date DATE,
  current_week INTEGER DEFAULT 1,
  overall_progress INTEGER DEFAULT 0 CHECK (overall_progress BETWEEN 0 AND 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, learning_path_id)
);

-- 5. Bảng path_prerequisites - Điều kiện tiên quyết
CREATE TABLE IF NOT EXISTS path_prerequisites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  prerequisite_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tạo indexes để tăng hiệu năng
CREATE INDEX IF NOT EXISTS idx_learning_paths_course_type ON learning_paths(course_type);
CREATE INDEX IF NOT EXISTS idx_learning_paths_level ON learning_paths(level);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_path ON curriculum_items(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_week ON curriculum_items(week_number);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_path ON user_progress(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_paths_user ON user_learning_paths(user_id);

-- 7. Thêm dữ liệu mẫu cho TOEIC
INSERT INTO learning_paths (name, description, course_type, level, target_score, duration_weeks, difficulty_level) VALUES
('TOEIC Beginner Complete', 'Lộ trình TOEIC dành cho người mới bắt đầu, mục tiêu 450+ điểm', 'TOEIC', 'Beginner', 450, 12, 2),
('TOEIC Intermediate Plus', 'Lộ trình TOEIC trung cấp, mục tiêu 650+ điểm', 'TOEIC', 'Intermediate', 650, 16, 3),
('TOEIC Advanced Mastery', 'Lộ trình TOEIC nâng cao, mục tiêu 850+ điểm', 'TOEIC', 'Advanced', 850, 20, 4);

-- 8. Thêm dữ liệu mẫu cho IELTS  
INSERT INTO learning_paths (name, description, course_type, level, target_score, duration_weeks, difficulty_level) VALUES
('IELTS Foundation 5.5', 'Lộ trình IELTS cơ bản, mục tiêu band 5.5', 'IELTS', 'Elementary', 55, 14, 2),
('IELTS Academic 6.5', 'Lộ trình IELTS học thuật, mục tiêu band 6.5', 'IELTS', 'Intermediate', 65, 18, 3),
('IELTS Professional 7.5+', 'Lộ trình IELTS chuyên nghiệp, mục tiêu band 7.5+', 'IELTS', 'Advanced', 75, 24, 4);

-- 9. Thêm dữ liệu mẫu cho APTIS
INSERT INTO learning_paths (name, description, course_type, level, target_score, duration_weeks, difficulty_level) VALUES
('APTIS General B1', 'Lộ trình APTIS General, mục tiêu B1', 'APTIS', 'Intermediate', 3, 12, 2),
('APTIS Academic B2', 'Lộ trình APTIS Academic, mục tiêu B2', 'APTIS', 'Upper-Intermediate', 4, 16, 3),
('APTIS Professional C1', 'Lộ trình APTIS chuyên nghiệp, mục tiêu C1', 'APTIS', 'Advanced', 5, 20, 4);

-- 10. Thêm curriculum mẫu cho TOEIC Beginner
DO $$
DECLARE
    path_id UUID;
    week_num INTEGER;
    day_num INTEGER;
BEGIN
    SELECT id INTO path_id FROM learning_paths WHERE name = 'TOEIC Beginner Complete' LIMIT 1;
    
    FOR week_num IN 1..4 LOOP
        FOR day_num IN 1..5 LOOP -- Học 5 ngày/tuần
            INSERT INTO curriculum_items (
                learning_path_id, week_number, day_number, title, description, 
                content_type, estimated_minutes, order_index
            ) VALUES (
                path_id, 
                week_num, 
                day_num,
                CASE day_num
                    WHEN 1 THEN 'Listening Part 1 - Photos'
                    WHEN 2 THEN 'Reading Part 5 - Grammar'  
                    WHEN 3 THEN 'Listening Part 2 - Questions'
                    WHEN 4 THEN 'Reading Part 6 - Text Completion'
                    WHEN 5 THEN 'Practice Test - Week ' || week_num
                END,
                CASE day_num
                    WHEN 1 THEN 'Học cách mô tả hình ảnh trong TOEIC Part 1'
                    WHEN 2 THEN 'Ôn tập ngữ pháp cơ bản cho TOEIC Part 5'
                    WHEN 3 THEN 'Luyện nghe câu hỏi trả lời ngắn Part 2'
                    WHEN 4 THEN 'Điền từ vào đoạn văn Part 6'
                    WHEN 5 THEN 'Kiểm tra kiến thức tuần ' || week_num
                END,
                CASE day_num
                    WHEN 5 THEN 'Test'
                    WHEN 1 THEN 'Listening'
                    WHEN 3 THEN 'Listening'
                    ELSE 'Reading'
                END,
                CASE day_num WHEN 5 THEN 90 ELSE 45 END,
                (week_num - 1) * 5 + day_num
            );
        END LOOP;
    END LOOP;
END $$;

-- 11. Functions để tính toán tiến độ
CREATE OR REPLACE FUNCTION calculate_user_path_progress(p_user_id UUID, p_learning_path_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_items INTEGER;
    completed_items INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- Đếm tổng số items trong path
    SELECT COUNT(*) INTO total_items
    FROM curriculum_items 
    WHERE learning_path_id = p_learning_path_id;
    
    -- Đếm số items đã hoàn thành
    SELECT COUNT(*) INTO completed_items
    FROM user_progress up
    JOIN curriculum_items ci ON up.curriculum_item_id = ci.id
    WHERE up.user_id = p_user_id 
      AND ci.learning_path_id = p_learning_path_id
      AND up.status = 'completed';
    
    -- Tính phần trăm
    IF total_items > 0 THEN
        progress_percentage := (completed_items * 100) / total_items;
    ELSE
        progress_percentage := 0;
    END IF;
    
    -- Cập nhật vào bảng user_learning_paths
    UPDATE user_learning_paths 
    SET overall_progress = progress_percentage,
        updated_at = NOW()
    WHERE user_id = p_user_id AND learning_path_id = p_learning_path_id;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- 12. Trigger để tự động cập nhật tiến độ
CREATE OR REPLACE FUNCTION update_learning_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Cập nhật tiến độ khi user_progress thay đổi
    PERFORM calculate_user_path_progress(NEW.user_id, NEW.learning_path_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_progress ON user_progress;
CREATE TRIGGER trigger_update_progress
    AFTER INSERT OR UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_learning_progress();

-- 13. Comments
COMMENT ON TABLE learning_paths IS 'Các lộ trình học tiếng Anh (TOEIC, IELTS, APTIS)';
COMMENT ON TABLE curriculum_items IS 'Nội dung chi tiết trong từng lộ trình học';  
COMMENT ON TABLE user_progress IS 'Theo dõi tiến độ học tập của học viên';
COMMENT ON TABLE user_learning_paths IS 'Lộ trình được gán cho học viên cụ thể';

COMMENT ON COLUMN learning_paths.target_score IS 'Điểm mục tiêu (TOEIC: 450-990, IELTS: 5.5-9.0*10, APTIS: 1-5)';
COMMENT ON COLUMN curriculum_items.estimated_minutes IS 'Thời gian ước tính để hoàn thành (phút)';
COMMENT ON COLUMN user_progress.completion_percentage IS 'Phần trăm hoàn thành item này (0-100)';