// src/app/(admin)/admin/lessons/actions.ts
'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Database } from '@/lib/database.types';

export async function createLesson(formData: FormData) {
  const title = String(formData.get('title'));
  const description = String(formData.get('description'));
  const type = String(formData.get('type'));

  if (!title || !type) {
    // Trong thực tế, bạn nên trả về lỗi để hiển thị trên UI
    console.error('Tiêu đề và loại bài học là bắt buộc.');
    return;
  }

  const supabase = createServerComponentClient<Database>({ cookies });
  const { error } = await supabase.from('lessons').insert({
    title,
    description,
    type,
  });

  if (error) {
    console.error('Lỗi khi tạo bài học:', error);
    console.error('Chi tiết lỗi:', error.message);
    // Trong thực tế, bạn nên trả về lỗi để hiển thị trên UI

    return;
  }

  // Làm mới lại trang danh sách để hiển thị bài học mới
  revalidatePath('/admin/lessons');
  // Chuyển hướng người dùng về trang danh sách
  redirect('/admin/lessons');
}

export async function deleteLesson(formData: FormData) {
  const lessonId = String(formData.get('lessonId'));

  if (!lessonId) {
    return;
  }

  const supabase = createServerComponentClient<Database>({ cookies });
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId);

  if (error) {
    console.error('Lỗi khi xóa bài học:', error);
    return;
  }

  revalidatePath('/admin/lessons');
}