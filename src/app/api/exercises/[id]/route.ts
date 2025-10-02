import { NextRequest, NextResponse } from 'next/server';

// Mock data - same as in route.ts
const mockExercises = [
  {
    id: '1',
    title: 'TOEIC Listening Practice 1',
    description: 'Luyện tập nghe hiểu cơ bản cho TOEIC Part 1-2',
    exercise_type: 'multiple_choice',
    difficulty_level: 'easy',
    max_score: 100,
    time_limit_minutes: 30,
    lesson_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        id: '1',
        question_text: 'What is the man doing in the picture?',
        question_type: 'multiple_choice',
        points: 10,
        options: ['Reading', 'Writing', 'Speaking', 'Listening'],
        correct_answer: 'Reading'
      }
    ]
  },
  {
    id: '2',
    title: 'IELTS Writing Task 2',
    description: 'Viết luận argumentative essay về các chủ đề xã hội',
    exercise_type: 'essay',
    difficulty_level: 'hard',
    max_score: 200,
    time_limit_minutes: 60,
    lesson_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: []
  },
  {
    id: '3',
    title: 'Grammar Quiz - Present Tenses',
    description: 'Bài tập trắc nghiệm về các thì hiện tại',
    exercise_type: 'multiple_choice',
    difficulty_level: 'medium',
    max_score: 50,
    time_limit_minutes: 15,
    lesson_id: null,
    is_active: true,
    created_at: new Date().toISOString(),
    questions: []
  }
];

// GET /api/exercises/[id] - Get single exercise
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const exercise = mockExercises.find(ex => ex.id === id);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/exercises/[id] - Update exercise
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const exerciseIndex = mockExercises.findIndex(ex => ex.id === id);
    
    if (exerciseIndex === -1) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Update exercise data
    const updatedExercise = {
      ...mockExercises[exerciseIndex],
      title: body.title,
      description: body.description,
      exercise_type: body.exercise_type,
      difficulty_level: body.difficulty_level,
      max_score: body.max_score,
      time_limit_minutes: body.time_limit_minutes,
      lesson_id: body.lesson_id,
      questions: body.questions || [],
      updated_at: new Date().toISOString()
    };

    mockExercises[exerciseIndex] = updatedExercise;

    return NextResponse.json({ 
      exercise: updatedExercise,
      message: 'Exercise updated successfully' 
    });
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/exercises/[id] - Delete exercise
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const exerciseIndex = mockExercises.findIndex(ex => ex.id === id);
    
    if (exerciseIndex === -1) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Remove exercise from array
    const deletedExercise = mockExercises.splice(exerciseIndex, 1)[0];

    return NextResponse.json({ 
      message: 'Exercise deleted successfully',
      exercise: deletedExercise 
    });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}