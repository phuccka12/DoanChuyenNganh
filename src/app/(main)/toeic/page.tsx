// app/toeic/page.tsx
import Link from 'next/link';
import AnimateOnScroll from '@/app/components/AnimateOnScroll';

// --- Icons ---
const RoadmapIcon = () => <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13a2 2 0 012-2h2a2 2 0 012 2m-4-2v-3m3 3V7m-3 13h6.586a1 1 0 00.707-.293l3.414-3.414a1 1 0 00.293-.707V5.618a1 1 0 00-1.447-.894L15 7m-3 13a2 2 0 002 2h2a2 2 0 002-2m0 0V7" /></svg>;
const PracticeTestIcon = () => <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const VocabIcon = () => <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const AnalyticsIcon = () => <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.118a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 11v6zM7 8a1 1 0 011.447-.894l4 2A1 1 0 0113 10v4a1 1 0 01-1.447.894l-4-2A1 1 0 017 12V8z" /></svg>;


export default function ToeicPage() {
  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 text-center bg-gradient-to-br from-gray-800 via-blue-900 to-black">
        <div className="absolute inset-0 -z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              Nâng Tầm Sự Nghiệp Với <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">TOEIC</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
              Chứng chỉ tiếng Anh hàng đầu cho môi trường làm việc quốc tế, được công nhận bởi hàng ngàn tập đoàn toàn cầu.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. What is TOEIC? - NỘI DUNG CHI TIẾT */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimateOnScroll className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center">TOEIC là gì?</h2>
            <div className="w-24 h-1 mx-auto mt-3 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
            <p className="text-lg text-gray-300 mt-6 leading-relaxed">
              TOEIC (Test of English for International Communication) là bài thi đánh giá khả năng sử dụng tiếng Anh trong môi trường công sở và giao tiếp quốc tế. Với thang điểm **từ 10 - 990**, TOEIC là thước đo đáng tin cậy được các doanh nghiệp lớn sử dụng để tuyển dụng, bổ nhiệm và đào tạo nhân sự.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mb-12">
            <h3 className="text-2xl font-bold mt-12 mb-6">Chi tiết bài thi TOEIC (Listening & Reading)</h3>
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-sky-400">Listening (Nghe hiểu) - 45 phút, 100 câu hỏi</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li><strong>Phần 1:</strong> Mô tả tranh</li>
                      <li><strong>Phần 2:</strong> Hỏi - Đáp</li>
                      <li><strong>Phần 3:</strong> Hội thoại ngắn</li>
                      <li><strong>Phần 4:</strong> Bài nói chuyện ngắn</li>
                  </ul>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-sky-400">Reading (Đọc hiểu) - 75 phút, 100 câu hỏi</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li><strong>Phần 5:</strong> Hoàn thành câu</li>
                      <li><strong>Phần 6:</strong> Hoàn thành đoạn văn</li>
                      <li><strong>Phần 7:</strong> Đọc hiểu đoạn văn đơn và đa đoạn</li>
                  </ul>
              </div>
            </div>
             <p className="text-sm text-gray-500 mt-6">
              *Ngoài ra còn có bài thi TOEIC Speaking & Writing và TOEIC Bridge để đáp ứng các nhu cầu đánh giá khác.
            </p>
          </AnimateOnScroll>
        </div>
      </section>
      
      {/* 3. Why HIDAYBETA for TOEIC? - NỘI DUNG CHI TIẾT */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Chiến Lược Chinh Phục Điểm Số Cùng AI</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-16">
                    HIDAYBETA cung cấp các công cụ thông minh giúp bạn luyện tập đúng trọng tâm và tối ưu hóa điểm số.
                </p>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><RoadmapIcon/></div>
                    <h3 className="text-xl font-bold text-sky-400 mb-2">Lộ Trình Theo Mục Tiêu</h3>
                    <p className="text-gray-300">Dù mục tiêu của bạn là 600+ hay 900+, AI sẽ xây dựng kế hoạch học tập chi tiết, giúp bạn đạt được mục tiêu nhanh nhất.</p>
                </div></AnimateOnScroll>
                <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><PracticeTestIcon/></div>
                    <h3 className="text-xl font-bold text-sky-400 mb-2">Thi Thử Như Thật</h3>
                    <p className="text-gray-300">Làm quen với áp lực 200 câu hỏi trong 120 phút qua các bài thi mô phỏng có cấu trúc và độ khó tương đương bài thi thật.</p>
                </div></AnimateOnScroll>
                <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><VocabIcon/></div>
                    <h3 className="text-xl font-bold text-sky-400 mb-2">Từ Vựng Kinh Doanh</h3>
                    <p className="text-gray-300">Tập trung vào các bộ từ vựng thường xuất hiện trong môi trường công sở, email, cuộc họp, giúp bạn học đúng, dùng trúng.</p>
                </div></AnimateOnScroll>
                 <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><AnalyticsIcon/></div>
                    <h3 className="text-xl font-bold text-sky-400 mb-2">Phân Tích Điểm Yếu</h3>
                    <p className="text-gray-300">Sau mỗi bài thi, AI sẽ chỉ ra chính xác bạn hay sai ở dạng câu hỏi nào (Part 3, Part 7,...) để bạn có chiến lược ôn tập phù hợp.</p>
                </div></AnimateOnScroll>
            </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-20">
          <div className="container mx-auto px-6 text-center">
              <AnimateOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng mở khóa cơ hội nghề nghiệp?</h2>
                  <Link href="/register" className="inline-block mt-4 px-10 py-4 text-lg bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                      Bắt đầu học thử miễn phí
                  </Link>
              </AnimateOnScroll>
          </div>
      </section>
    </div>
  );
}