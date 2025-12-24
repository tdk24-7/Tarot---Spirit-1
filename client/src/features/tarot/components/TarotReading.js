import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllCards, performStandardReading, performAIReading, clearSelectedCards, fetchTwelveRandomCards, setTwelveCards, clearError, saveReadingToHistory } from '../slices/tarotSlice';
import TarotReadingForm from './TarotReadingForm';
import ReadingResult from './ReadingResult';
import ReadingTypeSelector from './ReadingTypeSelector';
import AIQuestionInput from './AIQuestionInput';
import cardBackImage from '../../../assets/images/ui/card-back.png';
import { API_URL } from '../../../config/constants';
import axios from 'axios';
import apiClient from '../../../shared/utils/api/apiClient';
import { toast } from 'react-hot-toast';

// Import Cloudinary helpers
import { cld, getPublicIdFromUrl, getCloudinaryImage } from '../utils/cloudinaryHelper';
import { fill } from "@cloudinary/url-gen/actions/resize";

/**
 * Component chính kết hợp form và kết quả đọc bài Tarot
 */
const TarotReading = memo(() => {
  const dispatch = useDispatch();
  const { cards, selectedCards, twelveCards, currentReading, interpretation, loading, error } = useSelector(state => state.tarot);
  const [readingStarted, setReadingStarted] = useState(false);
  const [readingStep, setReadingStep] = useState('form'); // 'form', 'ai-question', 'shuffling', 'result'
  const [revealCount, setRevealCount] = useState(0);
  const [readingData, setReadingData] = useState(null);
  const [selectedReadingType, setSelectedReadingType] = useState('love');
  const [showIntro, setShowIntro] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDealingCards, setIsDealingCards] = useState(false);
  const [tableCards, setTableCards] = useState([]);
  const [userSelectedCards, setUserSelectedCards] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [deckPosition, setDeckPosition] = useState({ x: 0, y: 0 });
  const [dealedCount, setDealedCount] = useState(0);
  const [useAI, setUseAI] = useState(false);
  const [aiQuestion, setAIQuestion] = useState('');

  // Fetch tất cả cards khi component mount
  useEffect(() => {
    // Log the API URL to verify configuration
    console.log('API URL being used:', API_URL);

    // Fetch cards if none are loaded
    if (cards.length === 0 && !loading) {
      // First, let's test the server connection with a simple fetch
      fetch(`${API_URL}/cards`)
        .then(response => {
          console.log('Server connection test:', response.status, response.ok);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Server test data received, count:', data.data?.cards?.length || 0);
        })
        .catch(error => {
          console.error('Server connection test failed:', error.message);
        });

      // Now proceed with the normal Redux flow
      dispatch(fetchAllCards())
        .unwrap()
        .then(data => {
          if (data && Array.isArray(data)) {
            console.log('Tải lá bài thành công:', data.length, 'lá');
          } else if (data && data.data && Array.isArray(data.data.cards)) {
            console.log('Tải lá bài thành công:', data.data.cards.length, 'lá');
          } else {
            console.log('Tải lá bài thành công, nhưng cấu trúc dữ liệu không như mong đợi');
          }
        })
        .catch(error => {
          console.error('Lỗi khi tải lá bài:', error);
          // Nếu không thể kết nối đến API, bật USE_MOCK_API
          if (error.message && error.message.includes('Không thể kết nối')) {
            console.log('Không thể kết nối đến API, chuyển sang chế độ mock data');
            localStorage.setItem('USE_MOCK_API', 'true');
            // Thử lại với mock data
            dispatch(fetchAllCards());
          }
        });
    }

    // Automatically draw 12 random cards if none are displayed yet
    if (twelveCards.length === 0 && cards.length > 0 && !loading) {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      dispatch(setTwelveCards(shuffled.slice(0, 12)));
    }

    // Đặt timer để ẩn intro sau 3 giây
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => {
      clearTimeout(introTimer);
    };
  }, [dispatch, cards, twelveCards.length, loading, error]);

  // Preload các ảnh lá bài để tránh delay khi lật bài
  useEffect(() => {
    if (cards && cards.length > 0) {
      // Preloading Cloudinary images is generally not needed as the SDK handles optimization
      // If you still want to preload, you might need a different strategy
      // For now, let's just preload the card back

      // Preload ảnh mặt sau
      const backImg = new Image();
      backImg.src = cardBackImage;
    }
  }, [cards]);

  // Xử lý khi bắt đầu trải bài
  useEffect(() => {
    if (isDealingCards && tableCards.length > 0) {
      // Reset dealedCount khi bắt đầu trải bài
      setDealedCount(0);

      // Trải bài tuần tự, 1 lá sau 1 lá
      const dealInterval = setInterval(() => {
        setDealedCount(prevCount => {
          const newCount = prevCount + 1;

          if (newCount >= tableCards.length) {
            clearInterval(dealInterval);
            // Đợi một chút sau khi trải hết bài rồi mới ẩn trạng thái trải bài
            setTimeout(() => {
              setIsDealingCards(false);
            }, 1000);
          }
          return newCount;
        });
      }, 150); // Cách nhau 150ms mỗi lá

      return () => clearInterval(dealInterval);
    }
  }, [isDealingCards, tableCards.length]);

  // Bắt đầu xáo bài
  const handleShuffleCards = useCallback(() => {
    setIsShuffling(true);
    setReadingStep('shuffling');

    // Lưu vị trí trung tâm của deck để tính toán animation
    const deckCenter = document.getElementById('deck-center');
    if (deckCenter) {
      const rect = deckCenter.getBoundingClientRect();
      setDeckPosition({
        x: window.innerWidth / 2 - rect.left - rect.width / 2,
        y: window.innerHeight / 2 - rect.top - rect.height / 2
      });
    }

    // Animation xốc bài mạnh (thay vì xáo bài thông thường)
    setTimeout(() => {
      setIsShuffling(false);

      // Lấy 12 lá bài ngẫu nhiên thông qua redux action
      dispatch(fetchTwelveRandomCards())
        .unwrap()
        .then(cards => {
          console.log('Lấy lá bài thành công:', cards);

          // Kiểm tra xem cards có phải là một mảng không
          if (cards && Array.isArray(cards) && cards.length > 0) {
            console.log(`Đã nhận được ${cards.length} lá bài, đặt vào tableCards`);
            setTableCards(cards);

            // Bắt đầu trải bài sau khi bộ bài đã di chuyển vào góc
            setTimeout(() => {
              setIsDealingCards(true);
            }, 1000);
          } else if (cards && typeof cards === 'object' && cards.data && Array.isArray(cards.data.cards)) {
            // Handle alternative response structure
            console.log(`Đã nhận được ${cards.data.cards.length} lá bài từ cấu trúc khác`);
            setTableCards(cards.data.cards);

            setTimeout(() => {
              setIsDealingCards(true);
            }, 1000);
          } else {
            console.error('Dữ liệu lá bài không hợp lệ:', cards);
            // Fallback: Sử dụng lá bài từ cards nếu có
            if (cards && cards.length > 0) {
              const shuffled = [...cards].sort(() => Math.random() - 0.5);
              const twelveRandomCards = shuffled.slice(0, 12);
              setTableCards(twelveRandomCards);

              setTimeout(() => {
                setIsDealingCards(true);
              }, 1000);
            } else {
              alert('Không thể lấy được lá bài. Vui lòng thử lại!');
            }
          }
        })
        .catch(error => {
          console.error('Lỗi khi lấy lá bài ngẫu nhiên:', error);

          // Fallback: Sử dụng lá bài từ redux state nếu có
          if (cards && cards.length > 0) {
            console.log('Sử dụng fallback khi có lỗi - lấy từ cards có sẵn');
            const shuffled = [...cards].sort(() => Math.random() - 0.5);
            const twelveRandomCards = shuffled.slice(0, 12);
            setTableCards(twelveRandomCards);

            setTimeout(() => {
              setIsDealingCards(true);
            }, 1000);
          } else {
            alert('Không thể lấy được lá bài. Vui lòng thử lại!');
          }
        });
    }, 2500);
  }, [dispatch, cards]);

  // Chọn một lá bài từ bàn
  const handleCardSelect = useCallback((card, index) => {
    if (!card || !card.id || userSelectedCards.length >= 3) return;

    // Kiểm tra xem lá bài đã được chọn chưa
    if (userSelectedCards.some(c => c && c.id === card.id)) {
      return;
    }

    // Thêm card vào danh sách đã chọn
    setUserSelectedCards(prev => [...prev, card]);

    // Lưu index của lá bài đã chọn (0-11)
    setSelectedIndices(prev => [...prev, index]);

  }, [userSelectedCards]);

  // Xử lý khi bấm nút "Xem kết quả"
  const handleProceedToResult = useCallback(() => {
    if (userSelectedCards.length === 3 && selectedIndices.length === 3) {
      // Đảm bảo rằng tableCards, selectedIndices, selectedReadingType, và aiQuestion đều hợp lệ
      if (!tableCards || !Array.isArray(tableCards) || tableCards.length === 0) {
        toast.error('Lỗi: Không tìm thấy dữ liệu bài tarot', {
          position: "top-center",
          autoClose: 5000
        });
        return;
      }

      if (!selectedIndices || !Array.isArray(selectedIndices) || selectedIndices.length !== 3) {
        toast.error('Lỗi: Vui lòng chọn đủ 3 lá bài', {
          position: "top-center",
          autoClose: 5000
        });
        return;
      }

      // Tạo đối tượng data để gửi đi
      const data = {
        selectedIndices: selectedIndices,
        displayedCards: tableCards,
        domain: selectedReadingType || 'general',
        question: useAI ? (aiQuestion || '') : '',
        useAI: !!useAI
      };

      // Clear error trước khi gọi API mới
      dispatch(clearError());

      // Thêm logging để debug
      console.log('Sending reading request with data:', data);
      console.log('Using AI?', useAI);

      // Gọi API tương ứng dựa vào lựa chọn bói thường hoặc bói AI
      if (useAI) {
        dispatch(performAIReading(data))
          .unwrap()
          .then(result => {
            console.log('=== AI Reading Flow Debug ===');
            console.log('1. Raw result from dispatch:', result);
            console.log('1a. result.selectedCards:', result?.selectedCards);
            console.log('1b. result.data:', result?.data);
            console.log('1c. result.data?.selectedCards:', result?.data?.selectedCards);

            // Fix: Unwrap result if nested (AI reading often returns {data: {reading: ...}})
            let cleanResult = result;
            if (result && result.data && result.data.reading) {
              cleanResult = result.data.reading;
              console.log('2. Unwrapped from data.reading');
            } else if (result && result.data) {
              cleanResult = result.data;
              console.log('2. Unwrapped from data');
            } else if (result && result.reading) {
              cleanResult = result.reading;
              console.log('2. Unwrapped from reading');
            } else {
              console.log('2. No unwrapping needed, using raw result');
            }

            console.log('3. cleanResult:', cleanResult);
            console.log('3a. cleanResult.selectedCards:', cleanResult?.selectedCards);
            console.log('3b. cleanResult.selectedCards.length:', cleanResult?.selectedCards?.length);

            // Nếu thành công, chuyển sang trang kết quả
            setReadingData({
              ...data,
              result: cleanResult
            });
            console.log('4. Set readingData.result to cleanResult');
            setReadingStep('result');
          })
          .catch(error => {
            console.error('AI Reading error:', error);
            // Hiển thị thông báo lỗi
            toast.error(error.message || 'Không thể thực hiện bài đọc AI. Vui lòng thử lại.', {
              position: "top-center",
              autoClose: 5000
            });
          });
      } else {
        dispatch(performStandardReading(data))
          .unwrap()
          .then(result => {
            console.log('Standard Reading result:', result);
            // Kiểm tra kết quả trả về
            if (!result) {
              throw new Error('Không nhận được kết quả đọc bài từ server');
            }

            // Nếu thành công, chuyển sang trang kết quả
            setReadingData({
              ...data,
              result: result
            });
            setReadingStep('result');
          })
          .catch(error => {
            console.error('Standard Reading error:', error);
            // Kiểm tra chi tiết lỗi và hiển thị thông báo phù hợp
            let errorMessage = 'Không thể thực hiện bài đọc. Vui lòng thử lại.';

            if (error.message) {
              errorMessage = error.message;
            } else if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }

            toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000
            });
          });
      }
    } else {
      toast.error('Vui lòng chọn đủ 3 lá bài để tiếp tục', {
        position: "top-center",
        autoClose: 3000
      });
    }
  }, [userSelectedCards, selectedIndices, tableCards, selectedReadingType, aiQuestion, useAI, dispatch]);

  // Xử lý khi lưu kết quả
  const handleSaveReading = useCallback(() => {
    if (!readingData || !readingData.result) {
      toast.error('Không có dữ liệu để lưu', {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }

    // Dispatch action để lưu kết quả bói bài vào lịch sử
    dispatch(saveReadingToHistory(readingData.result))
      .unwrap()
      .then(() => {
        toast.success('Đã lưu kết quả thành công!', {
          position: "top-center",
          autoClose: 3000
        });
      })
      .catch(error => {
        console.error('Error saving reading:', error);
        toast.error('Không thể lưu kết quả. Vui lòng thử lại sau.', {
          position: "top-center",
          autoClose: 3000
        });
      });
  }, [readingData, dispatch]);

  // Xử lý khi chia sẻ kết quả
  const handleShareReading = useCallback(() => {
    // Hiển thị modal chia sẻ
    alert('Chức năng chia sẻ đang được phát triển!');
    // Trong thực tế sẽ hiển thị modal với các options chia sẻ
  }, []);

  // Xử lý khi bắt đầu lại
  const handleRestart = useCallback(() => {
    setReadingStarted(false);
    setReadingStep('form');
    setRevealCount(0);
    setReadingData(null);
    setIsShuffling(false);
    setIsDealingCards(false);
    setTableCards([]);
    setUserSelectedCards([]);
    setSelectedIndices([]);
    setAIQuestion('');
    dispatch(clearSelectedCards());
  }, [dispatch]);

  // Toggle giữa bói thường và bói AI
  const toggleReadingType = useCallback((value) => {
    console.log('TarotReading.js - toggleReadingType đến:', value);
    setUseAI(value);
  }, []);

  // Hiệu ứng và biến thể animation
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      boxShadow: "0 10px 25px rgba(147, 112, 219, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const deckVariants = {
    initial: { scale: 1 },
    shuffling: {
      rotate: [0, 5, -5, 3, -3, 0],
      x: [0, 20, -20, 10, -10, 0],
      y: [0, -10, 0, -5, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    },
    // Xốc bài mạnh hơn
    shaking: {
      rotate: [0, 8, -8, 5, -5, 3, -3, 0],
      x: [0, 30, -30, 20, -20, 10, -10, 0],
      y: [0, -15, -5, -10, 0, -5, 0, 0],
      scale: [1, 1.05, 1, 1.03, 1, 1.02, 1, 1],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1]
      }
    },
    // Bộ bài di chuyển vào góc trên bên trái theo đánh dấu đỏ
    corner: {
      x: -220,
      y: -210,
      scale: 0.65,
      rotate: [0, 3],
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    compact: {
      scale: 0.85,
      y: -100,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const tableCardVariants = {
    initial: { scale: 0, opacity: 0, rotateY: 180 },
    inDeck: {
      x: deckPosition.x,
      y: deckPosition.y,
      scale: 0.7,
      opacity: 0,
      rotateY: 180
    },
    // Lấy lá bài từ bộ bài ở góc và trải theo hình quạt gấp
    deal: (i) => {
      // Tính toán vị trí trong hình quạt gấp
      const totalCards = 12;
      const middleIndex = (totalCards - 1) / 2;

      // Kiểm tra nếu là màn hình mobile - sử dụng window.innerWidth
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      // Góc quạt và bán kính điều chỉnh theo kích thước màn hình
      const fanAngle = isMobile
        ? -20 + (40 * i) / (totalCards - 1) // Góc nhỏ hơn cho mobile
        : isTablet
          ? -30 + (60 * i) / (totalCards - 1) // Góc trung bình cho tablet
          : -35 + (70 * i) / (totalCards - 1); // Góc lớn cho desktop

      // Tính toán góc radian
      const angle = (fanAngle * Math.PI) / 180;

      // Xác định bán kính của quạt - nhỏ hơn cho mobile
      const radius = isMobile ? 200 : isTablet ? 280 : 320;

      // Offset để di chuyển hình quạt sang trái
      const offsetX = isMobile ? 20 : isTablet ? 40 : 50;

      // Tính khoảng cách giữa các lá bài theo vị trí cung tròn
      const x = Math.sin(angle) * radius - offsetX;

      // Thu nhỏ theo chiều dọc - hệ số nhỏ hơn cho mobile
      const yFactor = isMobile ? 0.2 : isTablet ? 0.25 : 0.3;
      const yOffset = isMobile ? 30 : isTablet ? 50 : 60;
      const y = -Math.cos(angle) * radius * yFactor + yOffset;

      // Thu nhỏ kích thước lá bài trên mobile
      const cardScale = isMobile ? 0.7 : isTablet ? 0.8 : 1;

      // Để các lá bài chồng mép lên nhau một phần, điều chỉnh z-index
      const zIndex = i < middleIndex ? i : totalCards - i;

      return {
        x: x,
        y: y,
        scale: cardScale,
        opacity: 1,
        rotateY: 0,
        rotate: fanAngle, // Xoay lá bài theo góc quạt
        zIndex: zIndex,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: i * 0.12
        }
      };
    },
    selected: {
      scale: 1.05,
      y: -10,
      boxShadow: "0 15px 30px rgba(147, 112, 219, 0.3)",
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Xử lý khi bắt đầu trải bài
  const handleStartReading = useCallback((readingData) => {
    setReadingStarted(true);
    setReadingData(readingData);
    setSelectedReadingType(readingData.readingType);
    setUseAI(readingData.useAI);

    // Nếu là bói AI, chuyển đến bước nhập câu hỏi trước, ngược lại bắt đầu xáo bài ngay
    if (readingData.useAI) {
      setReadingStep('ai-question');
    } else {
      setReadingStep('shuffling');
      handleShuffleCards();
    }
  }, [handleShuffleCards]);

  // Xử lý khi xác nhận câu hỏi AI
  const handleAIQuestionSubmit = useCallback(() => {
    setReadingStep('shuffling');
    // Đảm bảo chúng ta có sự chậm trễ để trạng thái cập nhật trước khi bắt đầu shuffle
    setTimeout(() => {
      handleShuffleCards();
    }, 100);
  }, [handleShuffleCards, aiQuestion]);

  // Xử lý khi thay đổi câu hỏi AI
  const handleAIQuestionChange = useCallback((question) => {
    setAIQuestion(question);
  }, []);

  // Render trang intro
  if (showIntro) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1a0933] to-[#2a1045]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨🔮✨
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-vn-tight">
            Bói Tarot Online
          </h1>
          <p className="text-xl text-[#9370db] tracking-vn-tight">
            Khám phá tương lai của bạn...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Render trang form
  const renderForm = () => (
    <motion.div
      className="space-y-8"
      key="form"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeVariants}
    >
      {error && (
        <motion.div
          className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-6"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <p className="text-white tracking-vn-tight">{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-white/70 hover:text-white"
            >
              <span className="sr-only">Đóng</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Header với minh họa */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-vn-tight">
          Trải Bài Tarot
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto tracking-vn-tight">
          Chọn bộ bài, loại trải bài và để năng lượng vũ trụ dẫn dắt bạn. Hãy đặt tâm trí vào câu hỏi của bạn khi chọn bài.
        </p>
      </motion.div>

      {/* Sử dụng TarotReadingForm thay vì hiển thị form tại đây */}
      <TarotReadingForm
        onStart={handleStartReading}
        isLoading={loading}
      />
    </motion.div>
  );

  // Render trang nhập câu hỏi AI
  const renderAIQuestionForm = () => (
    <motion.div
      className="space-y-8"
      key="ai-question"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeVariants}
    >
      <AIQuestionInput
        question={aiQuestion}
        onQuestionChange={handleAIQuestionChange}
        onSubmit={handleAIQuestionSubmit}
        readingType={selectedReadingType}
      />
    </motion.div>
  );

  // Render theo các bước của quá trình bói bài
  return (
    <AnimatePresence mode="wait">
      {readingStep === 'form' && renderForm()}

      {readingStep === 'ai-question' && renderAIQuestionForm()}

      {readingStep === 'shuffling' && (
        <motion.div
          className="space-y-8"
          key="shuffling"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeVariants}
        >
          <motion.div
            className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 tracking-vn-tight text-center">
              <span className="text-[#9370db] mr-2">✨</span>
              {isShuffling ? "Đang Xáo Bài..." : isDealingCards ? "Đang Trải Bài..." : "Chọn 3 Lá Bài"}
              <span className="text-[#9370db] ml-2">✨</span>
            </h2>

            {/* Không hiển thị lỗi trên UI nếu đang sử dụng mock API*/}
            {error && (
              <motion.div
                className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 mb-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <p className="text-white tracking-vn-tight">{error}</p>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="text-white/70 hover:text-white"
                  >
                    <span className="sr-only">Đóng</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Nút Thử lại */}
                {error.includes('fetch') && (
                  <button
                    onClick={() => {
                      dispatch(clearError());
                      // Thử lại shuffle cards
                      handleShuffleCards();
                    }}
                    className="mt-3 bg-purple-600/50 hover:bg-purple-600/70 transition-colors py-2 px-4 rounded text-white text-sm"
                  >
                    Thử lại
                  </button>
                )}
              </motion.div>
            )}

            {(isShuffling || (!isDealingCards && tableCards.length === 0)) && (
              <p className="text-gray-300 text-center mb-8 tracking-vn-tight">
                Hãy tập trung vào câu hỏi của bạn trong khi bài đang được xáo...
              </p>
            )}

            {!isShuffling && isDealingCards && tableCards.length > 0 && (
              <p className="text-gray-300 text-center mb-8 tracking-vn-tight">
                Bài đang được trải ra...
              </p>
            )}

            {!isShuffling && !isDealingCards && tableCards.length > 0 && (
              <p className="text-gray-300 text-center mb-8 tracking-vn-tight">
                Hãy chọn {3 - userSelectedCards.length} lá bài để xem kết quả
              </p>
            )}

            <div className="relative min-h-[400px] md:min-h-[500px]">
              {/* Animation xáo bài */}
              <div id="deck-center" className="relative h-[250px] md:h-[300px] max-w-md mx-auto">
                <motion.div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  variants={deckVariants}
                  initial="initial"
                  animate={isShuffling ? "shaking" : isDealingCards || tableCards.length > 0 ? "corner" : "initial"}
                >
                  {/* Bộ bài */}
                  <div className="relative h-[180px] w-[120px] md:h-[220px] md:w-[150px]">
                    {Array.from({ length: 20 }).map((_, index) => (
                      <motion.div
                        key={`shuffle-${index}`}
                        className="absolute h-full w-full bg-gradient-to-br from-[#2a1045] to-[#3a1c5a] rounded-lg border border-[#9370db]/30 shadow-lg"
                        style={{
                          zIndex: 20 - index,
                          top: `${index * 0.5}px`,
                          left: `${index * 0.5}px`,
                          transform: `rotate(${index % 2 === 0 ? index * 0.2 : index * -0.2}deg)`
                        }}
                        animate={{
                          rotate: isShuffling ?
                            [index % 2 === 0 ? index * 0.2 : index * -0.2,
                            index % 2 === 0 ? index * -0.5 : index * 0.5,
                            index % 2 === 0 ? index * 0.2 : index * -0.2] :
                            [index % 2 === 0 ? index * 0.2 : index * -0.2],
                          // Thêm hiệu ứng rung lắc khi xốc bài
                          y: isShuffling ?
                            [0, index % 3 === 0 ? -3 : (index % 3 === 1 ? 2 : -1), 0] :
                            0,
                          x: isShuffling ?
                            [0, index % 2 === 0 ? 2 : -2, 0] :
                            0,
                        }}
                        transition={{
                          duration: 2,
                          repeat: isShuffling ? 5 : 0,
                          repeatType: "reverse"
                        }}
                      >
                        <div className="h-full w-full bg-cover bg-center rounded-lg">
                          <img src={cardBackImage} alt="Card Back" className="h-full w-full object-cover rounded-lg" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bài đã được trải ra bàn theo hình quạt gấp */}
              {tableCards.length > 0 && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative w-full h-[280px] md:h-[350px] max-w-4xl">
                    {tableCards.map((card, index) => {
                      const isSelected = userSelectedCards.some(c => c && c.id === card.id);
                      // Tính toán z-index để các lá bài hiển thị đúng thứ tự chồng lên nhau
                      const totalCards = tableCards.length;
                      const middleIndex = Math.floor((totalCards - 1) / 2);
                      const zIndex = index < middleIndex ? index : (totalCards - index);

                      return (
                        <motion.div
                          key={`table-${index}`}
                          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${isSelected ? 'pointer-events-none' : ''}`}
                          style={{ zIndex: isSelected ? 50 : 20 + zIndex }}
                          variants={tableCardVariants}
                          custom={index}
                          initial="inDeck"
                          animate={isDealingCards ?
                            (index < dealedCount ? "deal" : "inDeck") :
                            isSelected ? "selected" : "deal"}
                          whileHover={(!isDealingCards && !isSelected) ? { y: '-10px', scale: 1.05, transition: { duration: 0.2 } } : {}}
                          onClick={() => !isDealingCards && handleCardSelect(card, index)}
                        >
                          <div className="h-[140px] w-[85px] md:h-[180px] md:w-[110px] bg-gradient-to-br from-[#2a1045] to-[#3a1c5a] rounded-lg border border-[#9370db]/30 shadow-lg overflow-hidden">
                            {isSelected ? (
                              <img
                                src={card.imageUrl ? getCloudinaryImage(card.imageUrl, 220, 360).toURL() : cardBackImage}
                                alt={card.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = cardBackImage;
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-cover bg-center rounded-lg">
                                <img src={cardBackImage} alt="Card Back" className="h-full w-full object-cover rounded-lg" />
                              </div>
                            )}
                          </div>

                          {isSelected && (
                            <motion.div
                              className="absolute -bottom-2 left-0 right-0 mx-auto"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <span className="bg-[#9370db] text-white text-[10px] md:text-xs rounded-full px-2 py-1 inline-block">
                                {userSelectedCards.findIndex(c => c && c.id === card.id) === 0 ? 'BẢN THÂN' :
                                  userSelectedCards.findIndex(c => c && c.id === card.id) === 1 ? 'HOÀN CẢNH' : 'THỬ THÁCH'}
                              </span>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Hiển thị các lá bài đã chọn */}
            {userSelectedCards.length > 0 && (
              <motion.div
                className="mt-8 md:mt-12 p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 tracking-vn-tight text-center">Lá Bài Đã Chọn</h3>

                <div className="grid grid-cols-3 gap-2 md:gap-8">
                  {userSelectedCards.map((card, index) => (
                    <motion.div
                      key={`selected-${index}`}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="relative w-[70px] h-[120px] sm:w-[80px] sm:h-[130px] md:w-[110px] md:h-[180px] rounded-lg overflow-hidden shadow-lg border border-[#9370db]/30">
                        <img
                          src={card.imageUrl ? getCloudinaryImage(card.imageUrl, 220, 360).toURL() : cardBackImage}
                          alt={card.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = cardBackImage;
                          }}
                        />

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a0933] to-transparent p-1 md:p-2">
                          <p className="text-white text-[8px] sm:text-[9px] md:text-xs font-medium text-center truncate">
                            {card.name || 'Tarot Card'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 md:mt-4 w-full">
                        <div className="bg-gradient-to-r from-transparent via-[#9370db]/30 to-transparent h-[1px] mb-2 md:mb-3"></div>
                        <p className="text-center text-white text-[8px] sm:text-[10px] md:text-sm font-semibold tracking-vn-tight">
                          {index === 0 ? (
                            <span className="flex items-center justify-center">
                              <span className="text-[#9370db] mr-1">•</span> BẢN THÂN <span className="text-[#9370db] ml-1">•</span>
                            </span>
                          ) : index === 1 ? (
                            <span className="flex items-center justify-center">
                              <span className="text-[#9370db] mr-1">•</span> HOÀN CẢNH <span className="text-[#9370db] ml-1">•</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <span className="text-[#9370db] mr-1">•</span> THỬ THÁCH <span className="text-[#9370db] ml-1">•</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Hiển thị vị trí còn trống */}
                  {Array.from({ length: Math.max(0, 3 - userSelectedCards.length) }).map((_, i) => (
                    <motion.div
                      key={`empty-${i}`}
                      className="flex flex-col items-center opacity-60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className="w-[70px] h-[120px] sm:w-[80px] sm:h-[130px] md:w-[110px] md:h-[180px] rounded-lg border border-[#9370db]/20 border-dashed flex items-center justify-center bg-white/5">
                        <span className="text-gray-400 text-xl sm:text-2xl md:text-4xl">?</span>
                      </div>
                      <div className="mt-2 md:mt-4 w-full">
                        <div className="bg-gradient-to-r from-transparent via-[#9370db]/10 to-transparent h-[1px] mb-2 md:mb-3"></div>
                        <p className="text-center text-gray-400 text-[8px] sm:text-[10px] md:text-sm font-medium tracking-vn-tight">
                          {userSelectedCards.length + i === 0 ? 'BẢN THÂN' :
                            userSelectedCards.length + i === 1 ? 'HOÀN CẢNH' : 'THỬ THÁCH'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Nút xem kết quả */}
            {userSelectedCards.length === 3 && (
              <motion.div
                className="text-center mt-6 md:mt-8 py-2 md:py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  className="w-full sm:w-auto bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white py-3 px-6 md:py-4 md:px-12 rounded-lg font-semibold text-base md:text-lg shadow-lg shadow-[#9370db]/20 tracking-vn-tight"
                  onClick={handleProceedToResult}
                  whileHover={{
                    y: -3,
                    boxShadow: "0 10px 25px rgba(147, 112, 219, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✨</span>
                    XEM KẾT QUẢ
                    <span className="ml-2">✨</span>
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Nút hủy */}
            {(isShuffling || isDealingCards || tableCards.length > 0) && (
              <motion.div
                className="text-center mt-4 md:mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight inline-flex items-center justify-center text-sm md:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Bắt đầu lại
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {readingStep === 'result' && (
        <motion.div
          key="result"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeVariants}
        >
          <ReadingResult
            reading={readingData?.result || currentReading}
            interpretation={readingData?.result?.interpretation || interpretation}
            onSave={handleSaveReading}
            onShare={handleShareReading}
            onRestart={handleRestart}
            loading={loading}
            isAI={useAI}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default TarotReading; 