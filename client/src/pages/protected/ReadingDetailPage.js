import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import tarotService from '../../features/tarot/services/tarot.service';

// Card component for displaying tarot cards
const TarotCard = ({ card, isReversed, position, interpretation }) => {
  const cardImageUrl = card?.image_url || card?.imageUrl || 'https://placehold.co/300x500/1a0933/ffffff?text=Tarot+Card';
  const cardName = card?.name || 'Unknown Card';
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 w-full max-w-[200px] mx-auto">
        <div className="relative rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
          <div className={`transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`}>
            <img
              src={cardImageUrl}
              alt={card?.name || 'Tarot Card'}
              className="w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a0933]/80 backdrop-blur-sm py-2 px-3">
            <p className="text-white text-sm font-medium tracking-vn-tight truncate">{card?.name || 'Tarot Card'}</p>
          </div>
        </div>
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#9370db] text-white flex items-center justify-center font-bold shadow-md">
          {position}
        </div>
        {isReversed && (
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Ngược
          </span>
        )}
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-lg p-4 w-full">
        <h4 className="text-white font-semibold mb-2 tracking-vn-tight">Ý nghĩa</h4>
        <p className="text-gray-300 text-sm tracking-vn-tight leading-relaxed">{interpretation || 'Không có diễn giải cho lá bài này'}</p>
      </div>
    </div>
  );
};

// Reading detail component
const ReadingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchReadingDetail = async () => {
      try {
        setLoading(true);
        const response = await tarotService.getReadingById(id);

        if (response && response.data && response.data.reading) {
          setReading(response.data.reading);
        } else {
          setError('Không tìm thấy thông tin về lần xem bói này');
          toast.error('Không tìm thấy thông tin về lần xem bói này');
        }
      } catch (error) {
        console.error('Failed to fetch reading detail:', error);
        setError('Không thể tải thông tin chi tiết. Vui lòng thử lại sau.');
        toast.error('Không thể tải thông tin chi tiết');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchReadingDetail();
    } else if (!isAuthenticated) {
      navigate('/login');
    }
  }, [id, isAuthenticated, navigate]);

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle share reading
  const handleShareReading = async () => {
    try {
      const response = await tarotService.getShareLink(id);
      if (response && response.data && response.data.shareUrl) {
        navigator.clipboard.writeText(response.data.shareUrl);
        toast.success('Đã sao chép liên kết chia sẻ vào clipboard');
      }
    } catch (error) {
      console.error('Failed to generate share link:', error);
      toast.error('Không thể tạo liên kết chia sẻ');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Chi Tiết Lần Xem Bói | Bói Tarot</title>
        <meta name="description" content="Xem chi tiết kết quả bói bài Tarot với đầy đủ diễn giải và ý nghĩa." />
      </Helmet>

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
              <span className="mx-2">/</span>
              <Link to="/reading-history" className="hover:text-white transition-colors">Lịch sử xem bói</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Chi tiết</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center">
              <p className="text-lg mb-4">{error}</p>
              <Link
                to="/reading-history"
                className="inline-block px-6 py-2 bg-[#9370db] text-white rounded-lg hover:bg-[#8a2be2] transition-colors"
              >
                Quay lại lịch sử
              </Link>
            </div>
          ) : reading ? (
            <>
              {/* Reading header */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 text-xs rounded-full bg-[#9370db]/20 text-[#9370db]">
                        {reading.spread || reading.tarot_spread?.name || 'Trải bài Tarot'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatDate(reading.created_at)}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-vn-tight">
                      {reading.question || 'Xem bói Tarot'}
                    </h1>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleShareReading}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Chia sẻ
                    </button>
                    <Link
                      to="/tarot-readings"
                      className="flex items-center gap-2 px-4 py-2 bg-[#9370db] hover:bg-[#8a2be2] transition-colors rounded-lg text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Xem bói mới
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Chủ đề</h3>
                    <p className="text-white font-medium">
                      {reading.topic || reading.tarot_topic?.name || 'Tổng quan'}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Loại trải bài</h3>
                    <p className="text-white font-medium">
                      {reading.spread || reading.tarot_spread?.name || 'Trải bài Tarot'}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Số lượng lá bài</h3>
                    <p className="text-white font-medium">
                      {reading.cards?.length || 0} lá
                    </p>
                  </div>
                </div>
              </div>

              {/* Cards section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white tracking-vn-tight">
                  Các lá bài của bạn
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {reading.cards && reading.cards.map((card, index) => (
                    <TarotCard
                      key={card.id}
                      card={card}
                      isReversed={card.isReversed}
                      position={index + 1}
                      interpretation={card.interpretation}
                    />
                  ))}
                </div>
              </div>

              {/* Overall interpretation */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white tracking-vn-tight">
                  Diễn giải tổng thể
                </h2>

                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed tracking-vn-tight">
                    {/* Logic phân tích JSON content từ AI */}
                    {(() => {
                      try {
                        let content = reading.combined_interpretation || reading.interpretation;
                        // Nếu là JSON string thì parse
                        if (typeof content === 'string' && (content.trim().startsWith('{') || content.trim().startsWith('['))) {
                          const json = JSON.parse(content);
                          return (
                            <div className="space-y-4">
                              {json.dailyMessage && <div><h4 className="text-[#9370db] font-bold">Thông điệp chung</h4><p>{json.dailyMessage}</p></div>}
                              {json.loveMessage && <div><h4 className="text-[#9370db] font-bold">Tình yêu</h4><p>{json.loveMessage}</p></div>}
                              {json.careerMessage && <div><h4 className="text-[#9370db] font-bold">Sự nghiệp</h4><p>{json.careerMessage}</p></div>}
                              {json.healthMessage && <div><h4 className="text-[#9370db] font-bold">Sức khỏe</h4><p>{json.healthMessage}</p></div>}
                              {!json.dailyMessage && !json.loveMessage && <p>{content}</p>}
                            </div>
                          );
                        }
                        // Nếu không phải JSON hoặc lỗi parse
                        return content || `Dựa trên các lá bài xuất hiện trong trải bài của bạn...`;
                      } catch (e) {
                        return reading.combined_interpretation || reading.interpretation || `Dựa trên các lá bài xuất hiện...`;
                      }
                    })()}
                  </p>
                </div>
              </div>

              {/* Additional actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/reading-history"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white"
                >
                  Quay lại lịch sử
                </Link>
                <Link
                  to="/tarot-readings"
                  className="px-6 py-3 bg-[#9370db] hover:bg-[#8a2be2] transition-colors rounded-lg text-white"
                >
                  Xem bói mới
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Không tìm thấy thông tin</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReadingDetailPage; 