// src/app/dashboard/writing/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- Cập nhật lại kiểu dữ liệu ---
interface FeedbackDetail {
  score: number;
  feedback: string;
  suggestions: string[]; // Thêm mảng gợi ý
}
interface GradingResult {
  task_achievement: FeedbackDetail;
  coherence_cohesion: FeedbackDetail;
  lexical_resource: FeedbackDetail;
  grammatical_range: FeedbackDetail;
  overall_score: number;
  overall_feedback: string;
}

// --- Component AccordionItem đã được nâng cấp ---
const AccordionItem = ({ title, score, feedback, suggestions, isOpen, onClick }: { title: string; score: number; feedback: string; suggestions: string[]; isOpen: boolean; onClick: () => void; }) => (
  <div className="border-b border-gray-700">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 transition-colors"
    >
      <span className="font-semibold text-lg">{title}</span>
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold text-cyan-400">{score.toFixed(1)}</span>
        <svg className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
      <div className="p-4 border-t border-gray-700">
        <h4 className="font-semibold text-gray-200 mb-2">Nhận xét chung:</h4>
        <p className="text-gray-400 mb-4">{feedback}</p>
        
        <h4 className="font-semibold text-gray-200 mb-2">Gợi ý cải thiện:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-400">
            {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
            ))}
        </ul>
      </div>
    </div>
  </div>
);

export default function WritingGraderPage() {
  const [taskType, setTaskType] = useState('Task 2');
  const [topic, setTopic] = useState('');
  const [essay, setEssay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [error, setError] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch('/api/grade-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskType, topic, essay }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi từ server: ${response.statusText}`);
      }

      const data: GradingResult = await response.json();
      setResult(data);
      setOpenAccordion('ta'); // Tự động mở mục đầu tiên
    } catch (err: unknown) {
      let errorMessage = 'Không thể chấm điểm. Vui lòng thử lại sau.';
      if (err instanceof Error) {
        errorMessage += ' ' + err.message;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">&larr; Quay lại Dashboard</Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">AI Chấm điểm Writing</h1>
          <p className="text-lg text-gray-400">Nhận phân tích chi tiết cho bài luận của bạn trong vài giây.</p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg space-y-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Loại bài thi</label>
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full bg-black/20 rounded-lg h-12 px-4">
                <option value="Task 2">Task 2</option>
                <option value="Task 1">Task 1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Đề bài (Topic)</label>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={10} className="w-full bg-black/20 rounded-lg p-4" placeholder="Dán đề bài..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bài làm của bạn</label>
              <textarea value={essay} onChange={(e) => setEssay(e.target.value)} rows={10} className="w-full bg-black/20 rounded-lg p-4" placeholder="Dán bài luận..."></textarea>
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={isLoading} className="w-full h-12 font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {isLoading ? 'AI đang chấm điểm...' : 'Chấm điểm ngay'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-lg min-h-full">
          <h2 className="text-2xl font-bold mb-4">Kết quả phân tích</h2>
          {isLoading && <p>AI đang phân tích bài làm của bạn, vui lòng chờ trong giây lát...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {result && (
            <div className="space-y-6">
              <div className="text-center bg-gray-700/50 p-6 rounded-lg">
                <p className="text-sm text-gray-400">BAND ĐIỂM DỰ KIẾN</p>
                <p className="text-6xl font-black text-pink-400">{result.overall_score.toFixed(1)}</p>
                <p className="mt-4 text-gray-300">{result.overall_feedback}</p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg">
                <AccordionItem title="Task Achievement" score={result.task_achievement.score} feedback={result.task_achievement.feedback} suggestions={result.task_achievement.suggestions} isOpen={openAccordion === 'ta'} onClick={() => toggleAccordion('ta')} />
                <AccordionItem title="Coherence & Cohesion" score={result.coherence_cohesion.score} feedback={result.coherence_cohesion.feedback} suggestions={result.coherence_cohesion.suggestions} isOpen={openAccordion === 'cc'} onClick={() => toggleAccordion('cc')} />
                <AccordionItem title="Lexical Resource" score={result.lexical_resource.score} feedback={result.lexical_resource.feedback} suggestions={result.lexical_resource.suggestions} isOpen={openAccordion === 'lr'} onClick={() => toggleAccordion('lr')} />
                <AccordionItem title="Grammar" score={result.grammatical_range.score} feedback={result.grammatical_range.feedback} suggestions={result.grammatical_range.suggestions} isOpen={openAccordion === 'gr'} onClick={() => toggleAccordion('gr')} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}