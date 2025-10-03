import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
  options?: string[];
  correct_answer: string;
}

// GET - Lấy danh sách tất cả bài tập từ Supabase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const exercise_type = searchParams.get('exercise_type');
    const difficulty_level = searchParams.get('difficulty_level');
    const search = searchParams.get('search');

    // Fetch exercises from Supabase (without nested questions to avoid foreign key issues)
    let query = supabase
      .from('exercises')
      .select(`
        id,
        title,
        description,
        exercise_type,
        difficulty_level,
        max_score,
        time_limit_minutes,
        lesson_id,
        source_file_url,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (exercise_type && exercise_type !== 'all') {
      query = query.eq('exercise_type', exercise_type);
    }
    
    if (difficulty_level && difficulty_level !== 'all') {
      query = query.eq('difficulty_level', difficulty_level);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: exercises, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      
      // If table doesn't exist, return empty array instead of error
      if (error.code === 'PGRST205') {
        return NextResponse.json({ 
          exercises: [],
          total: 0,
          error: 'Bảng exercises chưa được tạo. Vui lòng tạo bảng trước.'
        });
      }
      
      return NextResponse.json(
        { error: 'Không thể lấy dữ liệu bài tập từ database', details: error.message },
        { status: 500 }
      );
    }

    // Get questions for each exercise separately
    const exercisesWithQuestions = await Promise.all(
      (exercises || []).map(async (exercise) => {
        try {
          const { data: questions } = await supabase
            .from('questions')
            .select('id, question_text, question_type, points, options, correct_answer')
            .eq('exercise_id', exercise.id);
          
          return {
            ...exercise,
            questions: questions || []
          };
        } catch {
          // If questions query fails, just return exercise without questions
          return {
            ...exercise,
            questions: []
          };
        }
      })
    );

    return NextResponse.json({ 
      exercises: exercisesWithQuestions,
      total: exercisesWithQuestions.length
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Lỗi server không mong muốn' },
      { status: 500 }
    );
  }
}

interface QuestionInput {
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  points: string;
  options: string[];
  correct_answer: string;
}

// POST - Tạo bài tập mới
export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      exercise_type, 
      difficulty_level, 
      max_score, 
      time_limit_minutes,
      lesson_id,
      questions,
      source_file_url
    } = await request.json();

    // Validate dữ liệu đầu vào
    if (!title || !exercise_type || !difficulty_level) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc: title, exercise_type, difficulty_level' },
        { status: 400 }
      );
    }

    // Tạo bài tập mới trong Supabase
    const { data: exercise, error: exerciseError } = await supabase
      .from('exercises')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        exercise_type,
        difficulty_level,
        max_score: max_score || 100,
        time_limit_minutes: time_limit_minutes || null,
        lesson_id: lesson_id || null,
        source_file_url: source_file_url || null,
        is_active: true
      })
      .select()
      .single();

    if (exerciseError) {
      console.error('Error creating exercise:', exerciseError);
      return NextResponse.json(
        { error: 'Không thể tạo bài tập trong database' },
        { status: 500 }
      );
    }

    // Tạo các câu hỏi nếu có
    let createdQuestions: Question[] = [];
    if (questions && questions.length > 0) {
      const questionInserts = questions.map((q: QuestionInput, index: number) => ({
        exercise_id: exercise.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: parseInt(q.points) || 10,
        options: q.question_type === 'multiple_choice' ? q.options : null,
        correct_answer: q.correct_answer,
        order_index: index
      }));

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .insert(questionInserts)
        .select();

      if (questionsError) {
        console.error('Error creating questions:', questionsError);
        // Don't fail completely, just log the error
      } else {
        createdQuestions = questionsData || [];
      }
    }

    return NextResponse.json({
      message: 'Tạo bài tập thành công',
      exercise: {
        ...exercise,
        questions: createdQuestions
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Lỗi server không mong muốn' },
      { status: 500 }
    );
  }
}

