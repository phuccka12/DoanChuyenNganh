import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function checkDatabaseTables() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection first
    const { error: testError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (testError) {
      return NextResponse.json(
        { error: 'Supabase connection failed', details: testError.message },
        { status: 500 }
      );
    }

    // Try to create exercises table using raw SQL via edge function or direct SQL
    // First, let's check if exercises table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('exercises')
      .select('count(*)')
      .limit(1);

    if (checkError && checkError.code === 'PGRST205') {
      // Table doesn't exist, we need to create it
      return NextResponse.json({
        success: false,
        error: 'Exercises table does not exist',
        message: 'Please create the exercises table in Supabase SQL Editor using the provided schema',
        sqlScript: `
-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    exercise_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (exercise_type IN ('multiple_choice', 'essay', 'fill_in_blank', 'listening', 'reading')),
    difficulty_level TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    max_score INTEGER DEFAULT 100,
    time_limit_minutes INTEGER,
    lesson_id UUID,
    source_file_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'essay', 'fill_in_blank', 'true_false')),
    points INTEGER DEFAULT 10,
    options JSONB,
    correct_answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint
ALTER TABLE public.questions ADD CONSTRAINT fk_questions_exercise_id 
FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view exercises" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "Anyone can create exercises" ON public.exercises FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update exercises" ON public.exercises FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete exercises" ON public.exercises FOR DELETE USING (true);

CREATE POLICY "Everyone can view questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Anyone can create questions" ON public.questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update questions" ON public.questions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete questions" ON public.questions FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON public.exercises(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON public.exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_questions_exercise_id ON public.questions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(exercise_id, order_index);
        `
      });
    }

    // If we get here, table exists, let's test it
    return NextResponse.json({
      success: true,
      message: 'Exercises table exists and is accessible',
      tableExists: true,
      exerciseCount: tableExists?.length || 0
    });

  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { 
        error: 'Database check failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return checkDatabaseTables();
}

export async function POST() {
  return checkDatabaseTables();
}