import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';

// Components
const SectionTitle = memo(({ title, subtitle, centered = false }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#9370db] tracking-vn-tight">
      {title}
      <span className="block h-1 w-20 bg-gradient-to-r from-[#9370db] to-[#8a2be2] mt-2 rounded-full"></span>
    </h2>
    {subtitle && <p className="text-gray-300 leading-vn tracking-vn-tight text-lg">{subtitle}</p>}
  </div>
));

const TeamMember = memo(({ name, role, image, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8 }}
    className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl group border border-[#3a1c5a]"
  >
    <div className="relative h-64 overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x400?text=Ảnh+Chưa+Có";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0933] to-transparent opacity-0 group-hover:opacity-80 transition-opacity flex items-end">
        <div className="p-6">
          <h3 className="text-white text-xl font-bold tracking-vn-tight">{name}</h3>
          <p className="text-[#9370db] tracking-vn-tight">{role}</p>
        </div>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 tracking-vn-tight">{name}</h3>
      <p className="text-[#9370db] mb-4 tracking-vn-tight">{role}</p>
      <p className="text-gray-300 tracking-vn-tight leading-vn">{description}</p>
    </div>
  </motion.div>
));

const Milestone = memo(({ year, title, description }) => (
  <div className="relative pl-8 pb-10 border-l-2 border-[#9370db] group">
    <div className="absolute left-[-10px] top-0 w-5 h-5 rounded-full bg-[#9370db] group-hover:scale-150 transition-transform duration-300"></div>
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-purple-900/20">
      <span className="text-[#9370db] font-bold tracking-vn-tight">{year}</span>
      <h3 className="text-xl font-bold mt-1 mb-3 tracking-vn-tight">{title}</h3>
      <p className="text-gray-500 tracking-vn-tight leading-vn">{description}</p>
    </div>
  </div>
));

const TestimonialCard = memo(({ quote, author, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="mb-4">
      <svg className="h-8 w-8 text-[#9370db] opacity-50" fill="currentColor" viewBox="0 0 32 32">
        <path d="M10 8v6a6 6 0 01-6 6H8a6 6 0 016 6v-6a6 6 0 00-6-6H4a6 6 0 01-6-6v-6a6 6 0 016-6h6a6 6 0 016 6zm16 0v6a6 6 0 01-6 6h4a6 6 0 016 6v-6a6 6 0 00-6-6h-4a6 6 0 01-6-6v-6a6 0 016-6h6a6 6 0 016 6z" />
      </svg>
    </div>
    <p className="text-gray-600 mb-6 tracking-vn-tight leading-vn">{quote}</p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center text-white font-bold text-xl">
        {author.charAt(0)}
      </div>
      <div className="ml-4">
        <p className="font-bold tracking-vn-tight">{author}</p>
        <p className="text-gray-500 text-sm tracking-vn-tight">{role}</p>
      </div>
    </div>
  </div>
));

const ValueCard = memo(({ icon, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:translate-y-[-5px] hover:border-[#9370db]/30 group"
  >
    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 tracking-vn-tight group-hover:text-[#9370db] transition-colors">{title}</h3>
    <p className="text-gray-300 tracking-vn-tight leading-vn">{description}</p>
  </motion.div>
));

// Decorative Elements
const MysticBackground = memo(() => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Dynamic gradients instead of images */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9370db]/5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#8a2be2]/5 rounded-full filter blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#f0c05a]/5 rounded-full filter blur-[70px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
    
    {/* Gradient overlay for depth */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0522] via-transparent to-[#0f0522]/30 opacity-40"></div>
    
    {/* Animated stars */}
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white opacity-70"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 5}s`,
            animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
    
    {/* Vertical light beams */}
    <div className="absolute top-0 left-1/4 w-1 h-screen bg-gradient-to-b from-[#9370db]/0 via-[#9370db]/5 to-[#9370db]/0 opacity-70"></div>
    <div className="absolute top-0 right-1/3 w-2 h-screen bg-gradient-to-b from-[#8a2be2]/0 via-[#8a2be2]/3 to-[#8a2be2]/0 opacity-50"></div>
  </div>
));

// Các component mới
const TechCard = memo(({ icon, name, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-sm rounded-lg p-5 border border-[#3a1c5a] hover:border-[#9370db]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#9370db]/10"
  >
    <div className="flex items-center mb-3">
      <div className="w-12 h-12 rounded-full bg-[#2a1045] border border-[#9370db]/20 flex items-center justify-center text-2xl shadow-lg mr-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-vn-tight">{name}</h3>
    </div>
    <p className="text-gray-300 text-sm tracking-vn-tight leading-vn">{description}</p>
  </motion.div>
));

const FeatureCard = memo(({ icon, title, desc }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8 }}
    className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#9370db]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#9370db]/10 hover:-translate-y-2 cursor-pointer relative overflow-hidden group"
  >
    <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-gradient-to-tl from-[#9370db]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center mx-auto mb-4 text-2xl shadow-xl transform group-hover:scale-110 transition-transform duration-300 border border-[#9370db]/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-center group-hover:text-[#9370db] transition-colors tracking-vn-tight">{title}</h3>
    <p className="text-gray-300 text-center leading-vn">{desc}</p>
  </motion.div>
));

// Tạo component mới cho lịch sử và triết lý Tarot
const HistoryItem = memo(({ title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-sm rounded-lg p-6 border border-[#3a1c5a] hover:border-[#9370db]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#9370db]/10 relative overflow-hidden group"
  >
    <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-gradient-to-tl from-[#9370db]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-[#2a1045] border border-[#9370db]/20 flex items-center justify-center text-2xl shadow-lg mr-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-vn-tight group-hover:text-[#9370db] transition-colors">{title}</h3>
    </div>
    <p className="text-gray-300 tracking-vn-tight leading-vn">{description}</p>
  </motion.div>
));

// Tạo component mới cho cam kết
const CommitmentCard = memo(({ icon, title, desc }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8 }}
    className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#9370db]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#9370db]/10 hover:-translate-y-2 cursor-pointer relative overflow-hidden group"
  >
    <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-gradient-to-tl from-[#9370db]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center mx-auto mb-4 text-2xl shadow-xl transform group-hover:scale-110 transition-transform duration-300 border border-[#9370db]/20">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-center group-hover:text-[#9370db] transition-colors tracking-vn-tight">{title}</h3>
    <p className="text-gray-300 text-center leading-vn">{desc}</p>
  </motion.div>
));

const AboutPage = () => {
  // Thông tin thành viên nhóm
  const team = [
    {
      name: "Trần Minh Quân",
      role: "Trưởng nhóm & Full-stack Developer",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Sinh viên năm cuối ngành Công nghệ thông tin, chịu trách nhiệm quản lý dự án, phát triển back-end và front-end cho ứng dụng Bói Tarot."
    },
    {
      name: "Nguyễn Thanh Hà",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Sinh viên ngành Thiết kế Đồ họa, đam mê UI/UX, phụ trách thiết kế giao diện người dùng và trải nghiệm người dùng cho toàn bộ ứng dụng."
    },
    {
      name: "Lê Hoàng Nam",
      role: "Front-end Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Sinh viên ngành Kỹ thuật phần mềm, chuyên về phát triển front-end với React, phụ trách xây dựng các component giao diện và tối ưu hiệu suất."
    },
    {
      name: "Phạm Thị Mai",
      role: "Back-end Developer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Sinh viên năm cuối ngành Khoa học máy tính, phụ trách phát triển API, xử lý dữ liệu và triển khai cơ sở dữ liệu cho ứng dụng Bói Tarot."
    },
    {
      name: "Võ Thanh Tùng",
      role: "AI/ML Developer",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Sinh viên ngành Trí tuệ nhân tạo, phụ trách phát triển các thuật toán AI để cá nhân hóa và tăng độ chính xác trong việc đọc bài Tarot."
    }
  ];

  // Lịch sử và triết lý Tarot
  const historyItems = [
    {
      icon: "🏛️",
      title: "Nguồn gốc lịch sử",
      description: "Bài Tarot có nguồn gốc từ thế kỷ 15 tại Ý và Pháp, ban đầu là trò chơi giải trí cho giới quý tộc trước khi phát triển thành công cụ bói toán và tâm linh từ thế kỷ 18."
    },
    {
      icon: "🌌",
      title: "Biểu tượng và ý nghĩa",
      description: "Mỗi lá bài Tarot chứa đựng biểu tượng phong phú từ huyền học, chiêm tinh, giả kim thuật và tôn giáo, tạo nên ngôn ngữ trực quan mạnh mẽ để khám phá tiềm thức."
    },
    {
      icon: "🧠",
      title: "Tâm lý học Tarot",
      description: "Carl Jung đã nhìn nhận Tarot như phương tiện tiếp cận vô thức tập thể. Mỗi lá bài đại diện cho nguyên mẫu và mô hình tâm lý phổ quát của con người."
    },
    {
      icon: "🔄",
      title: "Tiến hóa hiện đại",
      description: "Từ bộ Rider-Waite cổ điển đến vô số biến thể đương đại, Tarot không ngừng phát triển phản ánh sự thay đổi của xã hội và tâm linh hiện đại."
    }
  ];

  // Cam kết của chúng mình
  const commitments = [
    {
      icon: "🔍",
      title: "Nghiên cứu chuyên sâu",
      desc: "Chúng mình dành hàng trăm giờ nghiên cứu và học hỏi từ các chuyên gia Tarot để đảm bảo nội dung chính xác và có chiều sâu"
    },
    {
      icon: "💫",
      title: "Trải nghiệm cá nhân hóa",
      desc: "Mỗi phiên đọc bài được thiết kế riêng cho bạn, kết hợp khoa học dữ liệu hiện đại và hiểu biết về biểu tượng Tarot cổ xưa"
    },
    {
      icon: "🤝",
      title: "Tính minh bạch",
      desc: "Chúng mình cam kết trung thực về cách AI hoạt động, không giấu diếm quy trình và luôn lắng nghe phản hồi để cải thiện"
    },
    {
      icon: "🛡️",
      title: "Bảo vệ quyền riêng tư",
      desc: "Thông tin cá nhân và các phiên đọc bài của bạn được bảo vệ nghiêm ngặt, không bao giờ được chia sẻ hoặc bán cho bên thứ ba"
    },
    {
      icon: "🌱",
      title: "Phát triển liên tục",
      desc: "Chúng mình không ngừng học hỏi và cải tiến, thường xuyên cập nhật nội dung và thuật toán dựa trên phản hồi của cộng đồng"
    },
    {
      icon: "❤️",
      title: "Tạo giá trị thực sự",
      desc: "Mục tiêu cuối cùng của chúng mình là tạo ra công cụ hữu ích giúp bạn hiểu rõ bản thân hơn và đưa ra quyết định sáng suốt"
    }
  ];

  const values = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>,
      title: "Sáng tạo & Đổi mới",
      description: "Chúng mình luôn tìm tòi những cách tiếp cận mới, kết hợp giữa tri thức truyền thống và công nghệ hiện đại để tạo nên trải nghiệm độc đáo."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>,
      title: "Trải nghiệm người dùng",
      description: "Chúng mình đặt trải nghiệm người dùng lên hàng đầu, tập trung vào thiết kế giao diện thân thiện, dễ sử dụng và thẩm mỹ cao."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>,
      title: "Hiệu suất & Tối ưu",
      description: "Chúng mình chú trọng tối ưu hiệu suất, đảm bảo ứng dụng hoạt động mượt mà trên mọi thiết bị và tốc độ kết nối."
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>,
      title: "Cộng đồng & Tương tác",
      description: "Chúng mình xây dựng không gian cộng đồng thân thiện, nơi người dùng có thể chia sẻ, học hỏi và tương tác với nhau."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0522] text-white relative overflow-hidden">
      <Helmet>
        <title>Về Chúng Tôi | Bói Tarot</title>
        <meta name="description" content="Tìm hiểu về dự án đồ án tốt nghiệp Bói Tarot - ứng dụng bói Tarot online kết hợp trí tuệ nhân tạo" />
      </Helmet>
      
      <MysticBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9370db] via-[#8a2be2] to-[#4e44ce] drop-shadow-[0_2px_2px_rgba(147,112,219,0.3)] tracking-vn-tight">
              Về <span>Dự Án</span> Bói Tarot
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto tracking-vn-tight leading-vn">
              Bói Tarot là đồ án tốt nghiệp của nhóm sinh viên ngành Công nghệ thông tin, 
              kết hợp giữa tri thức Tarot truyền thống và công nghệ trí tuệ nhân tạo hiện đại.
            </p>
          </div>
          
          <div className="relative">
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
                alt="Nhóm sinh viên làm việc" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/1350x600?text=Nhóm+Sinh+Viên";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a0933]/80 to-transparent flex items-center">
                <div className="max-w-md p-8">
                  <h2 className="text-3xl font-bold mb-4 tracking-vn-tight">Mục tiêu của chúng mình</h2>
                  <p className="text-gray-200 tracking-vn-tight leading-vn">
                    Tạo ra một ứng dụng Tarot hiện đại, kết hợp công nghệ AI để mang đến trải nghiệm 
                    xem bói chính xác và cá nhân hóa, đồng thời xây dựng cộng đồng những người yêu thích Tarot.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lịch sử và triết lý Tarot */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 relative tracking-vn-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">Lịch sử và </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9370db] to-[#8a2be2]">triết lý</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/80 via-white to-white"> Tarot</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#9370db] to-transparent rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {historyItems.map((item, index) => (
              <HistoryItem 
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <SectionTitle 
            title="Thành viên nhóm" 
            subtitle="Nhóm sinh viên đam mê công nghệ và Tarot phát triển ứng dụng này"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                description={member.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Cam kết của chúng mình */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 relative tracking-vn-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">Cam kết </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9370db] to-[#8a2be2]">của chúng</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/80 via-white to-white"> mình</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#9370db] to-transparent rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commitments.map((commitment, index) => (
              <CommitmentCard 
                key={index}
                icon={commitment.icon}
                title={commitment.title}
                desc={commitment.desc}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <SectionTitle 
            title="Giá trị cốt lõi" 
            subtitle="Những nguyên tắc định hướng trong quá trình phát triển dự án"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section */}
      <section className="py-20 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-md rounded-lg p-8 md:p-12 text-center border border-[#9370db]/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#9370db]/5 to-[#4e44ce]/5 transform -skew-y-6 opacity-30"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#9370db]/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 tracking-vn-tight text-[#9370db]">Bạn muốn tìm hiểu thêm?</h2>
              <p className="text-lg text-gray-300 mb-8 tracking-vn-tight leading-vn">
                Liên hệ với nhóm mình để được tư vấn chi tiết về dự án và các tính năng của ứng dụng Bói Tarot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a 
                  href="mailto:boitarot.project@gmail.com" 
                  className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight relative overflow-hidden group"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 w-full h-full bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  <span className="relative z-10">Gửi email cho nhóm mình</span>
                </motion.a>
                <motion.a 
                  href="/contact" 
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Liên hệ trực tiếp</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default memo(AboutPage);