import { NextRequest, NextResponse } from 'next/server';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
  options?: string[];
  correct_answer: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string | null;
  exercise_type: string;
  difficulty_level: string;
  max_score: number;
  time_limit_minutes: number | null;
  lesson_id: string | null;
  is_active: boolean;
  created_at: string;
  questions: Question[];
}

// Mock data for testing UI - empty by default
const mockExercises: Exercise[] = [];

// GET - Lấy danh sách tất cả bài tập
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const exercise_type = searchParams.get('exercise_type');
    const difficulty_level = searchParams.get('difficulty_level');
    const search = searchParams.get('search');

    let filteredExercises = [...mockExercises];

    // Áp dụng các bộ lọc
    if (exercise_type && exercise_type !== 'all') {
      filteredExercises = filteredExercises.filter(ex => ex.exercise_type === exercise_type);
    }
    
    if (difficulty_level && difficulty_level !== 'all') {
      filteredExercises = filteredExercises.filter(ex => ex.difficulty_level === difficulty_level);
    }

    if (search) {
      filteredExercises = filteredExercises.filter(ex => 
        ex.title.toLowerCase().includes(search.toLowerCase()) ||
        ex.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({ exercises: filteredExercises });

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
      questions 
    } = await request.json();

    // Validate dữ liệu đầu vào
    if (!title || !exercise_type || !difficulty_level) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc: title, exercise_type, difficulty_level' },
        { status: 400 }
      );
    }

    // Tạo bài tập mới (mock implementation)
    const newExercise = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || null,
      exercise_type,
      difficulty_level,
      max_score: max_score || 100,
      time_limit_minutes: time_limit_minutes || null,
      lesson_id: lesson_id || null,
      is_active: true,
      created_at: new Date().toISOString(),
      questions: questions ? questions.map((q: QuestionInput, index: number) => ({
        id: (index + 1).toString(),
        question_text: q.question_text,
        question_type: q.question_type,
        points: parseInt(q.points) || 10,
        options: q.question_type === 'multiple_choice' ? q.options : null,
        correct_answer: q.correct_answer
      })) : []
    };

    // Thêm vào mock data
    mockExercises.unshift(newExercise);

    return NextResponse.json({
      message: 'Tạo bài tập thành công',
      exercise: newExercise
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Lỗi server không mong muốn' },
      { status: 500 }
    );
  }
}

