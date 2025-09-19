// src/app/api/import-lessons/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Papa from 'papaparse';

type ParsedRow = {
  section_type: string;
  section_title: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
};

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const lessonId = formData.get('lessonId') as string;

  if (!file) {
    return new NextResponse('Không có file', { status: 400 });
  }

  const fileText = await file.text();

  // Dùng papaparse để chuyển CSV thành JSON
  const parsed = Papa.parse(fileText, {
    header: true,
    skipEmptyLines: true,
  });

  // Xử lý dữ liệu đã parse
  try {
    for (const row of parsed.data as ParsedRow[]) {
      // 1. Tìm hoặc tạo section
      let { data: section } = await supabase
        .from('test_sections')
        .select('id')
        .eq('lesson_id', lessonId)
        .eq('type', row.section_type)
        .eq('title', row.section_title)
        .single();

      if (!section) {
        const { data: newSection, error } = await supabase
          .from('test_sections')
          .insert({ lesson_id: lessonId, type: row.section_type, title: row.section_title })
          .select('id')
          .single();
        if (error) throw error;
        section = newSection;
      }

      // 2. Thêm câu hỏi vào section đó
      const { error: questionError } = await supabase
        .from('questions')
        .insert({
          section_id: section!.id,
          question_text: row.question_text,
          options: { A: row.option_a, B: row.option_b, C: row.option_c, D: row.option_d },
          correct_answer: row.correct_answer,
          question_type: 'multiple_choice'
        });

      if (questionError) throw questionError;
    }

    return NextResponse.json({ message: 'Import thành công' });

  } catch (error: unknown) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return new NextResponse('Lỗi khi xử lý file: ' + errorMessage, { status: 500 });
  }
}