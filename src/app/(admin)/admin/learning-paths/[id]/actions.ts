// Bắt buộc phải có dòng này ở đầu file để định nghĩa đây là Server Actions
'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { Database } from '@/lib/database.types';

/**
 * Hành động thêm một bài học vào một lộ trình học.
 * @param formData Dữ liệu từ form, chứa pathId và lessonId.
 */
export async function addLessonToPath(formData: FormData) {
  // Lấy dữ liệu từ các input ẩn trong form
  const pathId = formData.get('pathId') as string;
  const lessonId = formData.get('lessonId') as string;

  // Kiểm tra xem dữ liệu có hợp lệ không
  if (!pathId || !lessonId) {
    console.error('Thiếu pathId hoặc lessonId');
    return;
  }

  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    // Logic để xác định thứ tự của bài học mới:
    // 1. Đếm xem đã có bao nhiêu bài học trong lộ trình này
    const { count, error: countError } = await supabase
      .from('path_items')
      .select('*', { count: 'exact', head: true })
      .eq('path_id', pathId);

    if (countError) throw countError;

    // 2. Thứ tự mới sẽ là số lượng hiện tại + 1
    const newOrder = (count ?? 0) + 1;

    // Thêm một dòng mới vào bảng `path_items` để tạo mối liên kết
    const { error } = await supabase.from('path_items').insert({
      path_id: pathId,
      lesson_id: lessonId,
      item_order: newOrder, // Gán thứ tự cho bài học
    });

    if (error) {
      // Nếu có lỗi, in ra để debug
      console.error('Lỗi khi thêm bài học:', error);
      throw error;
    }

    // Quan trọng nhất: Báo cho Next.js biết phải làm mới (fetch lại) dữ liệu
    // cho trang chi tiết lộ trình học để cập nhật giao diện.
    revalidatePath(`/admin/learning-paths/${pathId}`);

  } catch (error) {
    console.error("Đã xảy ra lỗi trong addLessonToPath:", error);
    // Bạn có thể trả về một thông báo lỗi ở đây để hiển thị trên UI nếu muốn
  }
}

/**
 * Hành động xóa một bài học khỏi một lộ trình học.
 * @param formData Dữ liệu từ form, chứa pathItemId và pathId.
 */
export async function removeLessonFromPath(formData: FormData) {
  // Lấy dữ liệu từ các input ẩn trong form
  const pathItemId = formData.get('pathItemId') as string;
  const pathId = formData.get('pathId') as string;

  if (!pathItemId || !pathId) {
    console.error('Thiếu pathItemId hoặc pathId');
    return;
  }

  const supabase = createServerComponentClient<Database>({ cookies });

  try {
    // Xóa dòng tương ứng trong bảng `path_items`
    const { error } = await supabase
      .from('path_items')
      .delete()
      .eq('id', pathItemId);

    if (error) {
      console.error('Lỗi khi xóa bài học:', error);
      throw error;
    }

    // Quan trọng: Làm mới lại dữ liệu của trang để cập nhật giao diện
    revalidatePath(`/admin/learning-paths/${pathId}`);
    
  } catch (error) {
    console.error("Đã xảy ra lỗi trong removeLessonFromPath:", error);
  }
}