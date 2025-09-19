// app/ielts/page.tsx
import Link from 'next/link';
import AnimateOnScroll from '@/app/components/AnimateOnScroll';

// --- Icons ---
const SpeakingIcon = () => <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>;
const WritingIcon = () => <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const RoadmapIcon = () => <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13V7m0 13a2 2 0 012-2h2a2 2 0 012 2m-4-2v-3m3 3V7m-3 13h6.586a1 1 0 00.707-.293l3.414-3.414a1 1 0 00.293-.707V5.618a1 1 0 00-1.447-.894L15 7m-3 13a2 2 0 002 2h2a2 2 0 002-2m0 0V7" /></svg>;
const PracticeTestIcon = () => <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;


export default function IeltsPage() {
  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* 1. Hero Section (Giữ nguyên) */}
      <section className="relative pt-24 md:pt-32 pb-20 text-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="absolute inset-0 -z-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              Tổng Quan Kỳ Thi <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">IELTS</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
              Tìm hiểu tất cả những gì bạn cần biết về chứng chỉ tiếng Anh quyền lực nhất thế giới.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. What is IELTS? - NỘI DUNG CHI TIẾT HƠN */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimateOnScroll className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center">IELTS là gì?</h2>
            <div className="w-24 h-1 mx-auto mt-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
            <p className="text-lg text-gray-300 mt-6 leading-relaxed">
              IELTS (International English Language Testing System) là kỳ thi tiếng Anh quốc tế phổ biến nhất, được công nhận rộng rãi tại hơn 11.000 tổ chức trên toàn thế giới. Bài thi đánh giá toàn diện 4 kỹ năng ngôn ngữ và cho điểm theo thang **band 0 - 9**. Đây là chứng chỉ không thể thiếu nếu bạn đang có kế hoạch du học, định cư hoặc làm việc tại môi trường quốc tế.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="mb-12">
            <h3 className="text-2xl font-bold mt-12 mb-6">Chi tiết các phần thi</h3>
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-pink-400">Listening (Nghe)</h4>
                  <p className="text-gray-300">Gồm 4 đoạn ghi âm hội thoại và độc thoại, bạn sẽ trả lời 40 câu hỏi. Kỹ năng yêu cầu: nghe hiểu ý chính, thông tin cụ thể, và thái độ của người nói.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-pink-400">Reading (Đọc)</h4>
                  <p className="text-gray-300">Gồm 3 đoạn văn dài trích từ sách, báo, tạp chí. Bạn sẽ trả lời 40 câu hỏi để kiểm tra kỹ năng đọc lướt, đọc chi tiết, nhận biết ý kiến và lập luận logic.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-pink-400">Writing (Viết)</h4>
                  <p className="text-gray-300">Gồm 2 phần. Task 1 yêu cầu mô tả một biểu đồ, bảng số liệu. Task 2 yêu cầu viết một bài luận học thuật về một chủ đề cho trước.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-pink-400">Speaking (Nói)</h4>
                  <p className="text-gray-300">Phỏng vấn trực tiếp 1-1 với giám khảo, gồm 3 phần: giới thiệu bản thân, trình bày về một chủ đề cụ thể và thảo luận sâu hơn về chủ đề đó.</p>
              </div>
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll>
  <h3 className="text-2xl font-bold mt-12 mb-6">Lựa chọn hình thức thi</h3>
  <div className="grid md:grid-cols-2 gap-6 text-lg">
      
      {/* Link đến trang Academic */}
      <Link href="/ielts/academic" className="block group">
          <div className="bg-gray-800/50 p-6 rounded-lg border-l-4 border-pink-500 h-full transition-all duration-300 group-hover:bg-gray-800 group-hover:shadow-xl group-hover:shadow-pink-500">
              <h4 className="font-bold">IELTS Academic (Học thuật)</h4>
              <p className="text-gray-400 text-base mt-2">Dành cho những ai muốn theo học bậc đại học, sau đại học hoặc các chương trình đào tạo chuyên môn.</p>
          </div>
      </Link>

      {/* Link đến trang General */}
      <Link href="/ielts/general" className="block group">
          <div className="bg-gray-800/50 p-6 rounded-lg border-l-4 border-orange-500 h-full transition-all duration-300 group-hover:bg-gray-800 group-hover:shadow-xl group-hover:shadow-orange-500">
              <h4 className="font-bold">IELTS General Training (Tổng quát)</h4>
              <p className="text-gray-400 text-base mt-2">Dành cho mục đích định cư, làm việc hoặc học nghề tại các quốc gia nói tiếng Anh.</p>
          </div>
      </Link>

  </div>
</AnimateOnScroll>
        </div>
      </section>

      {/* 3. Why HIDAYBETA for IELTS? - NỘI DUNG CHI TIẾT HƠN */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Công Cụ Tối Ưu Giúp Bạn Bứt Phá</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-16">
                    HIDAYBETA không chỉ cung cấp kiến thức, chúng tôi mang đến công nghệ để bạn luyện tập hiệu quả và đúng trọng tâm.
                </p>
            </AnimateOnScroll>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><RoadmapIcon/></div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Lộ Trình Cá Nhân Hóa</h3>
                    <p className="text-gray-300">Sau bài kiểm tra đầu vào, AI sẽ vạch ra lộ trình học tập hàng ngày, tập trung chính xác vào những kỹ năng và dạng bài bạn còn yếu.</p>
                </div></AnimateOnScroll>
                <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><SpeakingIcon/></div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Huấn Luyện Viên Speaking AI</h3>
                    <p className="text-gray-300">Mô phỏng một buổi thi Speaking thật, phân tích phát âm, độ trôi chảy, từ vựng và ngữ pháp, sau đó đưa ra gợi ý cải thiện chi tiết.</p>
                </div></AnimateOnScroll>
                <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><WritingIcon/></div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Trợ Lý Writing AI</h3>
                    <p className="text-gray-300">Nhận điểm số dự kiến và phân tích chuyên sâu cho cả Task 1 và Task 2 theo 4 tiêu chí chấm thi thật chỉ trong vài phút.</p>
                </div></AnimateOnScroll>
                 <AnimateOnScroll><div className="bg-gray-800/50 p-8 rounded-lg h-full">
                    <div className="mb-4"><PracticeTestIcon/></div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Thi Thử Không Giới Hạn</h3>
                    <p className="text-gray-300">Luyện tập với kho đề thi mô phỏng khổng lồ dưới áp lực thời gian thật và nhận báo cáo kết quả chi tiết sau mỗi lần làm bài.</p>
                </div></AnimateOnScroll>
            </div>
        </div>
      </section>

      {/* 4. Final CTA (Giữ nguyên) */}
      <section className="py-20">
          <div className="container mx-auto px-6 text-center">
              <AnimateOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng đạt band điểm mơ ước?</h2>
                  <Link href="/register" className="inline-block mt-4 px-10 py-4 text-lg bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                      Bắt đầu học thử miễn phí
                  </Link>
              </AnimateOnScroll>
          </div>
      </section>
    </div>
  );
}