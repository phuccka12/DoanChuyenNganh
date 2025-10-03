-- Create exercises table in Supabase
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    exercise_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (exercise_type IN ('multiple_choice', 'essay', 'fill_in_blank', 'listening', 'reading')),
    difficulty_level TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    max_score INTEGER DEFAULT 100,
    time_limit_minutes INTEGER,
    lesson_id UUID REFERENCES public.lessons(id),
    source_file_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'essay', 'fill_in_blank', 'true_false')),
    points INTEGER DEFAULT 10,
    options JSONB, -- Store array of options for multiple choice
    correct_answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies for exercises
CREATE POLICY "Everyone can view exercises" ON public.exercises
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage exercises" ON public.exercises
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Create policies for questions
CREATE POLICY "Everyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage questions" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON public.exercises(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON public.exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_questions_exercise_id ON public.questions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(exercise_id, order_index);