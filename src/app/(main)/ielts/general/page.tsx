// app/ielts/general/page.tsx
import Link from 'next/link';
import AnimateOnScroll from '@/app/components/AnimateOnScroll'; // Chú ý đường dẫn src/appsrc/app

export default function IeltsGeneralPage() {
  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 text-center bg-gradient-to-br from-gray-900 via-orange-900 to-black">
        <div className="relative z-10 container mx-auto px-6">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              IELTS <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">General Training</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
              Công cụ thiết yếu cho kế hoạch định cư, làm việc và hòa nhập cuộc sống mới.
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
              Kỳ thi IELTS General Training phù hợp cho những ai có mục tiêu **định cư, làm việc** hoặc tham gia các chương trình đào tạo nghề, không yêu cầu cao về học thuật.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <h3 className="text-2xl font-bold mt-12 mb-6">Điểm khác biệt chính</h3>
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-orange-400">Reading (Đọc)</h4>
                  <p className="text-gray-300">Bạn sẽ đọc các đoạn văn ngắn hơn, lấy từ các nguồn thực tế như thông báo, quảng cáo, sách hướng dẫn. Nội dung tập trung vào các tình huống sinh tồn xã hội và môi trường làm việc.</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-lg">
                  <h4 className="font-bold text-xl mb-2 text-orange-400">Writing (Viết)</h4>
                  <p className="text-gray-300"><strong>Task 1:</strong> Yêu cầu bạn viết một lá thư (thân mật, trang trọng hoặc bán trang trọng) để hỏi thông tin hoặc giải thích một tình huống. <br/> <strong>Task 2:</strong> Viết một bài luận ngắn về một chủ đề chung.</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6 text-center">
              <AnimateOnScroll>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng cho cuộc sống mới?</h2>
                  <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
                      HIDAYBETA sẽ giúp bạn tự tin sử dụng tiếng Anh trong các tình huống đời thực.
                  </p>
                  <Link href="/register" className="inline-block mt-4 px-10 py-4 text-lg bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                      Bắt đầu ngay hôm nay
                  </Link>
              </AnimateOnScroll>
          </div>
      </section>
    </div>
  );
}