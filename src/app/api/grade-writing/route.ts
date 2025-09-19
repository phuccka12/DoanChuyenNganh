// src/app/api/grade-writing/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { taskType, topic, essay } = await request.json();

    if (!taskType || !topic || !essay) {
      return new NextResponse('Thiếu thông tin bài làm', { status: 400 });
    }

    // PROMPT ĐÃ ĐƯỢC NÂNG CẤP ĐỂ TĂNG TÍNH NHẤT QUÁN
    const prompt = `
      Bạn là một giám khảo chấm thi IELTS Writing chuyên nghiệp. Hãy thực hiện chấm điểm theo các bước sau một cách nghiêm ngặt:
      Bước 1: Đọc kỹ đề bài và bài làm của thí sinh.
      Đề bài: "${topic}"
      Loại bài thi: ${taskType}
      Bài làm của thí sinh:
      ---
      ${essay}
      ---
      Bước 2: Phân tích và cho điểm từng tiêu chí một cách độc lập, từ 0.0 đến 9.0.
      Bước 3: Đưa ra nhận xét chung và gợi ý cải thiện cho từng tiêu chí.
      Bước 4: Tính điểm tổng thể (overall_score) bằng cách lấy trung bình cộng của 4 tiêu chí và làm tròn đến 0.5 gần nhất (ví dụ 6.25 làm tròn thành 6.5, 6.75 làm tròn thành 7.0).
      Bước 5: Trả về kết quả bằng tiếng Việt theo định dạng JSON được yêu cầu.

      QUAN TRỌNG: Chỉ trả về object JSON thuần túy, không có markdown hay bất kỳ văn bản nào khác.
      Cấu trúc JSON:
      {
        "task_achievement": { "score": number, "feedback": "Nhận xét chung về tiêu chí...", "suggestions": ["Gợi ý cụ thể 1..."] },
        "coherence_cohesion": { "score": number, "feedback": "Nhận xét chung về tiêu chí...", "suggestions": ["Gợi ý cụ thể 1..."] },
        "lexical_resource": { "score": number, "feedback": "Nhận xét chung về tiêu chí...", "suggestions": ["Gợi ý từ vựng 1..."] },
        "grammatical_range": { "score": number, "feedback": "Nhận xét chung về tiêu chí...", "suggestions": ["Chỉ ra lỗi ngữ pháp và cách sửa 1..."] },
        "overall_score": number,
        "overall_feedback": "Nhận xét tổng quan..."
      }
    `;
    
    // Thêm cấu hình để giảm tính ngẫu nhiên
    const generationConfig: GenerationConfig = {
        temperature: 0.2, // Giảm "nhiệt độ" để AI bớt sáng tạo
        topP: 1,
        topK: 1,
        maxOutputTokens: 8192,
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", generationConfig }); 
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error("Không tìm thấy nội dung JSON hợp lệ trong phản hồi của AI.");
    }
    const jsonString = text.substring(jsonStart, jsonEnd).replace(/,\s*([}\]])/g, '$1');
    return NextResponse.json(JSON.parse(jsonString));

  } catch (error) {
    console.error("GEMINI GRADING ERROR:", error);
    return new NextResponse('Lỗi nội bộ khi chấm điểm bằng Gemini', { status: 500 });
  }
}