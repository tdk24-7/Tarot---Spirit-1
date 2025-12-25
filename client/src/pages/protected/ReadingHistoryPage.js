import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import tarotService from '../../features/tarot/services/tarot.service';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Components
const SectionTitle = memo(({ title, subtitle, centered = false, light = true }) => (
  <div className={`mb-8 ${centered ? 'text-center' : ''}`}>
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-[#9370db]'} tracking-vn-tight`}>
      {title}
      <span className="block h-1 w-20 bg-gradient-to-r from-[#9370db] to-[#8a2be2] mt-2 rounded-full"></span>
    </h2>
    {subtitle && <p className={`${light ? 'text-gray-300' : 'text-gray-600'} text-lg tracking-vn-tight leading-vn`}>{subtitle}</p>}
  </div>
));

const FilterButton = memo(({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full mr-2 mb-2 text-sm font-medium transition-colors tracking-vn-tight
    ${active
        ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white shadow-md'
        : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'}`}
  >
    {label}
  </button>
));

const ReadingCard = memo(({ id, date, type, cards, result, image, topicName }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-white/10">
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="h-48 md:h-full overflow-hidden md:col-span-1">
        <img src={image || `https://placehold.co/600x400/2a1045/ffffff?text=Tarot+Reading`} alt={type} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 md:col-span-2">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs rounded-full tracking-vn-tight bg-[#9370db]/20 text-[#9370db]">
            {type}
          </span>
          <span className="text-gray-400 text-sm tracking-vn-tight">
            {new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 text-white tracking-vn-tight">{result || 'Kết quả bói bài Tarot'}</h3>

        <div className="mb-4">
          <p className="text-gray-300 tracking-vn-tight leading-vn">
            Các lá bài: {cards.join(', ')}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#2a1045] flex items-center justify-center text-[#9370db]">
              {topicName === 'Tình yêu' ? '❤️' : topicName === 'Sự nghiệp' ? '💼' : topicName === 'Sức khỏe' ? '🩺' : '🔮'}
            </span>
            <span className="text-sm text-gray-400 tracking-vn-tight">
              {topicName || 'Tổng quan'}
            </span>
          </div>

          <Link
            to={`/reading-history/${id}`}
            className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors tracking-vn-tight"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  </div>
));

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

const ReadingHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Fetch user readings from API
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        const response = await tarotService.getUserReadings();

        if (response && response.data && response.data.readings) {
          // Transform API response to expected format
          const transformedReadings = response.data.readings.map(reading => {
            // Extract card names from reading_cards
            // Extract card names from cards
            const cardNames = reading.cards
              ? reading.cards.map(card => card.name || 'Unknown Card')
              : [];

            // Determine topic name
            const topicName = reading.topic || (reading.tarot_topic ? reading.tarot_topic.name : 'Tổng quan');

            // Map topic names to categories for filtering
            let category = 'general';
            if (topicName.toLowerCase().includes('tình')) category = 'love';
            if (topicName.toLowerCase().includes('nghiệp')) category = 'career';
            if (topicName.toLowerCase().includes('khỏe')) category = 'health';
            if (reading.spread_id === 1) category = 'daily';

            return {
              id: reading.id,
              date: reading.created_at,
              type: reading.spread || (reading.tarot_spread ? reading.tarot_spread.name : 'Trải bài Tarot'),
              cards: cardNames,
              result: reading.question || 'Bói Tarot',
              category: category,
              topicName: topicName
            };
          });

          setReadings(transformedReadings);
        } else {
          // Fallback to empty array if no readings found
          setReadings([]);
        }
      } catch (error) {
        console.error('Failed to fetch reading history:', error);
        setError('Không thể tải lịch sử xem bói. Vui lòng thử lại sau.');
        toast.error('Không thể tải lịch sử xem bói');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchReadings();
    }
  }, [isAuthenticated]);

  const filterReadings = () => {
    return readings.filter(reading => {
      // Filter by category
      const categoryMatch = activeFilter === 'all' || reading.category === activeFilter;

      // Filter by date range
      let dateMatch = true;
      if (dateRange !== 'all') {
        const readingDate = new Date(reading.date);
        const now = new Date();

        if (dateRange === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          dateMatch = readingDate >= weekAgo;
        } else if (dateRange === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          dateMatch = readingDate >= monthAgo;
        } else if (dateRange === 'year') {
          const yearAgo = new Date();
          yearAgo.setFullYear(now.getFullYear() - 1);
          dateMatch = readingDate >= yearAgo;
        }
      }

      // Filter by search term
      const searchMatch = searchTerm === '' ||
        reading.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.result.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.cards.some(card => card.toLowerCase().includes(searchTerm.toLowerCase()));

      return categoryMatch && dateMatch && searchMatch;
    });
  };

  const filteredReadings = filterReadings();

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'love', label: 'Tình yêu' },
    { id: 'career', label: 'Sự nghiệp' },
    { id: 'health', label: 'Sức khỏe' },
    { id: 'daily', label: 'Hàng ngày' }
  ];

  const dateRanges = [
    { id: 'all', label: 'Tất cả thời gian' },
    { id: 'week', label: '7 ngày qua' },
    { id: 'month', label: '30 ngày qua' },
    { id: 'year', label: '365 ngày qua' }
  ];

  // Tính toán thống kê
  const stats = {
    total: readings.length,
    love: readings.filter(r => r.category === 'love').length,
    career: readings.filter(r => r.category === 'career').length,
    health: readings.filter(r => r.category === 'health').length,
    daily: readings.filter(r => r.category === 'daily').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Lịch Sử Xem Bói | Bói Tarot</title>
        <meta name="description" content="Xem lại lịch sử các lần xem bói Tarot của bạn, từ tình yêu, sự nghiệp đến sức khỏe." />
      </Helmet>

      <MysticBackground />
      <Navbar />

      {/* Main Content */}
      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl relative z-10">
          <SectionTitle
            title="Lịch Sử Xem Bói Tarot"
            subtitle="Xem lại tất cả những lần bạn đã xem bói trên Bói Tarot"
            centered
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-8">
                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white tracking-vn-tight mb-4">Thống kê</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Tổng số lần xem</p>
                      <p className="text-white font-medium tracking-vn-tight">{stats.total}</p>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Tình yêu</p>
                      <p className="text-white font-medium tracking-vn-tight">{stats.love}</p>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Sự nghiệp</p>
                      <p className="text-white font-medium tracking-vn-tight">{stats.career}</p>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Sức khỏe</p>
                      <p className="text-white font-medium tracking-vn-tight">{stats.health}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300 tracking-vn-tight">Hàng ngày</p>
                      <p className="text-white font-medium tracking-vn-tight">{stats.daily}</p>
                    </div>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white tracking-vn-tight mb-4">Thời gian</h3>
                  <div className="flex flex-wrap">
                    {dateRanges.map(range => (
                      <FilterButton
                        key={range.id}
                        label={range.label}
                        active={dateRange === range.id}
                        onClick={() => setDateRange(range.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {/* Filters & Search */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-vn-tight">Chủ đề</h3>
                    <div className="flex flex-wrap">
                      {categories.map(category => (
                        <FilterButton
                          key={category.id}
                          label={category.label}
                          active={activeFilter === category.id}
                          onClick={() => setActiveFilter(category.id)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-80">
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-vn-tight">Tìm kiếm</h3>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm theo tên bài, kết quả..."
                        className="w-full bg-white/10 border border-purple-900/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9370db] focus:border-transparent"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">
                    {error}
                  </div>
                ) : filteredReadings.length > 0 ? (
                  filteredReadings.map(reading => (
                    <ReadingCard
                      key={reading.id}
                      id={reading.id}
                      date={reading.date}
                      type={reading.type}
                      cards={reading.cards}
                      result={reading.result}
                      image={reading.image}
                      topicName={reading.topicName}
                    />
                  ))
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-xl font-bold text-white tracking-vn-tight mb-2">Chưa có kết quả</h3>
                    <p className="text-gray-400 tracking-vn-tight">
                      {readings.length > 0
                        ? 'Không có kết quả phù hợp với bộ lọc của bạn'
                        : 'Bạn chưa có lịch sử xem bói. Hãy thử xem bói ngay bây giờ!'}
                    </p>
                    {readings.length === 0 && (
                      <Link to="/tarot-readings" className="mt-4 inline-block px-6 py-2 bg-[#9370db] text-white rounded-lg font-medium tracking-vn-tight hover:bg-[#8a2be2] transition-colors">
                        Xem bói ngay
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReadingHistoryPage; 