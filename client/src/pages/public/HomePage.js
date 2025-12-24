import React, { useEffect, useState, useCallback, memo, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../../shared/layouts/PageLayout';
import { Button } from '../../shared/components/common';

// Thay thế component TarotDeck bằng version đơn giản hơn
const TarotDeck = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [nextCardIndex, setNextCardIndex] = useState(1);
  const cardRef = useRef(null);
  
  // Danh sách các lá bài để luân phiên hiển thị
  const cards = [
    { 
      name: "The Fool",
      frontImage: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522725/TheFool_ewfg71.png" 
    },
    { 
      name: "The Magician",
      frontImage: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522729/TheMagician_fqzyrb.png" 
    },
    { 
      name: "The High Priestess",
      frontImage: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522727/TheHighPriestess_epsoay.png" 
    },
    { 
      name: "The Empress",
      frontImage: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522725/TheEmpress_zszjpa.png" 
    },
    { 
      name: "The Emperor",
      frontImage: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522745/TheEmperor_y1vfjk.png"
    }
  ];
  
  // Hình ảnh mặt sau đồng nhất cho tất cả các lá bài
  const cardBack = "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1747154079/card-back_qn7bss.png";
  
  // Thiết lập animationend listener để thay đổi lá bài khi xoay đến mặt sau
  useEffect(() => {
    const changeCardOnRotation = () => {
      // Sử dụng một đoạn animation riêng biệt để phát hiện khi lá bài xoay đến 180 độ (mặt sau)
      const flipAnimationDuration = 4000; // Nửa chu kỳ xoay (8s/2)
      
      const flipTimer = setTimeout(() => {
        setCurrentCardIndex(prevIndex => {
          const newIndex = (prevIndex + 1) % cards.length;
          // Cập nhật nextCardIndex cho lá bài tiếp theo
          setNextCardIndex((newIndex + 1) % cards.length);
          return newIndex;
        });
      }, flipAnimationDuration);
      
      return () => clearTimeout(flipTimer);
    };
    
    // Thiết lập chu kỳ đổi lá bài đồng bộ với chu kỳ animation
    const rotationCycle = setInterval(changeCardOnRotation, 8000);
    
    // Kích hoạt ngay lập tức cho lần đầu tiên
    const initialFlip = changeCardOnRotation();
    
    return () => {
      clearInterval(rotationCycle);
      if (initialFlip) initialFlip();
    };
  }, [cards.length]);
  
  return (
    <div className="relative bg-gradient-to-br from-[#1a0933] to-[#2a1045] rounded-xl p-6 h-full min-h-[420px] flex flex-col items-center justify-center overflow-hidden border border-[#9370db]/30">
      {/* Hiệu ứng ngôi sao nền */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Mặt trăng nền */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-70 shadow-lg shadow-yellow-300/30"></div>
      
      {/* CSS để tạo animation xoay liên tục */}
      <style>
        {`
          @keyframes continuousRotate {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          
          .tarot-card {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            animation: continuousRotate 8s linear infinite;
          }
          
          .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 0.5rem;
            border: 2px solid #FFD700;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          
          .card-front {
            transform: rotateY(0deg);
          }
          
          .card-back {
            transform: rotateY(180deg);
          }
        `}
      </style>
      
      {/* Lá bài xoay */}
      <div className="perspective-1000 w-64 h-[360px] my-4 mx-auto">
        <div className="tarot-card" ref={cardRef}>
          {/* Mặt trước lá bài - hiển thị lá hiện tại */}
          <div className="card-face card-front">
            <img 
              src={cards[currentCardIndex].frontImage} 
              alt={cards[currentCardIndex].name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x450/2a1045/9370db?text=Tarot+Card";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="text-white text-center font-medium">{cards[currentCardIndex].name}</h3>
            </div>
          </div>
          
          {/* Mặt sau lá bài - dùng hình mặt sau nhưng cũng chuẩn bị sẵn lá tiếp theo */}
          <div className="card-face card-back">
            <img 
              src={cardBack} 
              alt="Card Back" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x450/2a1045/9370db?text=Card+Back";
              }}
            />
            
            {/* Tiếp theo sẽ hiện lá này */}
            <div className="hidden">
              <img 
                src={cards[nextCardIndex].frontImage} 
                alt={cards[nextCardIndex].name}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Dòng text thông tin */}
      <p className="text-center text-gray-300 italic text-sm mt-2 max-w-xs">
        "Mỗi lá bài là một cánh cửa mở ra thế giới nội tâm của bạn"
      </p>
    </div>
  );
};

// Section Title Component
const SectionTitle = memo(({ before, highlight, after }) => (
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 relative tracking-vn-tight">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">{before} </span>
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9370db] to-[#8a2be2]">{highlight}</span>
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/80 via-white to-white"> {after}</span>
    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#9370db] to-transparent rounded-full"></div>
  </h2>
));

// Feature Card Component
const FeatureCard = memo(({ icon, title, desc, color, delay }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-[#9370db]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#9370db]/10 hover:-translate-y-2 cursor-pointer relative overflow-hidden group"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-gradient-to-tl from-[#9370db]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mx-auto mb-4 text-2xl shadow-xl transform group-hover:scale-110 transition-transform duration-300 border border-[#9370db]/20`}>
      {icon}
                                    </div>
    <h3 className="text-xl font-bold mb-3 text-center group-hover:text-[#9370db] transition-colors tracking-vn-tight">{title}</h3>
    <p className="text-gray-300 text-center leading-vn">{desc}</p>
                                    </div>
));

// Reading Type Card Component
const ReadingTypeCard = memo(({ icon, title, desc, cards, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay: delay * 0.1 }}
    className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-sm rounded-lg border border-[#3a1c5a] hover:border-[#9370db]/30 transition-all duration-500 hover:shadow-xl group overflow-hidden"
  >
    <div className="relative p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9370db]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-full bg-[#2a1045] border border-[#9370db]/20 flex items-center justify-center text-3xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
                                    </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-[#9370db] transition-colors tracking-vn-tight">{title}</h3>
        <p className="text-gray-300 mb-4 leading-vn">{desc}</p>
        <div className="flex space-x-1 mb-3">
          {cards.map((_, i) => (
            <div key={i} className="w-6 h-8 bg-[#1a0933] border border-[#9370db]/20 rounded-sm flex items-center justify-center text-xs">
              {i + 1}
                                </div>
          ))}
                            </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-[#2a1045] border border-[#9370db]/30 rounded-md text-[#9370db] text-sm font-medium hover:bg-[#3a1c5a] transition-colors tracking-vn-tight"
          onClick={() => window.location.href = '/tarot-readings'}
        >
          Khám phá
        </motion.button>
                        </div>
                    </div>
  </motion.div>
));

// Buttons
const PrimaryButton = ({ onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white py-3 px-6 rounded-lg flex items-center shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all duration-300 font-medium group"
  >
    {children}
  </motion.button>
);

const SecondaryButton = ({ onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-lg flex items-center hover:bg-white/20 transition-all duration-300 font-medium group border border-white/5"
  >
    {children}
  </motion.button>
);

const AiReadingDemo = () => {
  const isMounted = useRef(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    isMounted.current = true;
    const timer = setTimeout(() => {
      if (isMounted.current) setIsReady(true);
    }, 1500);
    
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, []);
  
  const renderFallbackContent = () => (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-[#9370db] border-t-transparent animate-spin mb-6"></div>
      <p className="text-gray-300 animate-pulse">Đang kết nối với AI...</p>
                            </div>
  );
  
  const renderReading = () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex-shrink-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
                        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-gray-300 leading-vn flex-1">
          <span className="text-[#9370db] font-medium">Người dùng:</span> Tôi nên tập trung vào điều gì trong sự nghiệp hiện tại?
                        </div>
                    </div>

      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] flex-shrink-0 flex items-center justify-center border border-[#9370db]/30">
          <span className="text-[#9370db] text-xs">AI</span>
                            </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-gray-300 leading-vn flex-1">
          <span className="text-[#9370db] font-medium">Tarot AI:</span>
          <div className="mt-2 space-y-2">
            <p className="text-white">Từ lá bài The Hermit (Ẩn Sĩ) xuất hiện trong trải bài của bạn, tôi thấy rằng:</p>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start">
                <span className="text-[#9370db] mr-2">•</span>
                <span>Đây là thời điểm thích hợp để <strong className="text-white">đánh giá lại các mục tiêu</strong> và tìm kiếm sự phát triển chuyên sâu</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9370db] mr-2">•</span>
                <span>Bạn nên <strong className="text-white">tập trung vào việc nâng cao kỹ năng chuyên môn</strong> hơn là mở rộng các mối quan hệ</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#9370db] mr-2">•</span>
                <span>Thời điểm này, <strong className="text-white">hướng nội và tập trung</strong> sẽ mang lại nhiều giá trị hơn cho sự nghiệp của bạn</span>
              </li>
            </ul>
            <p>Bạn có muốn tìm hiểu thêm về cách phát triển chiều sâu chuyên môn không?</p>
                    </div>
                </div>
            </div>
        </div>
    );
  
  return (
    <div className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-sm rounded-xl p-6 h-full min-h-[400px] overflow-hidden border border-[#3a1c5a] shadow-lg">
      {isReady ? renderReading() : renderFallbackContent()}
    </div>
  );
};

const FontLoader = () => {
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);
  
  return null;
};

const GlobalAnimationStyles = () => {
  useEffect(() => {
    const styleEl = document.createElement('style');
    
    styleEl.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      
      @keyframes float-y {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes float-x {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(10px); }
      }
      
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
      }
      
      .tracking-vn-tight {
        letter-spacing: -0.01em;
      }
      
      .leading-vn {
        line-height: 1.6;
      }
      
      .animate-twinkle {
        animation: twinkle 4s ease-in-out infinite;
      }
      
      .animate-float-y {
        animation: float-y 6s ease-in-out infinite;
      }
      
      .animate-float-x {
        animation: float-x 8s ease-in-out infinite;
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 6s ease-in-out infinite;
      }
    `;
    
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  return null;
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const mainContentRef = useRef(null);
  
  // Khôi phục vị trí cuộn khi reset trang
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Khôi phục scroll position hợp lý khi có hash URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // History scrollRestoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    return () => {
      clearTimeout(timer);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const handleStartReading = useCallback(() => {
    navigate('/tarot-readings');
  }, [navigate]);

  const handleViewLibrary = useCallback(() => {
    navigate('/tarot-cards');
  }, [navigate]);

  // Data for feature cards
  const features = [
    {
      icon: '🤖',
      title: 'Giải đọc AI chính xác',
      desc: 'Thuật toán AI hiểu ngữ cảnh cá nhân, mang lại giải đọc chi tiết và chính xác',
      color: 'from-[#9370db] to-[#8a2be2]',
      delay: 0
    },
    {
      icon: '📊',
      title: 'Phân tích dữ liệu',
      desc: 'Phân tích và theo dõi xu hướng từ các lần đọc bài trước đây của bạn',
      color: 'from-[#8a2be2] to-[#4e44ce]',
      delay: 100
    },
    {
      icon: '🌟',
      title: 'Hướng dẫn cá nhân',
      desc: 'Nhận lời khuyên thực tế và hướng dẫn riêng cho từng tình huống cụ thể',
      color: 'from-[#9370db] to-[#4e44ce]',
      delay: 200
    }
  ];

  // Data for reading types
  const readingTypes = [
    {
      icon: '❤️',
      title: 'Tình yêu & Mối quan hệ',
      desc: 'Tìm hiểu sâu hơn về các mối quan hệ và hành trình tình cảm của bạn',
      cards: Array(3),
      delay: 0
    },
    {
      icon: '💼',
      title: 'Sự nghiệp & Tài chính',
      desc: 'Khám phá cơ hội mới và giải quyết các thách thức về nghề nghiệp',
      cards: Array(5),
      delay: 1
    },
    {
      icon: '🧘',
      title: 'Phát triển bản thân',
      desc: 'Hiểu rõ hơn về bản thân và định hướng phát triển cá nhân của bạn',
      cards: Array(7),
      delay: 2
    }
  ];

    return (
    <PageLayout
      title="Bói Tarot Online - Khám phá bản thân với AI"
      description="Ứng dụng bói bài Tarot online kết hợp trí tuệ nhân tạo tiên tiến và tri thức huyền bí để mang lại trải nghiệm cá nhân hóa sâu sắc."
    >
      <FontLoader />
      
      <main ref={mainContentRef} className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto py-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="px-4 py-2 bg-[#2a1045]/60 backdrop-blur-sm inline-block rounded-lg border border-[#9370db]/20 shadow-lg shadow-[#9370db]/5 mb-6">
                  <span className="text-[#9370db] uppercase tracking-wider text-sm font-medium">
                    GIẢI MÃ BÍ ẨN CUỘC SỐNG VỚI AI
                  </span>
                </div>
                
                {/* Sửa font cho tiêu đề */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9370db] via-[#8a2be2] to-[#4e44ce] drop-shadow-[0_2px_2px_rgba(147,112,219,0.3)] tracking-vn-tight leading-tight">
                  Tarot Thông Minh - Kết Nối Tâm Linh & Công Nghệ
                </h1>
                
                {/* Sửa line-height cho paragraph */}
                <p className="text-gray-300 mb-8 text-lg leading-vn">
                  Hệ thống Tarot AI đầu tiên tại Việt Nam kết hợp trí tuệ nhân tạo tiên tiến 
                  và tri thức huyền bí để mang lại trải nghiệm cá nhân hóa sâu sắc.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <PrimaryButton onClick={handleStartReading}>
                    <span className="tracking-vn-tight">Bắt đầu trải nghiệm ngay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </PrimaryButton>
                  
                  <SecondaryButton onClick={handleViewLibrary}>
                    <span className="tracking-vn-tight">Xem thư viện bài</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:rotate-45 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </SecondaryButton>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <TarotDeck />
              </motion.div>
            </div>
            
            {/* Tính năng nổi bật */}
            <div className="mb-20">
              <SectionTitle 
                before="Tính năng"
                highlight="nổi bật"
                after="của chúng tôi"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                  >
                    <FeatureCard 
                      icon={feature.icon}
                      title={feature.title}
                      desc={feature.desc}
                      color={feature.color}
                      delay={feature.delay}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* AI Reading Demo Section */}
            <div className="mb-20">
              <SectionTitle 
                before="Trải nghiệm"
                highlight="đọc bài"
                after="với AI"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                >
                  <AiReadingDemo />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col justify-center h-full p-4"
                >
                  <h3 className="text-2xl font-bold mb-6 text-[#9370db] tracking-vn-tight">Được hỗ trợ bởi AI tiên tiến</h3>
                  <p className="text-gray-300 mb-6 leading-vn">
                    Hệ thống AI tiên tiến của chúng tôi mang lại các bài đọc Tarot cá nhân hóa với độ chính xác cao,
                    kết hợp giữa kiến thức truyền thống và thuật toán học máy hiện đại.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start group">
                      <span className="text-[#9370db] mr-2 transform group-hover:scale-125 transition-transform">✓</span>
                      <span className="group-hover:text-white transition-colors leading-vn">Phân tích ngữ nghĩa sâu từ câu hỏi của bạn</span>
                    </li>
                    <li className="flex items-start group">
                      <span className="text-[#9370db] mr-2 transform group-hover:scale-125 transition-transform">✓</span>
                      <span className="group-hover:text-white transition-colors leading-vn">Kết hợp tri thức Tarot cổ xưa với AI hiện đại</span>
                    </li>
                    <li className="flex items-start group">
                      <span className="text-[#9370db] mr-2 transform group-hover:scale-125 transition-transform">✓</span>
                      <span className="group-hover:text-white transition-colors leading-vn">Bài đọc mang tính thực tiễn và hành động cụ thể</span>
                    </li>
                    <li className="flex items-start group">
                      <span className="text-[#9370db] mr-2 transform group-hover:scale-125 transition-transform">✓</span>
                      <span className="group-hover:text-white transition-colors leading-vn">Liên tục cải thiện từ phản hồi người dùng</span>
                    </li>
                  </ul>
                  <PrimaryButton onClick={handleStartReading}>
                    <span className="tracking-vn-tight">Thử ngay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
                  </PrimaryButton>
                </motion.div>
              </div>
            </div>
            
            {/* Reading Types Section */}
            <div className="mb-20">
              <SectionTitle 
                before="Các kiểu"
                highlight="đọc bài"
                after="phổ biến"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {readingTypes.map((type, index) => (
                  <ReadingTypeCard 
                    key={index}
                    icon={type.icon}
                    title={type.title}
                    desc={type.desc}
                    cards={type.cards}
                    delay={type.delay}
                  />
                ))}
              </div>
            </div>
            
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a0933]/90 to-[#2a1045]/90 backdrop-blur-md rounded-lg p-8 md:p-12 mb-10 text-center border border-[#9370db]/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#9370db]/5 to-[#4e44ce]/5 transform -skew-y-6 opacity-30"></div>
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#9370db]/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
              <h2 className="text-3xl font-bold mb-4 relative z-10 text-[#9370db] tracking-vn-tight">Sẵn sàng khám phá bản thân?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto relative z-10 leading-vn">
                Hãy bắt đầu hành trình Tarot của bạn ngay hôm nay và khám phá những thông điệp 
                ý nghĩa từ vũ trụ dành riêng cho bạn.
              </p>
              <div className="flex justify-center">
              <PrimaryButton onClick={handleStartReading}>
                    <span className="tracking-vn-tight">Thử ngay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </PrimaryButton>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <GlobalAnimationStyles />
    </PageLayout>
  );
};

export default HomePage;