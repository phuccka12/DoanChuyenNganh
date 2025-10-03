import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET /api/exercises/[id] - Get single exercise
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get exercise with questions
    const { data: exercise, error } = await supabase
      .from('exercises')
      .select(`
        *,
        questions (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
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
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Update exercise
    const { data: exercise, error } = await supabase
      .from('exercises')
      .update({
        title: body.title,
        description: body.description,
        exercise_type: body.exercise_type,
        difficulty_level: body.difficulty_level,
        max_score: body.max_score,
        time_limit_minutes: body.time_limit_minutes,
        lesson_id: body.lesson_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Exercise not found or update failed' },
        { status: 404 }
      );
    }

    // Update questions if provided
    if (body.questions && body.questions.length > 0) {
      // Delete existing questions
      await supabase
        .from('questions')
        .delete()
        .eq('exercise_id', id);

      // Insert new questions
      const questions = body.questions.map((q: { question_text: string; question_type: string; points: string; options: string[]; correct_answer: string; explanation?: string }) => ({
        exercise_id: id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: parseInt(q.points) || 10,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null
      }));

      await supabase
        .from('questions')
        .insert(questions);
    }

    return NextResponse.json({ 
      exercise,
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
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get exercise before deleting (for response)
    const { data: exercise } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    // Delete exercise (questions will be cascade deleted if foreign key is set up)
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: 'Exercise not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Exercise deleted successfully',
      exercise 
    });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}