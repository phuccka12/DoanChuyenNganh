import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

type LearningPath = Database['public']['Tables']['learning_paths']['Row'];

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Fetch learning paths with basic data
    const { data: learningPaths, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('is_active', true)
      .order('course_type')
      .order('difficulty_level');

    if (error) {
      console.error('Error fetching learning paths:', error);
      return NextResponse.json(
        { error: 'Failed to fetch learning paths' },
        { status: 500 }
      );
    }

    // Return real data without mock statistics  
    const pathsWithStats = (learningPaths || []).map((path: LearningPath) => ({
      ...path,
      curriculum_count: 0, // Will be updated with real data later
      enrolled_users: 0, // Will be updated with real data later  
      avg_completion: 0, // Will be updated with real data later
    }));

    return NextResponse.json({ 
      success: true,
      data: pathsWithStats 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body = await request.json();

    const insertData = {
      name: body.name,
      description: body.description,
      course_type: body.course_type,
      level: body.level || 'Beginner',
      target_score: body.target_score || null,
      duration_weeks: body.duration_weeks || null,
      difficulty_level: body.difficulty_level || 1,
      prerequisites: body.prerequisites || null,
      is_active: true
    };

    const { data, error } = await supabase
      .from('learning_paths')
      .insert([insertData] as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating learning path:', error);
      return NextResponse.json(
        { error: 'Failed to create learning path' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}