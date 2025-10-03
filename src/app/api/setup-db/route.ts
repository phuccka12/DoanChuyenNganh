import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // Create exercises table
    const createExercisesTable = `
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
    `;

    const createQuestionsTable = `
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
    `;

    const addConstraints = `
      ALTER TABLE public.questions ADD CONSTRAINT fk_questions_exercise_id 
      FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;
    `;

    const enableRLS = `
      ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
    `;

    const createPolicies = `
      -- Exercises policies
      DROP POLICY IF EXISTS "Everyone can view exercises" ON public.exercises;
      CREATE POLICY "Everyone can view exercises" ON public.exercises FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Anyone can create exercises" ON public.exercises;
      CREATE POLICY "Anyone can create exercises" ON public.exercises FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Anyone can update exercises" ON public.exercises;
      CREATE POLICY "Anyone can update exercises" ON public.exercises FOR UPDATE USING (true);
      
      -- Questions policies  
      DROP POLICY IF EXISTS "Everyone can view questions" ON public.questions;
      CREATE POLICY "Everyone can view questions" ON public.questions FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Anyone can create questions" ON public.questions;
      CREATE POLICY "Anyone can create questions" ON public.questions FOR INSERT WITH CHECK (true);
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_exercises_created_at ON public.exercises(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_exercises_type ON public.exercises(exercise_type);
      CREATE INDEX IF NOT EXISTS idx_questions_exercise_id ON public.questions(exercise_id);
      CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(exercise_id, order_index);
    `;

    // Execute all SQL commands
    const commands = [
      createExercisesTable,
      createQuestionsTable,
      enableRLS,
      createPolicies,
      createIndexes
    ];

    const results = [];
    for (const command of commands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: command });
        if (error) {
          console.log(`Command partially executed: ${command.substring(0, 50)}...`);
          console.log('Error (may be expected):', error.message);
        }
        results.push({ success: !error, command: command.substring(0, 50) + '...', error: error?.message });
      } catch {
        // Direct SQL execution, try alternative approach
        console.log(`Trying direct execution for: ${command.substring(0, 50)}...`);
        results.push({ success: false, command: command.substring(0, 50) + '...', error: 'Direct SQL not available' });
      }
    }

    // Add constraint separately (might fail if already exists)
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: addConstraints });
      results.push({ success: !error, command: 'Add foreign key constraints', error: error?.message });
    } catch {
      results.push({ success: false, command: 'Add foreign key constraints', error: 'Constraint may already exist' });
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      results
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { error: 'Không thể setup database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}