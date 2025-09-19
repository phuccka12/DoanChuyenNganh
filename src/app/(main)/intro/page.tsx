// app/intro/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/app/components/AnimateOnScroll';

// --- Icons (Giữ nguyên) ---
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
);
const RocketIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
);

export default function IntroPage() {
  // THAY ĐỔI 1: Thêm thành viên thứ 4 vào mảng
  const teamMembers = [
    { name: 'Cao Bảo Phúc', role: 'Founder & AI Specialist', image: '/member1.png' },
    { name: 'Nguyễn Thành Vinh', role: 'Head of Academics ', image: '/member2.png' },
    { name: 'Dương Gia Quốc Bảo', role: 'Lead Software Engineer', image: '/member3.png' },
    { name: 'Giang Vạn Lộc ', role: 'Product Manager', image: '/member4.png' }, // <-- Thành viên mới
  ];

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      {/* ... (Các section Hero, Our Story, Features giữ nguyên) ... */}
       {/* 1. Hero Section */}
       <section className="relative py-20 md:py-32 text-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 -z-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <AnimateOnScroll>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Định Nghĩa Lại Tương Lai Học Tập
            </h1>
            <p> </p>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
              Tại HIDAYBETA, chúng tôi tin rằng mỗi học viên là một cá thể độc đáo với tiềm năng vô hạn. Sứ mệnh của chúng tôi là phá vỡ rào cản của phương pháp học truyền thống, mang đến kỷ nguyên nơi công nghệ AI không chỉ là công cụ, mà là người bạn đồng hành thông minh và thấu hiểu trên con đường chinh phục IELTS của bạn.
            </p>

            <Link href="/register" className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105">
              Khám phá lộ trình của bạn
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Câu Chuyện Của Chúng Tôi</h2>
            <div className="w-24 h-1 mx-auto mt-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
            <p className="max-w-3xl mx-auto text-lg text-gray-300 mt-6">
              HIDAYBETA ra đời từ trăn trở của những người đã từng vật lộn trên hành trình ôn luyện IELTS. Chúng tôi thấy những nỗ lực chưa được đền đáp xứng đáng chỉ vì thiếu một lộ trình phù hợp. Vì vậy, chúng tôi quyết tâm tạo ra một nền tảng nơi công nghệ AI tiên tiến nhất gặp gỡ chuyên môn giáo dục sâu sắc, để mỗi giờ học của bạn đều là một bước tiến vững chắc.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Giá Trị Cốt Lõi</h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimateOnScroll>
              <div className="text-center p-8 bg-gray-800/50 rounded-lg h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500">
                <BrainIcon />
                <h3 className="text-xl font-bold mb-2">Cá Nhân Hóa Tối Đa</h3>
                <p className="text-gray-400">AI hoạt động như một gia sư riêng, liên tục điều chỉnh và tối ưu hóa lộ trình học để bạn đạt hiệu quả cao nhất trong thời gian ngắn nhất.</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll> 
              <div className="text-center p-8 bg-gray-800/50 rounded-lg h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500">
                <BookIcon />
                <h3 className="text-xl font-bold mb-2">Nội Dung Chuyên Sâu</h3>
                <p className="text-gray-400">Từ vựng, ngữ pháp, và các dạng bài thi được biên soạn bởi các chuyên gia hàng đầu, giúp bạn tự tin đối mặt với mọi thử thách trong phòng thi.</p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll>
              <div className="text-center p-8 bg-gray-800/50 rounded-lg h-full transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500 ">
                <RocketIcon />
                <h3 className="text-xl font-bold mb-2">Phản Hồi Tức Thì</h3>
                <p className="text-gray-400">Nhận được phân tích và chấm chữa chi tiết cho bài Nói và Viết bằng AI chỉ trong vài phút, giúp bạn nhận ra lỗi sai và cải thiện nhanh chóng.</p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 4. Team Section (Đã cập nhật cho 4 người) */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <AnimateOnScroll className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Gặp Gỡ Đội Ngũ</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-300 mt-4">
              Chúng tôi là sự kết hợp giữa các chuyên gia công nghệ, nhà giáo dục và những người đam mê thay đổi cách thế giới học tập.
            </p>
          </AnimateOnScroll>
          {/* THAY ĐỔI 2: Chỉnh lại grid layout để hiển thị 4 cột trên màn hình lớn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <AnimateOnScroll key={index}>
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-pink-400">{member.role}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hành trình ngàn dặm bắt đầu bằng một cú click.</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
                Đừng để hành trình IELTS của bạn là một cuộc chiến đơn độc. Hãy để HIDAYBETA trở thành đồng minh AI đắc lực nhất của bạn.
            </p>
            <Link href="/register" className="inline-block px-8 py-4 text-lg bg-white text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                Bắt đầu học miễn phí
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}