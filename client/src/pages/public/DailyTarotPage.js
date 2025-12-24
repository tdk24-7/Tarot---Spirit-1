import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';

// Components
const SectionTitle = memo(({ title, subtitle, centered = false, light = true }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-[#9370db]' : 'text-white'} tracking-vn-tight`}>
      {title}
      <span className="block h-1 w-20 bg-gradient-to-r from-[#9370db] to-[#8a2be2] mt-2 rounded-full"></span>
    </h2>
    {subtitle && <p className={`${light ? 'text-gray-600' : 'text-gray-300'} leading-vn tracking-vn-tight text-lg`}>{subtitle}</p>}
  </div>
));

const TarotCard = memo(({ isFlipped, isRevealed, onClick, cardData, isLoading }) => {
  return (
    <div 
      className={`w-64 h-96 perspective-1000 cursor-pointer transform transition-transform duration-300 ${isRevealed ? 'hover:scale-105' : 'hover:translate-y-[-10px]'}`} 
      onClick={onClick}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Card Back */}
        <div className={`absolute w-full h-full backface-hidden rounded-xl shadow-2xl ${isFlipped ? 'invisible' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#3a1c5a] to-[#1a0933] rounded-xl"></div>
          <div className="absolute inset-[2px] bg-gradient-to-br from-[#2a1045] to-[#0f051d] rounded-[10px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-twinkle"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.8s' }}></div>
            </div>
            <div className="w-20 h-20 border-4 border-[#9370db] rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#9370db] to-[#8a2be2] rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-white tracking-vn-tight">T</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Front */}
        <div className={`absolute w-full h-full backface-hidden rounded-xl shadow-2xl rotate-y-180 overflow-hidden ${!isFlipped ? 'invisible' : ''}`}>
          {isLoading ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a1c5a] to-[#1a0933] rounded-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9370db]"></div>
            </div>
          ) : (
            <>
              <img 
                src={cardData?.imageSrc} 
                alt={cardData?.name} 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x600?text=Tarot+Card";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold tracking-vn-tight">{cardData?.name}</h3>
                <p className="text-gray-300 text-sm tracking-vn-tight">{cardData?.vietnameseName}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const DailyMessage = memo(({ date, cardData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-white/10 rounded-full w-1/2 mb-4"></div>
        <div className="h-4 bg-white/10 rounded-full w-3/4 mb-2"></div>
        <div className="h-4 bg-white/10 rounded-full w-5/6 mb-2"></div>
        <div className="h-4 bg-white/10 rounded-full w-2/3 mb-6"></div>
        <div className="h-28 bg-white/5 rounded-xl w-full"></div>
      </div>
    );
  }

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-vn-tight">{cardData?.name} ({cardData?.vietnameseName})</h2>
        <p className="text-gray-400 tracking-vn-tight">{formatDate()}</p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4 text-[#9370db] tracking-vn-tight">Thông điệp hàng ngày</h3>
        <p className="text-gray-300 tracking-vn-tight leading-vn mb-4">{cardData?.dailyMessage}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-[#9370db]/20 text-[#9370db] px-3 py-1 rounded-full text-sm tracking-vn-tight">
            Từ khóa: {cardData?.keywords.join(', ')}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-xl">
          <h4 className="text-lg font-bold mb-2 text-[#9370db] tracking-vn-tight">Tình yêu</h4>
          <p className="text-gray-300 text-sm tracking-vn-tight leading-vn">{cardData?.loveMessage}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-xl">
          <h4 className="text-lg font-bold mb-2 text-[#9370db] tracking-vn-tight">Sự nghiệp</h4>
          <p className="text-gray-300 text-sm tracking-vn-tight leading-vn">{cardData?.careerMessage}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-xl">
          <h4 className="text-lg font-bold mb-2 text-[#9370db] tracking-vn-tight">Sức khỏe</h4>
          <p className="text-gray-300 text-sm tracking-vn-tight leading-vn">{cardData?.healthMessage}</p>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Link 
          to="/tarot-readings" 
          className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
        >
          Xem bói chi tiết
        </Link>
        <button 
          className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=Lá bài Tarot hôm nay của tôi: ${cardData?.name} - ${cardData?.vietnameseName}. Xem ngay tại BóiTarot.vn!`, '_blank')}
        >
          Chia sẻ
        </button>
      </div>
    </div>
  );
});

// Decorative Elements
const MysticBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
    <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
  </div>
));

const Moon = memo(() => (
  <div className="absolute top-40 right-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-300 to-white shadow-2xl animate-float-y opacity-60 hidden md:block">
    <div className="absolute top-[10%] left-[20%] w-4 h-4 rounded-full bg-gray-400/30"></div>
    <div className="absolute top-[30%] right-[20%] w-6 h-6 rounded-full bg-gray-400/30"></div>
    <div className="absolute bottom-[25%] left-[35%] w-5 h-5 rounded-full bg-gray-400/30"></div>
  </div>
));

const DailyTarotPage = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todayCard, setTodayCard] = useState(null);
  
  // Sample data - would normally come from API/database
  const cardData = {
    id: 7,
    name: "The Star",
    vietnameseName: "Ngôi Sao",
    imageSrc: "https://api-prod-minimal-v510.vercel.app/assets/images/travel/travel_7.jpg",
    category: "Major Arcana",
    description: "The Star represents hope, faith, purpose, renewal, spirituality and feelings of inspiration.",
    keywords: ["Hy vọng", "Niềm tin", "Cảm hứng", "Sự đổi mới", "Tâm linh"],
    dailyMessage: "Hôm nay là ngày của hy vọng và niềm tin. Ngôi Sao xuất hiện nhắc nhở bạn rằng sau những khó khăn luôn có ánh sáng đang chờ đợi. Hãy giữ vững niềm tin vào bản thân và những điều tốt đẹp sẽ đến. Đây là thời điểm lý tưởng để chữa lành những tổn thương và nhìn về tương lai với hy vọng mới.",
    loveMessage: "Trong tình yêu, Ngôi Sao mang đến sự lạc quan và niềm tin. Nếu bạn đang độc thân, đây có thể là thời điểm gặp gỡ một người đặc biệt. Với các cặp đôi, hãy cùng nhau chia sẻ ước mơ và khám phá những điều mới mẻ.",
    careerMessage: "Về sự nghiệp, đây là lúc để theo đuổi đam mê và tìm kiếm cảm hứng mới. Những ý tưởng sáng tạo sẽ xuất hiện, và bạn có cơ hội để tỏa sáng trong công việc. Hãy tin tưởng vào con đường bạn đã chọn.",
    healthMessage: "Sức khỏe tinh thần của bạn sẽ được cải thiện đáng kể. Hãy dành thời gian để thư giãn, thiền định và kết nối với bản thân. Các hoạt động ngoài trời và gần gũi với thiên nhiên sẽ mang lại năng lượng tích cực."
  };

  const handleCardClick = () => {
    if (!isCardFlipped) {
      setIsCardFlipped(true);
      setIsLoading(true);
      
      // Simulate loading for demo purposes
      setTimeout(() => {
        setIsLoading(false);
        setTodayCard(cardData);
        setIsCardRevealed(true);
      }, 1500);
    }
  };

  // Generate random card for demo purposes
  useEffect(() => {
    // In a real app, we would fetch the daily card from an API
    // Here we're just setting it directly for demo
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Tarot Hàng Ngày | Bói Tarot</title>
        <meta name="description" content="Khám phá lá bài Tarot hàng ngày của bạn và thông điệp cho ngày hôm nay về tình yêu, sự nghiệp, và sức khỏe." />
      </Helmet>
      
      <MysticBackground />
      <Moon />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-vn-tight">
              Tarot <span className="text-[#9370db]">Hàng Ngày</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto tracking-vn-tight leading-vn">
              Khám phá thông điệp từ bài Tarot dành riêng cho bạn ngày hôm nay. Sự hướng dẫn và những lời khuyên cho cuộc sống hàng ngày.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            {/* Card Area */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <TarotCard 
                isFlipped={isCardFlipped}
                isRevealed={isCardRevealed}
                onClick={handleCardClick}
                cardData={todayCard}
                isLoading={isLoading}
              />
            </div>
            
            {/* Message Area */}
            <div className="flex-1">
              {!isCardFlipped ? (
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 tracking-vn-tight">Lá bài của bạn đang chờ đợi</h2>
                  <p className="text-gray-300 mb-8 tracking-vn-tight leading-vn">
                    Tập trung vào những điều bạn đang trăn trở và nhấp vào lá bài để nhận thông điệp dành cho bạn ngày hôm nay.
                  </p>
                  <button 
                    onClick={handleCardClick}
                    className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
                  >
                    Lật bài
                  </button>
                </div>
              ) : (
                <DailyMessage 
                  date={new Date()} 
                  cardData={todayCard}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Previous Readings Section */}
      <section className="py-16 px-4 md:px-8 relative bg-[#1a0933]/80">
        <div className="container mx-auto max-w-5xl relative z-10">
          <SectionTitle 
            title="Lịch sử Tarot Hàng Ngày" 
            subtitle="Xem lại những lá bài và thông điệp bạn đã nhận được trong những ngày trước"
            centered
            light={false}
          />
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#2a1045]">
                  <th className="py-3 px-4 text-left text-sm font-medium tracking-vn-tight">Ngày</th>
                  <th className="py-3 px-4 text-left text-sm font-medium tracking-vn-tight">Lá bài</th>
                  <th className="py-3 px-4 text-left text-sm font-medium tracking-vn-tight hidden md:table-cell">Thông điệp chính</th>
                  <th className="py-3 px-4 text-left text-sm font-medium tracking-vn-tight"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {[
                  { date: "2023-07-20", card: "The Moon (Mặt Trăng)", message: "Lắng nghe trực giác và đối mặt với nỗi sợ hãi tiềm ẩn" },
                  { date: "2023-07-19", card: "The Hermit (Ẩn Sĩ)", message: "Thời gian để suy ngẫm và tìm kiếm câu trả lời từ bên trong" },
                  { date: "2023-07-18", card: "Wheel of Fortune (Bánh Xe Số Phận)", message: "Những thay đổi đang đến, hãy sẵn sàng đón nhận" },
                  { date: "2023-07-17", card: "Queen of Cups (Hoàng Hậu Cốc)", message: "Kết nối với cảm xúc và phát triển trực giác" },
                  { date: "2023-07-16", card: "Ten of Wands (10 Gậy)", message: "Đừng gánh vác quá nhiều trách nhiệm, học cách chia sẻ gánh nặng" }
                ].map((reading, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-300 tracking-vn-tight">{new Date(reading.date).toLocaleDateString('vi-VN')}</td>
                    <td className="py-3 px-4 text-sm text-white tracking-vn-tight">{reading.card}</td>
                    <td className="py-3 px-4 text-sm text-gray-300 tracking-vn-tight hidden md:table-cell">{reading.message}</td>
                    <td className="py-3 px-4 text-right">
                      <Link 
                        to={`/daily-tarot/history/${reading.date}`} 
                        className="text-[#9370db] hover:text-[#8a2be2] transition-colors text-sm tracking-vn-tight"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/daily-tarot/history" 
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight inline-block"
            >
              Xem tất cả lịch sử
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <SectionTitle 
            title="Câu hỏi thường gặp" 
            subtitle="Những điều bạn cần biết về tính năng Tarot Hàng Ngày"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Tarot Hàng Ngày là gì?",
                answer: "Tarot Hàng Ngày là một tính năng giúp bạn nhận được một lá bài Tarot và thông điệp tương ứng mỗi ngày, cung cấp sự hướng dẫn và lời khuyên cho các hoạt động trong ngày của bạn."
              },
              {
                question: "Làm thế nào để hiểu rõ thông điệp từ Tarot Hàng Ngày?",
                answer: "Đọc kỹ phần giải thích và suy ngẫm về cách nó liên quan đến tình hình hiện tại của bạn. Lưu ý rằng Tarot là công cụ hướng dẫn, không phải là dự đoán chính xác tương lai."
              },
              {
                question: "Tôi có thể xem lại các lá bài trước đây không?",
                answer: "Có, bạn có thể xem lại lịch sử các lá bài và thông điệp bạn đã nhận được trong phần 'Lịch sử Tarot Hàng Ngày' trên trang này."
              },
              {
                question: "Lá bài có thay đổi trong ngày không?",
                answer: "Không, mỗi ngày bạn sẽ nhận được một lá bài cố định. Lá bài sẽ chỉ thay đổi khi chuyển sang ngày mới."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-[#9370db] tracking-vn-tight">{faq.question}</h3>
                <p className="text-gray-300 tracking-vn-tight leading-vn">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#9370db]/20 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8a2be2]/20 rounded-full filter blur-[80px]"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 tracking-vn-tight">Muốn tìm hiểu sâu hơn?</h2>
              <p className="text-lg text-gray-300 mb-8 tracking-vn-tight leading-vn">
                Khám phá các loại hình xem bói Tarot chuyên sâu của chúng tôi để hiểu rõ hơn về các khía cạnh cụ thể trong cuộc sống của bạn.
              </p>
              <Link 
                to="/tarot-readings" 
                className="inline-block bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
              >
                Xem tất cả bài Tarot
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default memo(DailyTarotPage); 