// src/app/(admin)/admin/lessons/[lessonId]/edit/actions.ts
'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/lib/database.types';

export async function updateLessonDetails(formData: FormData) {
  const lessonId = String(formData.get('lessonId'));
  const title = String(formData.get('title'));
  const description = String(formData.get('description'));

  if (!lessonId || !title) {
    return { error: 'Thiếu thông tin cần thiết.' };
  }

  const supabase = createServerComponentClient<Database>({ cookies });

  const { error } = await supabase
    .from('lessons')
    .update({
      title,
      description,
    })
    .eq('id', lessonId);

  if (error) {
    console.error('Lỗi khi cập nhật bài học:', error);
    // Cần xử lý lỗi này ở phía client nếu muốn hiển thị thông báo
    return { error: error.message };
  }

  // Làm mới lại dữ liệu của trang editor này và cả trang danh sách
  revalidatePath(`/admin/lessons/${lessonId}/edit`);
  revalidatePath('/admin/lessons');
} 

export async function createSection(formData: FormData) {
  const lessonId = String(formData.get('lessonId'));
  const title = String(formData.get('title'));
  const type = String(formData.get('type'));
  const content = String(formData.get('content'));

  if (!lessonId || !title || !type) {
    return { error: 'Thiếu thông tin cần thiết.' };
  }

  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    // Lấy thứ tự (order) cho section mới
    const { count, error: countError } = await supabase
      .from('test_sections')
      .select('*', { count: 'exact', head: true })
      .eq('lesson_id', lessonId);

    if (countError) throw countError;

    const newOrder = (count ?? 0) + 1;

    // Chèn section mới vào database
    const { error } = await supabase.from('test_sections').insert({
      lesson_id: lessonId,
      title,
      type,
      content,
      order: newOrder,
    });

    if (error) throw error;

    revalidatePath(`/admin/lessons/${lessonId}/edit`);
  } catch (error: any) {
    console.error('Lỗi khi tạo section:', error);
    return { error: error.message };
  }
} 

// src/app/(admin)/admin/lessons/[lessonId]/edit/actions.ts

export async function createQuestion(formData: FormData) {
  console.log('--- Server Action: createQuestion BẮT ĐẦU ---');

  const lessonId = String(formData.get('lessonId'));
  const sectionId = String(formData.get('sectionId'));
  const questionText = String(formData.get('question_text'));
  const optionsText = String(formData.get('options'));
  const correctAnswer = String(formData.get('correct_answer'));

  console.log('Dữ liệu nhận được từ Form:', { lessonId, sectionId, questionText, optionsText, correctAnswer });

  if (!sectionId || !lessonId || !questionText || !optionsText || !correctAnswer) {
    console.error('LỖI: Thiếu thông tin. Action dừng lại.');
    return { error: 'Vui lòng điền đầy đủ thông tin cho câu hỏi.' };
  }

  const options = optionsText.split('\n').map((opt, index) => {
    const label = String.fromCharCode(65 + index);
    return { label: label, text: opt.trim() };
  }).filter(opt => opt.text);

  console.log('Đã xử lý Options thành JSON:', options);

  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    console.log('Đang chuẩn bị lấy số thứ tự (order)...');
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('section_id', sectionId);

    if (countError) throw countError;
    const newOrder = (count ?? 0) + 1;
    console.log('Thứ tự mới cho câu hỏi là:', newOrder);

    console.log('Đang chèn câu hỏi vào Supabase...');
    const { error } = await supabase.from('questions').insert({
      section_id: sectionId,
      question_text: questionText,
      options: options,
      correct_answer: correctAnswer.toUpperCase(),
      order: newOrder,
    });

    if (error) {
      // Dòng này cực kỳ quan trọng
      console.error('!!! LỖI TỪ SUPABASE KHI INSERT:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Chèn câu hỏi THÀNH CÔNG.');
    revalidatePath(`/admin/lessons/${lessonId}/edit`);
  } catch (error: any) {
    console.error('!!! ĐÃ XẢY RA LỖI TRONG KHỐI TRY-CATCH:', JSON.stringify(error, null, 2));
    return { error: error.message };
  }
  console.log('--- Server Action: createQuestion KẾT THÚC ---');
}