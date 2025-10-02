import { NextRequest, NextResponse } from 'next/server';

// Interface cho parsed content
interface ParsedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface ParsedContent {
  title: string;
  description: string;
  questions: ParsedQuestion[];
  totalQuestions: number;
}

export async function POST(request: NextRequest) {
  try {
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

    // Mock parsing logic - trong thực tế sẽ dùng thư viện parse Word/PDF
    const mockParsedContent: ParsedContent = await mockParseFile(file);

    return NextResponse.json({
      success: true,
      data: mockParsedContent
    });

  } catch (error) {
    console.error('Lỗi khi parse file:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xử lý file' },
      { status: 500 }
    );
  }
}

// Mock function để simulate việc parse file
async function mockParseFile(file: File): Promise<ParsedContent> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  const fileName = file.name.replace(/\.(docx|pdf)$/, '');
  
  // Mock questions dựa trên file name hoặc content
  const mockQuestions: ParsedQuestion[] = [
    {
      question: "What is the main topic discussed in this document?",
      options: [
        "English Grammar",
        "TOEIC Listening",
        "Business Communication",
        "Academic Writing"
      ],
      correctAnswer: 1,
      explanation: "The document focuses on TOEIC listening strategies and techniques."
    },
    {
      question: "Which strategy is recommended for Part 1 questions?",
      options: [
        "Read all questions first",
        "Focus on visual details",
        "Listen for keywords only",
        "Skip difficult questions"
      ],
      correctAnswer: 1,
      explanation: "Focusing on visual details in the images helps predict possible answers."
    },
    {
      question: "How long should you spend on each Part 2 question?",
      options: [
        "10 seconds",
        "15 seconds",
        "20 seconds",
        "25 seconds"
      ],
      correctAnswer: 2,
      explanation: "Part 2 questions typically allow about 20 seconds per item."
    },
    {
      question: "What type of vocabulary is most important for TOEIC?",
      options: [
        "Academic vocabulary",
        "Business vocabulary",
        "Casual conversation",
        "Technical jargon"
      ],
      correctAnswer: 1,
      explanation: "TOEIC focuses heavily on business and workplace vocabulary."
    },
    {
      question: "Which part of TOEIC listening is considered most challenging?",
      options: [
        "Part 1 - Photographs",
        "Part 2 - Question-Response", 
        "Part 3 - Conversations",
        "Part 4 - Short Talks"
      ],
      correctAnswer: 3,
      explanation: "Part 4 requires understanding longer passages with more complex information."
    }
  ];

  return {
    title: fileName || "Bài tập từ file upload",
    description: `Bài tập được tạo từ file: ${file.name}. Bao gồm các câu hỏi về TOEIC listening và strategies.`,
    questions: mockQuestions,
    totalQuestions: mockQuestions.length
  };
}