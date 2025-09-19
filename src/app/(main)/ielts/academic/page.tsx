// app/ielts/academic/page.tsx
import Link from 'next/link';
import AnimateOnScroll from '@/app/components/AnimateOnScroll'; // Chú ý đường dẫn src/appsrc/app

export default function IeltsAcademicPage() {
  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 text-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="relative z-10 container mx-auto px-6">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              IELTS <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">Academic</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
              Chìa khóa mở cánh cửa tri thức tại các trường đại học hàng đầu thế giới.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Content Section */}

        
      
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimateOnScroll className="mb-12">
            <h2 className="text-3xl font-bold">Dành cho ai?</h2>
            <p className="text-lg text-gray-300 mt-4 leading-relaxed">
              Kỳ thi IELTS Academic được thiết kế đặc biệt cho những bạn có mục tiêu **du học** ở bậc đại học, sau đại học hoặc đăng ký vào các tổ chức học thuật chuyên nghiệp.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <h3 className="text-2xl font-bold mt-12 mb-6">Điểm khác biệt chính</h3>
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-pink-400">Reading (Đọc)</h4>
                  <p className="text-gray-300">Bạn sẽ đọc 3 đoạn văn dài, phức tạp được trích từ sách, báo cáo, tạp chí học thuật. Các bài đọc đòi hỏi khả năng phân tích, suy luận và nắm bắt các ý tưởng trừu tượng.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-pink-400">Writing (Viết)</h4>
                  <p className="text-gray-300"><strong>Task 1:</strong> Yêu cầu bạn phân tích và mô tả thông tin từ một biểu đồ, bảng, hoặc sơ đồ. <br/> <strong>Task 2:</strong> Viết một bài luận học thuật để trình bày quan điểm về một vấn đề xã hội.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6 text-center">
              <AnimateOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Bắt đầu lộ trình Academic của bạn</h2>
                  <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
                      HIDAYBETA sẽ giúp bạn làm chủ các dạng bài học thuật khó nhất với công nghệ AI.
                  </p>
                  <Link href="/register" className="inline-block mt-4 px-10 py-4 text-lg bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                      Kiểm tra đầu vào miễn phí
                  </Link>
              </AnimateOnScroll>
          </div>
      </section>
    </div>
  );
}