import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create some sample exercises to populate the dashboard
    const sampleExercises = [
      {
        title: 'TOEIC Listening Practice',
        description: 'Bài tập luyện nghe TOEIC cơ bản',
        exercise_type: 'listening',
        difficulty_level: 'medium',
        max_score: 100,
        time_limit_minutes: 30,
        lesson_id: null,
        questions: [
          {
            question_text: 'What is the main topic of the conversation?',
            question_type: 'multiple_choice',
            points: 10,
            options: ['Business meeting', 'Travel plans', 'Restaurant reservation', 'Job interview'],
            correct_answer: 'Business meeting'
          }
        ],
        source_file_url: 'https://example.com/listening.mp3'
      },
      {
        title: 'Grammar Basics - Present Tense',
        description: 'Bài tập ngữ pháp về thì hiện tại',
        exercise_type: 'fill_in_blank',
        difficulty_level: 'easy',
        max_score: 80,
        time_limit_minutes: 20,
        lesson_id: null,
        questions: [
          {
            question_text: 'She _____ to work every day.',
            question_type: 'fill_in_blank',
            points: 10,
            correct_answer: 'goes'
          }
        ]
      },
      {
        title: 'IELTS Reading Comprehension',
        description: 'Bài đọc hiểu IELTS về môi trường',
        exercise_type: 'reading',
        difficulty_level: 'hard',
        max_score: 120,
        time_limit_minutes: 60,
        lesson_id: null,
        questions: [
          {
            question_text: 'According to the passage, what is the main cause of climate change?',
            question_type: 'multiple_choice',
            points: 15,
            options: ['Deforestation', 'Industrial pollution', 'Transportation', 'All of the above'],
            correct_answer: 'All of the above'
          }
        ],
        source_file_url: 'https://example.com/reading-passage.pdf'
      }
    ];

    // Add exercises using the POST API
    const results = [];
    for (const exercise of sampleExercises) {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise)
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push(result.exercise);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã thêm ${results.length} bài tập mẫu`,
      exercises: results
    });

  } catch (error) {
    console.error('Error seeding exercises:', error);
    return NextResponse.json(
      { error: 'Không thể tạo dữ liệu mẫu' },
      { status: 500 }
    );
  }
}