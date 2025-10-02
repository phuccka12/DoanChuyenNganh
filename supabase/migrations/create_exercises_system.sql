-- Migration: Tạo bảng exercises và questions cho hệ thống quản lý bài tập

-- Tạo bảng exercises (bài tập)
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    exercise_type VARCHAR(50) NOT NULL CHECK (exercise_type IN ('multiple_choice', 'true_false', 'fill_blank', 'essay', 'speaking')),
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    max_score INTEGER NOT NULL DEFAULT 100,
    time_limit_minutes INTEGER,
    lesson_id UUID, -- Liên kết với bảng lessons (nếu có)
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo bảng questions (câu hỏi)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'essay')),
    points INTEGER NOT NULL DEFAULT 10,
    options JSONB, -- Chỉ dùng cho multiple_choice
    correct_answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo bảng exercise_attempts (lưu kết quả làm bài của học viên)
CREATE TABLE IF NOT EXISTS public.exercise_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Liên kết với bảng users
    score INTEGER NOT NULL DEFAULT 0,
    max_possible_score INTEGER NOT NULL,
    time_taken_minutes INTEGER,
    answers JSONB, -- Lưu đáp án của học viên
    is_completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_exercises_type ON public.exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON public.exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON public.exercises(is_active);
CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON public.exercises(created_at);

CREATE INDEX IF NOT EXISTS idx_questions_exercise_id ON public.questions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(order_index);

CREATE INDEX IF NOT EXISTS idx_exercise_attempts_exercise_id ON public.exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user_id ON public.exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_completed ON public.exercise_attempts(is_completed);

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Áp dụng trigger cho các bảng
DROP TRIGGER IF EXISTS update_exercises_updated_at ON public.exercises;
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON public.questions;
CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exercise_attempts_updated_at ON public.exercise_attempts;
CREATE TRIGGER update_exercise_attempts_updated_at
    BEFORE UPDATE ON public.exercise_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Thêm RLS (Row Level Security) policies
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_attempts ENABLE ROW LEVEL SECURITY;

-- Policy cho exercises: Cho phép đọc tất cả, chỉ admin mới được tạo/sửa/xóa
CREATE POLICY "Exercises are viewable by everyone" ON public.exercises
    FOR SELECT USING (true);

CREATE POLICY "Exercises are insertable by authenticated users" ON public.exercises
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Exercises are updatable by authenticated users" ON public.exercises
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Exercises are deletable by authenticated users" ON public.exercises
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policy cho questions: Tương tự exercises
CREATE POLICY "Questions are viewable by everyone" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Questions are insertable by authenticated users" ON public.questions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Questions are updatable by authenticated users" ON public.questions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Questions are deletable by authenticated users" ON public.questions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policy cho exercise_attempts: Học viên chỉ xem được bài làm của mình
CREATE POLICY "Exercise attempts are viewable by owner" ON public.exercise_attempts
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Exercise attempts are insertable by authenticated users" ON public.exercise_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Exercise attempts are updatable by owner" ON public.exercise_attempts
    FOR UPDATE USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Thêm một số dữ liệu mẫu
INSERT INTO public.exercises (title, description, exercise_type, difficulty_level, max_score, time_limit_minutes) VALUES
('TOEIC Listening Practice 1', 'Luyện tập nghe hiểu cơ bản cho TOEIC Part 1-2', 'multiple_choice', 'easy', 100, 30),
('IELTS Writing Task 2', 'Viết luận argumentative essay về các chủ đề xã hội', 'essay', 'hard', 200, 60),
('Grammar Quiz - Present Tenses', 'Bài tập trắc nghiệm về các thì hiện tại', 'multiple_choice', 'medium', 50, 15),
('Vocabulary Test - Business English', 'Kiểm tra từ vựng tiếng Anh thương mại', 'fill_blank', 'medium', 75, 20),
('Speaking Practice - Job Interview', 'Luyện tập nói về phỏng vấn xin việc', 'speaking', 'hard', 100, 10);