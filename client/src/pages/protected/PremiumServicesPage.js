import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import { motion } from 'framer-motion';

// Decorative Elements
const MysticBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
    <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
  </div>
);

// Components
const PlanFeature = ({ feature, isIncluded }) => (
  <div className="flex items-center py-2">
    <div className={`mr-4 text-xl ${isIncluded ? 'text-green-400' : 'text-gray-500'}`}>
      {isIncluded ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </div>
    <p className="text-gray-300">{feature}</p>
  </div>
);

const PricingCard = ({ plan, isPremium, ctaText, onClick, isPopular, features }) => (
  <motion.div 
    className={`w-full md:max-w-sm ${isPremium ? 'md:scale-110' : ''} rounded-xl overflow-hidden ${isPremium ? 'bg-gradient-to-b from-[#2a1045] to-[#3a1c5a]' : 'bg-white/5 backdrop-blur-sm'} border ${isPremium ? 'border-purple-500/60' : 'border-white/10'} shadow-xl relative`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: isPremium ? 0.2 : 0 }}
  >
    {isPopular && (
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <span className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          Phổ biến nhất
        </span>
      </div>
    )}
    
    <div className="p-8">
      <h3 className="text-xl font-bold text-white mb-2">{plan}</h3>
      {isPremium ? (
        <div className="mb-6">
          <span className="text-3xl font-bold text-white">99.000đ</span>
          <span className="text-purple-300 ml-1">/tháng</span>
          <p className="text-purple-300 text-sm mt-2">Hoặc 999.000đ/năm (tiết kiệm 15%)</p>
        </div>
      ) : (
        <div className="mb-6">
          <span className="text-3xl font-bold text-white">0đ</span>
          <p className="text-gray-400 text-sm mt-2">Miễn phí vĩnh viễn</p>
        </div>
      )}
      
      <div className="border-t border-white/10 my-6"></div>
      
      <div className="space-y-1">
        {features.map((feature, index) => (
          <PlanFeature key={index} feature={feature.text} isIncluded={feature.included} />
        ))}
      </div>
      
      <button 
        onClick={onClick}
        className={`mt-8 w-full py-3 px-4 rounded-lg font-medium text-center transition-all ${
          isPremium 
            ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white hover:shadow-lg hover:shadow-purple-500/30' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {ctaText}
      </button>
    </div>
  </motion.div>
);

const FeatureSection = ({ title, description, icon, bgColor, isReversed }) => (
  <motion.div 
    className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 py-12 items-center`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    viewport={{ once: true, margin: "-100px" }}
  >
    <div className="w-full md:w-1/2">
      <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center text-3xl mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-vn-tight">{title}</h3>
      <p className="text-gray-300 leading-relaxed tracking-vn-tight">{description}</p>
    </div>
    <div className="w-full md:w-1/2">
      <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${isReversed ? 'md:mr-8' : 'md:ml-8'}`}>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-[#1a0933]">
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={`https://res.cloudinary.com/dfp2ne3nn/image/upload/v1710924090/tarot_images/feature-${title.toLowerCase().split(' ').join('-')}.jpg`}
              alt={title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = "https://api-prod-minimal-v510.vercel.app/assets/images/travel/travel_1.jpg";
                e.target.onerror = null;
              }}
            />
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-white">Trải nghiệm cao cấp</h4>
          <p className="text-gray-400 text-sm mt-2">Chỉ có trong gói Premium</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-white/10 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none"
      >
        <h4 className="text-lg font-medium text-white">{question}</h4>
        <svg
          className={`w-5 h-5 text-purple-400 transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
};

// Main Component
const PremiumServicesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const isPremium = user?.is_premium;
  const navigate = useNavigate();
  
  const handleUpgradePremium = () => {
    // Chuyển hướng đến trang thanh toán
    navigate('/payment');
  };
  
  const standardFeatures = [
    { text: "Bói bài Tarot cơ bản", included: true },
    { text: "Xem 3 lá bài mỗi lần", included: true },
    { text: "Lưu 5 kết quả gần nhất", included: true },
    { text: "Tài liệu tham khảo", included: true },
    { text: "Tương thích trên nhiều thiết bị", included: true },
    { text: "Hỗ trợ qua email", included: true },
    { text: "Bói bài bằng AI", included: false },
    { text: "Bói 1 lá thông điệp hàng ngày", included: false },
    { text: "Viết nhật ký hàng ngày", included: false },
    { text: "Không giới hạn lưu kết quả", included: false },
    { text: "Báo cáo cá nhân hàng tháng", included: false },
    { text: "Ưu tiên hỗ trợ 24/7", included: false },
  ];
  
  const premiumFeatures = [
    { text: "Bói bài Tarot cơ bản", included: true },
    { text: "Xem 3 lá bài mỗi lần", included: true },
    { text: "Lưu 5 kết quả gần nhất", included: true },
    { text: "Tài liệu tham khảo", included: true },
    { text: "Tương thích trên nhiều thiết bị", included: true },
    { text: "Hỗ trợ qua email", included: true },
    { text: "Bói bài bằng AI", included: true },
    { text: "Bói 1 lá thông điệp hàng ngày", included: true },
    { text: "Viết nhật ký hàng ngày", included: true },
    { text: "Không giới hạn lưu kết quả", included: true },
    { text: "Báo cáo cá nhân hàng tháng", included: true },
    { text: "Ưu tiên hỗ trợ 24/7", included: true },
  ];
  
  const faqs = [
    {
      question: "Tôi có thể hủy đăng ký Premium bất kỳ lúc nào không?",
      answer: "Có, bạn có thể hủy đăng ký Premium bất kỳ lúc nào. Đăng ký của bạn sẽ tiếp tục cho đến khi kết thúc chu kỳ thanh toán hiện tại."
    },
    {
      question: "Chức năng bói bằng AI có gì khác biệt?",
      answer: "Bói bằng AI là tính năng cao cấp sử dụng trí tuệ nhân tạo để phân tích sâu hơn về các lá bài Tarot của bạn, cung cấp những hiểu biết sâu sắc và cá nhân hóa hơn, đồng thời cho phép bạn đặt câu hỏi cụ thể và nhận được phản hồi chi tiết."
    },
    {
      question: "Làm thế nào để tôi có thể sử dụng tính năng nhật ký hàng ngày?",
      answer: "Sau khi nâng cấp lên tài khoản Premium, tính năng nhật ký hàng ngày sẽ được mở khóa trên menu chính. Bạn có thể viết, lưu trữ và xem lại các mục nhật ký của mình bất kỳ lúc nào, kết hợp với các lá bài Tarot để ghi lại hành trình tâm linh của bạn."
    },
    {
      question: "Liệu thông tin thanh toán của tôi có an toàn không?",
      answer: "Chúng tôi sử dụng các biện pháp bảo mật tiên tiến nhất để đảm bảo thông tin thanh toán của bạn được mã hóa và bảo vệ. Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn, tất cả các giao dịch được xử lý qua các cổng thanh toán an toàn như Stripe và PayPal."
    },
    {
      question: "Tôi có thể sử dụng Premium trên nhiều thiết bị không?",
      answer: "Có, bạn có thể đăng nhập vào tài khoản Premium của mình trên nhiều thiết bị khác nhau, bao gồm điện thoại di động, máy tính bảng và máy tính để bàn. Dữ liệu của bạn sẽ được đồng bộ hóa trên tất cả các thiết bị."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Dịch Vụ Cao Cấp | Bói Tarot</title>
        <meta name="description" content="Nâng cao trải nghiệm Tarot của bạn với các tính năng Premium độc đáo. Truy cập bói bài bằng AI, nhật ký hàng ngày và nhiều tính năng cao cấp khác." />
      </Helmet>
      
      <MysticBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 md:px-8 text-center">
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-vn-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Nâng Tầm Trải Nghiệm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9370db] to-[#8a2be2]">Tarot</span> Của Bạn
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 tracking-vn-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Khám phá những tính năng cao cấp để có được những hiểu biết sâu sắc hơn về bản thân và tương lai của bạn.
          </motion.p>
          
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#plans" className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5">
              Xem Các Gói
            </a>
            <a href="#features" className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
              Tìm Hiểu Thêm
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Pricing Plan Section */}
      <section id="plans" className="relative py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-vn-tight">
              Chọn Gói Phù Hợp Với Bạn
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto tracking-vn-tight">
              So sánh các tính năng và lựa chọn gói dịch vụ phù hợp nhất với nhu cầu tâm linh của bạn.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <PricingCard
              plan="Free"
              isPremium={false}
              ctaText="Gói Hiện Tại"
              onClick={() => {}}
              isPopular={false}
              features={standardFeatures}
            />
            
            <PricingCard
              plan="Premium"
              isPremium={true}
              ctaText={isPremium ? "Gói Hiện Tại" : "Nâng Cấp Ngay"}
              onClick={handleUpgradePremium}
              isPopular={true}
              features={premiumFeatures}
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="relative py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-vn-tight">
              Tính Năng Cao Cấp
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto tracking-vn-tight">
              Khám phá chi tiết các tính năng độc quyền dành cho người dùng Premium.
            </p>
          </div>
          
          <FeatureSection
            title="Bói Bài Bằng AI"
            description="Trải nghiệm bói bài Tarot được hỗ trợ bởi trí tuệ nhân tạo, cung cấp những phân tích sâu sắc và cá nhân hóa cho từng lá bài. Hệ thống AI của chúng tôi kết hợp kiến thức Tarot truyền thống với công nghệ hiện đại để mang đến những hiểu biết độc đáo cho tình hình của bạn."
            icon="🤖"
            bgColor="bg-blue-500/20"
            isReversed={false}
          />
          
          <FeatureSection
            title="Thông Điệp Hàng Ngày"
            description="Nhận một lá bài Tarot mỗi ngày với thông điệp đặc biệt dành riêng cho bạn. Bắt đầu ngày mới với sự hướng dẫn và cảm hứng từ lá bài Tarot hàng ngày, giúp bạn định hướng và chuẩn bị tinh thần cho mỗi ngày mới."
            icon="✨"
            bgColor="bg-purple-500/20"
            isReversed={true}
          />
          
          <FeatureSection
            title="Nhật Ký Hàng Ngày"
            description="Viết, lưu trữ và theo dõi hành trình tâm linh của bạn với tính năng nhật ký cao cấp. Kết hợp các lá bài Tarot với suy nghĩ và cảm xúc của bạn để tạo ra một nhật ký tâm linh phong phú, giúp bạn theo dõi sự phát triển cá nhân theo thời gian."
            icon="📔"
            bgColor="bg-green-500/20"
            isReversed={false}
          />
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="relative py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-vn-tight">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto tracking-vn-tight">
              Những thắc mắc phổ biến về dịch vụ Premium.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            {faqs.map((faq, index) => (
              <FAQ key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] rounded-xl p-8 md:p-12 border border-purple-500/30 shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-vn-tight">Sẵn Sàng Nâng Cấp Trải Nghiệm?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 tracking-vn-tight">
              Mở khóa tất cả các tính năng cao cấp và bắt đầu hành trình tâm linh sâu sắc hơn với Tarot.
            </p>
            
            <button 
              onClick={handleUpgradePremium}
              className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5"
            >
              {isPremium ? "Quản Lý Gói Premium" : "Nâng Cấp Lên Premium"}
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PremiumServicesPage; 