import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ensure Node.js runtime (required for using the Service Role key securely)
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use service role on server if available (allows creating bucket if missing)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Prefer service role key for server-side operations
const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey);
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'exercise-files';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !(serviceRoleKey || anonKey)) {
      return NextResponse.json(
        { error: 'Thiếu cấu hình Supabase. Vui lòng kiểm tra NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chỉ hỗ trợ file Word (.docx) và PDF' },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File không được vượt quá 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Sanitize original filename: remove diacritics and invalid characters for Storage key
    const originalName = file.name;
    const lastDot = originalName.lastIndexOf('.');
    const base = (lastDot > -1 ? originalName.slice(0, lastDot) : originalName)
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // remove diacritics
      .replace(/[^a-zA-Z0-9-_\. ]/g, '') // remove unsafe chars except space, dash, underscore, dot
      .trim()
      .replace(/\s+/g, '-');
    const ext = lastDot > -1 ? originalName.slice(lastDot).toLowerCase() : '';
    const safeName = `${base}${ext}`;
    const uniqueFileName = `${timestamp}-${safeName}`;

    // Prepare body and content type
    const arrayBuffer = await file.arrayBuffer();
    const contentType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    // Try upload first
    let uploadRes = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, arrayBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType
      });

    // If bucket not found, optionally create (requires service role) then retry once
    if (uploadRes.error && /bucket.*not.*found|Not Found|not exist/i.test(uploadRes.error.message)) {
      if (!serviceRoleKey) {
        return NextResponse.json(
          { error: `Bucket '${BUCKET_NAME}' chưa tồn tại. Hãy tạo bucket trong Supabase Storage hoặc đặt biến SUPABASE_SERVICE_ROLE_KEY để tự tạo tự động.` },
          { status: 400 }
        );
      }
      const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024
      });
      if (createErr && !/already exists|exists/i.test(createErr.message)) {
        return NextResponse.json(
          { error: `Không thể tạo bucket '${BUCKET_NAME}': ${createErr.message}` },
          { status: 500 }
        );
      }
      // retry upload once
      uploadRes = await supabase.storage
        .from(BUCKET_NAME)
        .upload(uniqueFileName, arrayBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType
        });
    }

    if (uploadRes.error) {
      console.error('Upload error:', uploadRes.error);
      // Map common permission errors to 4xx
      const message = uploadRes.error.message;
      const status = /permission|not allowed|unauthorized|Forbidden/i.test(message) ? 403 : 500;
      return NextResponse.json(
        { error: `Không thể upload file: ${message}` },
        { status }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueFileName);

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileSize: file.size,
        filePath: uploadRes.data.path,
        publicUrl: publicUrlData.publicUrl,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Lỗi khi upload file:', error);
    return NextResponse.json(
      { error: `Có lỗi xảy ra khi upload file: ${error instanceof Error ? error.message : 'Không xác định'}` },
      { status: 500 }
    );
  }
}